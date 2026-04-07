import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.16.1';

// Ensure we use browser cache for the model
env.allowLocalModels = false;

// DOM Elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const uploadContent = document.getElementById('upload-content');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const removeBtn = document.getElementById('remove-btn');
const generateBtn = document.getElementById('generate-btn');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const resultArea = document.getElementById('result-area');
const modelStatus = document.getElementById('model-status');
const captionText = document.getElementById('caption-text');

// Progress Bar DOM
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// Webcam DOM
const startWebcamBtn = document.getElementById('start-webcam-btn');
const webcamContainer = document.getElementById('webcam-container');
const webcamVideo = document.getElementById('webcam-video');
const captureBtn = document.getElementById('capture-btn');
const closeWebcamBtn = document.getElementById('close-webcam-btn');
const offscreenCanvas = document.getElementById('offscreen-canvas');

let captioner = null;
let currentImageUrl = null;
let stream = null; // Webcam stream

// Initialize ML Model
async function loadModel() {
    try {
        modelStatus.innerText = 'Downloading AI Model parameters (approx 250MB)...';
        progressContainer.classList.remove('hidden');
        progressText.classList.remove('hidden');
        
        // We use Xenova's BLIP model for high-accuracy image captioning instead of vit-gpt2
        captioner = await pipeline('image-to-text', 'Xenova/blip-image-captioning-base', {
            progress_callback: (x) => {
                // Tracking download progress of model shards
                if (x.status === 'downloading' && x.total) {
                    // Quick approximation for a single file loaded out of the total shards
                    // Since there are multiple files, let's keep track of overall progress.
                } else if (x.status === 'progress') {
                    // Loaded ratio
                    const percent = Math.round((x.loaded / x.total) * 100);
                    progressBar.style.width = `${percent}%`;
                    progressText.innerText = `Loading ${x.file}: ${percent}%`;
                } else if (x.status === 'done') {
                    // Download complete for a file
                    progressBar.style.width = `100%`;
                }
            }
        });
        
        modelStatus.innerText = 'Model Ready! ✨';
        progressContainer.classList.add('hidden');
        progressText.classList.add('hidden');
        
        // If an image is already loaded, enable the button
        if (currentImageUrl) {
            generateBtn.disabled = false;
        }
    } catch (error) {
        console.error("Error loading model:", error);
        modelStatus.innerText = 'Failed to load AI model. Please check internet connection.';
        modelStatus.style.color = '#EF4444';
        progressContainer.classList.add('hidden');
        progressText.classList.add('hidden');
    }
}

// Start loading the model in the background immediately
loadModel();

// Webcam Handlers
startWebcamBtn.addEventListener('click', async (e) => {
    e.stopPropagation(); // Prevents it from occasionally firing standard clicks
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        webcamVideo.srcObject = stream;
        uploadContent.style.display = 'none';
        webcamContainer.classList.remove('hidden');
    } catch (err) {
        console.error("Error accessing webcam:", err);
        alert("Unable to access the camera. Please ensure you have granted permissions.");
    }
});

closeWebcamBtn.addEventListener('click', () => {
    stopWebcam();
    webcamContainer.classList.add('hidden');
    uploadContent.style.display = 'flex';
});

captureBtn.addEventListener('click', () => {
    if (!stream) return;
    
    const ctx = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = webcamVideo.videoWidth;
    offscreenCanvas.height = webcamVideo.videoHeight;
    ctx.drawImage(webcamVideo, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    const dataUrl = offscreenCanvas.toDataURL('image/png');
    
    stopWebcam();
    webcamContainer.classList.add('hidden');
    
    setImageData(dataUrl);
});

function stopWebcam() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

// Drag & Drop Handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert("Please upload an image file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        setImageData(e.target.result);
    };
    reader.readAsDataURL(file);
}

function setImageData(dataUrl) {
    currentImageUrl = dataUrl;
    imagePreview.src = currentImageUrl;
    uploadContent.style.display = 'none';
    previewContainer.classList.remove('hidden');
    
    // Reset result area
    resultArea.classList.add('hidden');
    
    // Enable generate button if model is loaded
    if (captioner) {
        generateBtn.disabled = false;
    }
}

removeBtn.addEventListener('click', () => {
    currentImageUrl = null;
    imagePreview.src = '';
    previewContainer.classList.add('hidden');
    uploadContent.style.display = 'flex';
    generateBtn.disabled = true;
    resultArea.classList.add('hidden');
    fileInput.value = '';
});

// Generate Caption
generateBtn.addEventListener('click', async () => {
    if (!captioner || !currentImageUrl) return;

    // UI Loading State
    generateBtn.disabled = true;
    btnText.innerText = 'Analyzing Image...';
    btnSpinner.classList.remove('hidden');
    resultArea.classList.remove('hidden');
    modelStatus.innerText = 'Extracting features and generating natural language...';
    captionText.innerText = '...';

    try {
        // Run the model on the image Data URL
        const result = await captioner(currentImageUrl);
        
        // Display result
        captionText.innerText = result[0].generated_text;
        modelStatus.innerText = 'Success! ✨';

        // Auto-generate some tags from the text
        const words = result[0].generated_text.replace(/[^\w\s]/g, '').toLowerCase().split(' ');
        
        // Very basic stopword list to filter out common words
        const stopwords = ['a', 'an', 'the', 'is', 'in', 'and', 'with', 'on', 'of', 'at', 'to', 'for', 'it', 'there'];
        const keywords = words.filter(word => word.length > 2 && !stopwords.includes(word));
        
        // Take unique keywords
        const uniqueKeywords = [...new Set(keywords)].slice(0, 5); // top 5 unique words
        
        const tagsContainer = document.getElementById('tags-container');
        tagsContainer.innerHTML = '';
        uniqueKeywords.forEach(keyword => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.innerText = '#' + keyword;
            tagsContainer.appendChild(span);
        });

    } catch (error) {
        console.error("Inference error:", error);
        captionText.innerText = "Error analyzing the image.";
    } finally {
        // Reset UI State
        generateBtn.disabled = false;
        btnText.innerText = 'Generate Caption';
        btnSpinner.classList.add('hidden');
    }
});

// Advanced Features: Copy to Clipboard
document.getElementById('copy-btn').addEventListener('click', () => {
    const textToCopy = captionText.innerText;
    if (textToCopy && textToCopy !== '...') {
        navigator.clipboard.writeText(textToCopy).then(() => {
            const copyBtn = document.getElementById('copy-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    }
});

// Advanced Features: Text-to-Speech (Listen)
document.getElementById('speak-btn').addEventListener('click', () => {
    const textToSpeak = captionText.innerText;
    if (textToSpeak && textToSpeak !== '...' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.9; // Slightly slower for better clarity
        // Optionally try to pick a good English voice
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices[0];
        if (voice) utterance.voice = voice;
        
        window.speechSynthesis.speak(utterance);
    } else if (!('speechSynthesis' in window)) {
        alert("Text-to-speech is not supported in this browser.");
    }
});

// Advanced Features: Export Image Card
document.getElementById('download-btn').addEventListener('click', () => {
    if (!currentImageUrl || !captionText.innerText || captionText.innerText === '...') return;
    
    // Create an off-screen canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Load the image to get dimensions
    const img = new Image();
    img.onload = () => {
        // Set canvas dimensions (Polaroid style)
        const width = 800; // fixed width
        const scale = width / img.width;
        const imgHeight = img.height * scale;
        
        // Canvas height includes space for text
        canvas.width = width;
        canvas.height = imgHeight + 150; 
        
        // Draw background
        ctx.fillStyle = '#0F172A'; // Match app background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, imgHeight);
        
        // Draw Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        
        // Handle long text wrapping (simple approach)
        const text = captionText.innerText;
        const maxWidth = width - 60;
        const words = text.split(' ');
        let line = '';
        let y = imgHeight + 50;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, width / 2, y);
                line = words[n] + ' ';
                y += 35;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, width / 2, y);
        
        // Draw Watermark
        ctx.fillStyle = '#64748B';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Generated by VisionCaption AI', width / 2, canvas.height - 20);

        // Download
        const link = document.createElement('a');
        link.download = 'ai_generated_caption.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
    img.src = currentImageUrl;
});
