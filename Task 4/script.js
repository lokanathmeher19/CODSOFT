// Movie Database (Content)
const movies = [
    {
        id: 1,
        title: "Inception",
        genres: ["Sci-Fi", "Action", "Thriller"],
        year: 2010,
        desc: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Cosmic Edge",
        genres: ["Sci-Fi", "Action", "Adventure"],
        year: 2026,
        desc: "In the distant future, a rogue pilot and a specialized AI navigate the uncharted sectors of the galaxy to stop an impending interstellar war.",
        img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "The Silent Comedy",
        genres: ["Comedy", "Drama"],
        year: 2023,
        desc: "A retired comedian attempts to make a comeback in a world that has forgotten how to laugh without a screen.",
        img: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Cyberpunk: Neon City",
        genres: ["Sci-Fi", "Action", "Crime"],
        year: 2025,
        desc: "In a dystopian metropolis, a hacker uncovers a massive corporate conspiracy that could destroy the fragile peace of the neon city.",
        img: "https://images.unsplash.com/photo-1518384457453-3cb377150937?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Forest of Whispers",
        genres: ["Horror", "Mystery", "Thriller"],
        year: 2022,
        desc: "A group of friends gets lost in an ancient forest where the trees seem to whisper their darkest secrets and fears.",
        img: "https://images.unsplash.com/photo-1516315585863-149021e86a07?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Love in Paris",
        genres: ["Romance", "Comedy"],
        year: 2024,
        desc: "Two rival chefs in Paris fall in love while competing for the most prestigious culinary award in France.",
        img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 7,
        title: "The Last Kingdom",
        genres: ["Action", "Historical", "Drama"],
        year: 2021,
        desc: "An epic tale of kings and warriors fighting for land, power, and survival during the dark ages.",
        img: "https://images.unsplash.com/photo-1582216503803-b0978939c150?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 8,
        title: "Deep Ocean Explorers",
        genres: ["Documentary", "Adventure"],
        year: 2026,
        desc: "Follow a team of passionate marine biologists as they dive into the Marianas Trench to discover alien-like species.",
        img: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 9,
        title: "Galactic Patrol",
        genres: ["Sci-Fi", "Comedy", "Action"],
        year: 2025,
        desc: "A ragtag group of space cops must protect the galaxy from a villain who wants to turn every planet into a parking lot.",
        img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 10,
        title: "Mind Chase",
        genres: ["Thriller", "Mystery"],
        year: 2023,
        desc: "A brilliant detective with a fragmented memory must piece together the clues of a serial killer before they strike again.",
        img: "https://images.unsplash.com/photo-1557053964-937650dd7f40?q=80&w=600&auto=format&fit=crop"
    }
];

const allGenres = [...new Set(movies.flatMap(m => m.genres))];

// App State
let userPreferences = JSON.parse(localStorage.getItem('streamRecPrefs')) || [];

// DOM Elements
const navbar = document.getElementById('navbar');
const prefModal = document.getElementById('pref-modal');
const movieModal = document.getElementById('movie-modal');
const closePrefBtn = document.getElementById('close-modal');
const closeMovieBtn = document.getElementById('close-movie-modal');
const prefBtn = document.getElementById('pref-btn');
const genreGrid = document.getElementById('genre-grid');
const savePrefBtn = document.getElementById('save-pref-btn');

const scifiRow = document.getElementById('scifi-row');
const trendingRow = document.getElementById('trending-row');
const recRow = document.getElementById('rec-row');
const myPicksSection = document.getElementById('my-picks');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Modals
prefBtn.addEventListener('click', () => {
    renderGenrePicker();
    prefModal.classList.add('active');
});
closePrefBtn.addEventListener('click', () => prefModal.classList.remove('active'));
closeMovieBtn.addEventListener('click', () => movieModal.classList.remove('active'));

window.addEventListener('click', (e) => {
    if (e.target === prefModal) prefModal.classList.remove('active');
    if (e.target === movieModal) movieModal.classList.remove('active');
});

// Render Genre Picker
function renderGenrePicker() {
    genreGrid.innerHTML = '';
    allGenres.forEach(genre => {
        const btn = document.createElement('div');
        btn.classList.add('genre-tag');
        if (userPreferences.includes(genre)) btn.classList.add('selected');
        btn.textContent = genre;
        
        btn.addEventListener('click', () => {
            btn.classList.toggle('selected');
            if (userPreferences.includes(genre)) {
                userPreferences = userPreferences.filter(g => g !== genre);
            } else {
                userPreferences.push(genre);
            }
        });
        genreGrid.appendChild(btn);
    });
}

// Save Preferences & Generate
savePrefBtn.addEventListener('click', () => {
    localStorage.setItem('streamRecPrefs', JSON.stringify(userPreferences));
    prefModal.classList.remove('active');
    renderRows();
});

// Recommender Engine (Content-Based Filtering via Jaccard Similarity)
function getRecommendations() {
    if (!userPreferences || userPreferences.length === 0) return [];
    
    // Calculate match score for each movie
    const scoredMovies = movies.map(movie => {
        // Intersection: genres exactly matching user prefs
        const intersection = movie.genres.filter(g => userPreferences.includes(g)).length;
        
        // Union: total unique genres between user prefs and movie
        const union = new Set([...movie.genres, ...userPreferences]).size;
        
        // Jaccard similarity (0 to 1) 
        const score = union === 0 ? 0 : intersection / union;
        const percentage = Math.round(score * 100);
        
        return { ...movie, matchScore: percentage };
    });
    
    // Sort by descending score, keep those having at least some match
    return scoredMovies.filter(m => m.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
}

// Render UI Rows
function createMovieCard(movie, showMatch = false) {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    
    let matchHtml = '';
    // if recommender gave it a score, or we force show it, render it
    const finalScore = movie.matchScore || Math.floor(Math.random() * 40) + 50; 
    
    if (showMatch) {
        matchHtml = `<span class="match-score">${finalScore}% Match</span>`;
    }
    
    card.innerHTML = `
        <img src="${movie.img}" alt="${movie.title}" class="movie-img">
        <div class="movie-overlay">
            <h4>${movie.title}</h4>
            ${matchHtml}
        </div>
    `;
    
    card.addEventListener('click', () => openMovieModal(movie, finalScore));
    return card;
}

function openMovieModal(movie, score) {
    document.getElementById('modal-banner').style.backgroundImage = `url(${movie.img})`;
    document.getElementById('modal-title').textContent = movie.title;
    document.getElementById('modal-match').textContent = `${score}% Match`;
    document.getElementById('modal-year').textContent = movie.year;
    document.getElementById('modal-desc').textContent = movie.desc;
    document.getElementById('modal-genres').textContent = movie.genres.join(', ');
    
    movieModal.classList.add('active');
}

function renderRows() {
    // Sci-Fi classics (just filtering by Sci-Fi)
    scifiRow.innerHTML = '';
    movies.filter(m => m.genres.includes("Sci-Fi")).forEach(movie => {
        scifiRow.appendChild(createMovieCard(movie));
    });
    
    // Trending (Randomly shuffled for demo)
    trendingRow.innerHTML = '';
    [...movies].sort(() => 0.5 - Math.random()).forEach(movie => {
        trendingRow.appendChild(createMovieCard(movie));
    });
    
    // Personal AI Recommendations
    const recs = getRecommendations();
    if (recs.length > 0) {
        myPicksSection.style.display = 'block';
        recRow.innerHTML = '';
        recs.forEach(movie => {
            recRow.appendChild(createMovieCard(movie, true));
        });
    } else {
        myPicksSection.style.display = 'none';
        
        // Show modal on first load if no prefs
        if (userPreferences.length === 0) {
            setTimeout(() => {
                renderGenrePicker();
                prefModal.classList.add('active');
            }, 1000);
        }
    }
    
    // Setup slider logic for newly created items
    setupSliders();
}

// Simple Horizontal Scrolling
function setupSliders() {
    document.querySelectorAll('.slider-container').forEach(container => {
        const row = container.querySelector('.row-content');
        const prev = container.querySelector('.prev-btn');
        const next = container.querySelector('.next-btn');
        
        if(!prev || !next) return;
        
        // Clone and replacing nodes to remove old event listeners safely
        const nextClone = next.cloneNode(true);
        const prevClone = prev.cloneNode(true);
        next.parentNode.replaceChild(nextClone, next);
        prev.parentNode.replaceChild(prevClone, prev);
        
        nextClone.addEventListener('click', () => {
            row.scrollLeft += window.innerWidth * 0.7; // scroll 70% of screen width
        });
        
        prevClone.addEventListener('click', () => {
            row.scrollLeft -= window.innerWidth * 0.7;
        });
    });
}

// Init Game
renderRows();
