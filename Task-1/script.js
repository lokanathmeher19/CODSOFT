// DOM Elements
const chatBox = document.getElementById('chat-box');
const userInputWrapper = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const micBtn = document.getElementById('micBtn');
const actionChipsContainer = document.getElementById('action-chips');
const exportBtn = document.getElementById('exportBtn');

// Memory (State)
let userState = JSON.parse(localStorage.getItem('nexusUserState')) || {
    name: null,
    topic: null,
    themeColor: null
};
let chatHistory = JSON.parse(localStorage.getItem('nexusChatHistory')) || [];

function saveState() {
    localStorage.setItem('nexusUserState', JSON.stringify(userState));
    localStorage.setItem('nexusChatHistory', JSON.stringify(chatHistory));
}

// Apply theme on load
if (userState.themeColor) {
    document.documentElement.style.setProperty('--primary-color', userState.themeColor);
}

// Auto-scroll functionality
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Format current time
function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Append a message to the chat box
function appendMessage(text, sender, time = null, save = true) {
    const isBot = sender === 'bot';
    const messageTime = time || getCurrentTime();
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isBot ? 'bot-message' : 'user-message');
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.innerHTML = `<p>${text}</p>`;
    
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('timestamp');
    timeSpan.textContent = messageTime;
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeSpan);
    
    chatBox.appendChild(messageDiv);
    scrollToBottom();

    if (save) {
        chatHistory.push({ text, sender, time: messageTime });
        saveState();
    }
}

/** 
 * SCALABLE INTENT ENGINE 
 * Replaces the messy if/else block with a data-driven model.
 */
const intents = [
    {
        name: 'greeting',
        patterns: [/\b(hi+|hello+|hey+|greetings|howdy|sup|hlw)\b/i],
        responses: ["Hello there! How can I assist you today?", "Hi! I am Nexus.", "Greetings!"],
        chips: [ {label: "Who are you?", text: "who are you"}, {label: "Tell me a joke", text: "tell me a joke"} ]
    },
    {
        name: 'identity',
        patterns: [/\b(name|who are you|your identity)\b/i],
        responses: ["I am Nexus, an advanced rule-based AI assistant designed for Task 1 of the CodeSoft Internship."]
    },
    {
        name: 'how_are_you',
        patterns: [/\b(how are you|how do you do|how are things|hru|how r u)\b/i],
        responses: ["I'm operating at maximum capacity! Thank you for asking. How are you?"]
    },
    {
        name: 'datetime_all',
        patterns: [/\b(perfect date|perfect time|full date|complete date|date and time|time and date|date time|time date|everything about today|tell me all|tell me everything|date time day month)\b/i],
        action: () => {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            const day = now.toLocaleDateString(undefined, { weekday: 'long' });
            const month = now.toLocaleDateString(undefined, { month: 'long' });
            const dateNum = now.getDate();
            const year = now.getFullYear();
            return `Here are the perfect, complete details: The time is <strong>${time}</strong>. Today is <strong>${day}</strong>, <strong>${month} ${dateNum}</strong>, in the year <strong>${year}</strong>.`;
        }
    },
    {
        name: 'time',
        patterns: [/\b(time|clock)\b/i],
        action: () => {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            return `The current local time is <strong>${time}</strong>.`;
        }
    },
    {
        name: 'date',
        patterns: [/\b(date|today)\b/i],
        action: () => {
            const date = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return `Today's date is <strong>${date}</strong>.`;
        }
    },
    {
        name: 'day',
        patterns: [/\b(day|which day|what day)\b/i],
        action: () => {
            const day = new Date().toLocaleDateString(undefined, { weekday: 'long' });
            return `Today is <strong>${day}</strong>.`;
        }
    },
    {
        name: 'month',
        patterns: [/\b(month|which month|what month)\b/i],
        action: () => {
            const month = new Date().toLocaleDateString(undefined, { month: 'long' });
            return `The current month is <strong>${month}</strong>.`;
        }
    },
    {
        name: 'year',
        patterns: [/\b(year|which year|what year)\b/i],
        action: () => {
            const year = new Date().getFullYear();
            return `We are in the year <strong>${year}</strong>.`;
        }
    },
    {
        name: 'joke',
        patterns: [/\b(joke|funny|laugh|humor)\b/i],
        responses: [
            "Why do programmers prefer dark mode? Because light bugs attract bugs!",
            "There are 10 types of people in the world: those who understand binary, and those who don't.",
            "Why did the JavaScript developer wear glasses? Because they couldn't C#!"
        ],
        chips: [ {label: "Another joke!", text: "tell me a joke"}, {label: "Show me a cat", text: "show me a cat"} ]
    },
    {
        name: 'help',
        patterns: [/\b(help|can you do|features|commands)\b/i],
        responses: ["I can currently handle:<br>- Small talk<br>- Time & Date<br>- Telling jokes & fun facts<br>- Remembering your name<br>- Math calculations<br>- Generating passwords<br>- Flipping a coin / Rolling a dice<br>- Displaying cute cats<br>- Changing themes!"]
    },
    {
        name: 'fact',
        patterns: [/\b(fact|interesting|tell me something new)\b/i],
        responses: [
            "Did you know the first computer programmer was a woman named Ada Lovelace?",
            "The term 'bug' in computing was coined after a real moth was found stuck in a relay.",
            "The first 1GB hard drive weighed over 500 pounds!"
        ],
        chips: [ {label: "Another fact!", text: "tell me a fact"}, {label: "Flip coin?", text: "flip a coin"} ]
    },
    {
        name: 'math',
        patterns: [/(?:calculate|what is|solve) ([0-9\+\-\*\/\(\)\.\s]+)/i],
        action: (match) => {
            try {
                if (match && match[1]) {
                    const expression = match[1].replace(/[^-()\d/*+.]/g, ''); 
                    if (expression.trim() === '') return "Please provide a valid math expression.";
                    const result = new Function(`return ${expression}`)();
                    return `The answer is ${result}.`;
                }
                return "I couldn't understand the math expression.";
            } catch (e) {
                return "I couldn't calculate that. Make sure it's a valid math expression!";
            }
        }
    },
    {
        name: 'goodbye',
        patterns: [/\b(bye|goodbye|see ya|cya|later|farewell)\b/i],
        responses: ["Goodbye! Have a great day!", "See you later!", "Bye! Let me know if you need anything else."]
    },
    {
        name: 'thanks',
        patterns: [/\b(thanks|thank you|ty|appreciate)\b/i],
        responses: ["You're very welcome!", "No problem at all!", "Glad I could help!"]
    },
    {
        name: 'change_theme',
        patterns: [/\b(change theme to|set theme color to) (red|blue|green|purple|pink|yellow|orange)\b/i],
        action: (match) => {
            if (match && match[2]) {
                const colors = {
                    'red': '#ef4444',
                    'blue': '#3b82f6',
                    'green': '#10b981',
                    'purple': '#8b5cf6',
                    'pink': '#ec4899',
                    'yellow': '#eab308',
                    'orange': '#f97316'
                };
                const colorName = match[2].toLowerCase();
                const hexColor = colors[colorName];
                
                if (hexColor) {
                    document.documentElement.style.setProperty('--primary-color', hexColor);
                    userState.themeColor = hexColor;
                    saveState();
                    return `Theme color changed to ${colorName}!`;
                }
            }
            return "I couldn't change the theme to that color.";
        }
    },
    {
        name: 'creator',
        patterns: [/\b(who created you|who made you|your creator|who is your creator)\b/i],
        responses: ["I was created by Lokanath Meher during the CodeSoft Internship!"]
    },
    {
        name: 'coin_flip',
        patterns: [/\b(flip a coin|coin flip|heads or tails)\b/i],
        action: () => {
            const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
            return `I flipped a coin and it landed on <strong>${result}</strong>!`;
        }
    },
    {
        name: 'dice_roll',
        patterns: [/\b(roll a dice|dice roll|roll dice)\b/i],
        action: () => {
            const result = Math.floor(Math.random() * 6) + 1;
            return `I rolled a standard 6-sided die and got a <strong>${result}</strong>!`;
        }
    },
    {
        name: 'password_gen',
        patterns: [/\b(generate password|password generator|create a password)\b/i],
        action: () => {
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            let pwd = "";
            for(let i=0; i<16; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
            return `Here is a secure 16-character password: <br><br><code style="background: rgba(0,0,0,0.3); padding: 6px 10px; border-radius: 6px; letter-spacing: 2px; font-family: monospace;">${pwd}</code>`;
        }
    },
    {
        name: 'random_cat',
        patterns: [/\b(cat|show me a cat|cute cat|kitty)\b/i],
        action: () => {
            return `Meow! Here is a cute cat for you:<br><img src="https://cataas.com/cat?t=${Date.now()}" style="width:100%; max-height:250px; object-fit:cover; border-radius:10px; margin-top:10px; border: 1px solid rgba(255,255,255,0.1);" alt="Cute Cat">`;
        }
    },
    {
        name: 'matrix_easter_egg',
        patterns: [/\b(matrix|hacker mode)\b/i],
        action: () => {
            document.body.classList.toggle('matrix-mode');
            const isOn = document.body.classList.contains('matrix-mode');
            return isOn ? "Wake up, Neo... The Matrix has you." : "System restored to normal.";
        }
    },
    {
        name: 'barrel_easter_egg',
        patterns: [/\bdo a barrel roll\b/i],
        action: () => {
            document.body.classList.remove('barrel-roll');
            // Re-trigger animation
            void document.body.offsetWidth; 
            document.body.classList.add('barrel-roll');
            setTimeout(() => document.body.classList.remove('barrel-roll'), 2000);
            return "Wheeeeee!";
        }
    }
];

function getBotResponse(input) {
    const text = input.trim();
    
    // STATEFUL CAPABILITIES (Memory)
    // 1. Check if user is telling us their name
    const nameMatch = text.match(/my name is ([a-zA-Z\s]+)/i);
    if (nameMatch && nameMatch[1]) {
        userState.name = nameMatch[1].trim();
        return `Nice to meet you, ${userState.name}! I'll remember that.`;
    }
    
    // 2. Check if user is asking if we remember their name
    if (text.match(/what is my name|do you know my name/i)) {
        if (userState.name) return `Yes, your name is ${userState.name}!`;
        return "You haven't told me your name yet! You can say 'My name is...'";
    }

    // INTENT MATCHING ALGORITHM
    const lowerText = text.toLowerCase();
    for (let intent of intents) {
        for (let pattern of intent.patterns) {
            const match = lowerText.match(pattern);
            if (match) {
                // Update Chips Contextually
                const chipsToUse = intent.chips || [
                    {label: "Who are you?", text: "who are you"},
                    {label: "Joke?", text: "tell me a joke"},
                    {label: "Time?", text: "what time is it"}
                ];
                updateActionChips(chipsToUse);

                if (intent.action) {
                    return intent.action(match);
                } else if (intent.responses) {
                    return intent.responses[Math.floor(Math.random() * intent.responses.length)];
                }
            }
        }
    }

    // FALLBACK
    if (userState.name) {
        return `I'm sorry ${userState.name}, I don't quite understand that command. Try asking for a joke or the time!`;
    }
    return "I'm sorry, my rules only allow me to respond to specific keywords right now. Try asking for a joke or say 'help'.";
}

// Process user input and trigger bot response
function handleUserInput(text = null) {
    const userText = text || userInputWrapper.value;
    
    if (userText.trim() === '') return;
    
    // 1. Display User Message
    appendMessage(userText, 'user');
    
    if (!text) userInputWrapper.value = ''; // clear input if generated manually
    
    // 2. Show Typing Indicator
    typingIndicator.classList.add('active');
    scrollToBottom();
    
    // 3. Process Response with a synthetic delay for realism
    setTimeout(() => {
        const botResponse = getBotResponse(userText);
        typingIndicator.classList.remove('active');
        appendMessage(botResponse, 'bot');
        speakText(botResponse); // 🗣️ Make the bot speak the response
    }, 800 + Math.random() * 600); 
}

// Function to read text out loud
function speakText(text) {
    // Strip out any HTML tags (like <br>) so it doesn't read them out loud
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = cleanText;
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
}

// Event Listeners for standard input
sendBtn.addEventListener('click', () => handleUserInput());
userInputWrapper.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

// Dynamic Action Chips Function
function updateActionChips(chips) {
    if (!actionChipsContainer) return;
    actionChipsContainer.innerHTML = ''; // Clear existing chips
    chips.forEach(chip => {
        const btn = document.createElement('button');
        btn.classList.add('chip');
        btn.setAttribute('data-text', chip.text);
        btn.textContent = chip.label;
        btn.addEventListener('click', () => handleUserInput(chip.text));
        actionChipsContainer.appendChild(btn);
    });
}

// Ensure first set of chips work
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        handleUserInput(chip.getAttribute('data-text'));
    });
});

// Event Listener for Menu Button (Clear Chat)
const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all chat history and memory?")) {
            localStorage.removeItem('nexusChatHistory');
            localStorage.removeItem('nexusUserState');
            chatHistory = [];
            userState = { name: null, topic: null };
            chatBox.innerHTML = '';
            initChat();
        }
    });
}

// Download Chat Log Feature
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        let chatLog = "--- Nexus AI Chat Log ---\n\n";
        chatHistory.forEach(msg => {
            const cleanMsg = msg.text.replace(/<[^>]*>?/gm, '');
            chatLog += `[${msg.time}] ${msg.sender.toUpperCase()}: ${cleanMsg}\n`;
        });
        
        const blob = new Blob([chatLog], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Nexus_ChatLog.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

// Voice Dictation Feature
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        micBtn.classList.add('listening');
        userInputWrapper.placeholder = "Listening...";
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        userInputWrapper.value = transcript;
        handleUserInput(); // Auto-send when finished talking
    };

    recognition.onerror = function(event) {
        micBtn.classList.remove('listening');
        userInputWrapper.placeholder = "Type your message here...";
        console.error("Speech error", event.error);
    };

    recognition.onend = function() {
        micBtn.classList.remove('listening');
        userInputWrapper.placeholder = "Type your message here...";
    };

    micBtn.addEventListener('click', () => {
        if (micBtn.classList.contains('listening')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
} else {
    micBtn.style.display = 'none'; // Hide if browser doesn't support Voice API
}

// Initialize Chat from Local Storage
function initChat() {
    if (chatHistory.length > 0) {
        chatBox.innerHTML = ''; // clear static intro
        chatHistory.forEach(msg => {
            appendMessage(msg.text, msg.sender, msg.time, false);
        });
        scrollToBottom();
    } else {
        // save the initial intro message on very first run
        chatHistory.push({ 
            text: "Hello! I am Nexus, a rule-based AI assistant. How can I help you today? Try asking me about my name, weather, time, or ask for a joke!", 
            sender: "bot", 
            time: "Just now" 
        });
        saveState();
    }
}
initChat();
