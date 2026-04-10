const movies = [
    { id: 1, title: "Inception", genres: ["Sci-Fi", "Action", "Thriller"], year: 2010, desc: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop" },
    { id: 2, title: "Cosmic Edge", genres: ["Sci-Fi", "Action", "Adventure"], year: 2026, desc: "In the distant future, a rogue pilot and a specialized AI navigate the uncharted sectors of the galaxy to stop an impending interstellar war.", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop" },
    { id: 3, title: "The Silent Comedy", genres: ["Comedy", "Drama"], year: 2023, desc: "A retired comedian attempts to make a comeback in a world that has forgotten how to laugh without a screen.", img: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=600&auto=format&fit=crop" },
    { id: 4, title: "Cyberpunk: Neon City", genres: ["Sci-Fi", "Action", "Crime"], year: 2025, desc: "In a dystopian metropolis, a hacker uncovers a massive corporate conspiracy that could destroy the fragile peace of the neon city.", img: "https://images.unsplash.com/photo-1518384457453-3cb377150937?q=80&w=600&auto=format&fit=crop" },
    { id: 5, title: "Forest of Whispers", genres: ["Horror", "Mystery", "Thriller"], year: 2022, desc: "A group of friends gets lost in an ancient forest where the trees seem to whisper their darkest secrets and fears.", img: "https://images.unsplash.com/photo-1516315585863-149021e86a07?q=80&w=600&auto=format&fit=crop" },
    { id: 6, title: "Love in Paris", genres: ["Romance", "Comedy"], year: 2024, desc: "Two rival chefs in Paris fall in love while competing for the most prestigious culinary award in France.", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop" },
    { id: 7, title: "The Last Kingdom", genres: ["Action", "Historical", "Drama"], year: 2021, desc: "An epic tale of kings and warriors fighting for land, power, and survival during the dark ages.", img: "https://images.unsplash.com/photo-1582216503803-b0978939c150?q=80&w=600&auto=format&fit=crop" },
    { id: 8, title: "Deep Ocean Explorers", genres: ["Documentary", "Adventure"], year: 2026, desc: "Follow a team of passionate marine biologists as they dive into the Marianas Trench to discover alien-like species.", img: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?q=80&w=600&auto=format&fit=crop" },
    { id: 9, title: "Galactic Patrol", genres: ["Sci-Fi", "Comedy", "Action"], year: 2025, desc: "A ragtag group of space cops must protect the galaxy from a villain who wants to turn every planet into a parking lot.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop" },
    { id: 10, title: "Mind Chase", genres: ["Thriller", "Mystery"], year: 2023, desc: "A brilliant detective with a fragmented memory must piece together the clues of a serial killer before they strike again.", img: "https://images.unsplash.com/photo-1557053964-937650dd7f40?q=80&w=600&auto=format&fit=crop" },
    { id: 11, title: "Jungle Safari", genres: ["Adventure", "Family"], year: 2022, desc: "A family gets more adventure than they bargained for when they get stranded on a wild safari trip.", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600&auto=format&fit=crop" },
    { id: 12, title: "The Quantum Realm", genres: ["Sci-Fi", "Thriller"], year: 2024, desc: "Scientists break the boundaries of physics, opening a portal to a dimension where time flows backward.", img: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=600&auto=format&fit=crop" },
    { id: 13, title: "Midnight Heist", genres: ["Crime", "Action", "Thriller"], year: 2023, desc: "An elite crew of thieves attempt the impossible: stealing the world's most guarded diamond during a total blackout.", img: "https://images.unsplash.com/photo-1532454655913-64906f35b62b?q=80&w=600&auto=format&fit=crop" },
    { id: 14, title: "Castle of Dr. Alastair", genres: ["Horror", "Fantasy"], year: 2021, desc: "A young historian inherits a castle in Transylvania, only to discover the horrifying truth about her ancestors.", img: "https://images.unsplash.com/photo-1570757753303-605b0c797fb0?q=80&w=600&auto=format&fit=crop" },
    { id: 15, title: "Standup Guy", genres: ["Comedy"], year: 2022, desc: "A socially awkward programmer accidentally becomes a viral stand-up sensation overnight.", img: "https://images.unsplash.com/photo-1560946258-2945a89fb356?q=80&w=600&auto=format&fit=crop" },
    { id: 16, title: "Racing Hearts", genres: ["Romance", "Action"], year: 2025, desc: "Two rival street racers find themselves falling for each other amidst a dangerous underground tournament.", img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600&auto=format&fit=crop" },
    { id: 17, title: "The Forgotten Era", genres: ["Historical", "Documentary"], year: 2023, desc: "An eye-opening documentary exploring unrecorded civilizations that thrived thousands of years ago.", img: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?q=80&w=600&auto=format&fit=crop" },
    { id: 18, title: "Blade Run", genres: ["Action", "Sci-Fi"], year: 2024, desc: "In a world ruled by rogue machines, the last human warriors fight back with everything they have.", img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=600&auto=format&fit=crop" },
    { id: 19, title: "Laugh Riot", genres: ["Comedy", "Family"], year: 2021, desc: "A chaotic family reunion turns into an unforgettable and hilarious disaster.", img: "https://images.unsplash.com/photo-1506869640319-fea1a2ab8e4e?q=80&w=600&auto=format&fit=crop" },
    { id: 20, title: "Abyss", genres: ["Horror", "Sci-Fi"], year: 2026, desc: "A deep-sea mining crew unearths an ancient terror hidden beneath the ocean floor.", img: "https://images.unsplash.com/photo-1518144591331-17a5dd71c477?q=80&w=600&auto=format&fit=crop" }
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
const actionRow = document.getElementById('action-row');
const comedyRow = document.getElementById('comedy-row');
const horrorRow = document.getElementById('horror-row');
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
    
    // Action & Adventure
    if (actionRow) {
        actionRow.innerHTML = '';
        movies.filter(m => m.genres.includes("Action") || m.genres.includes("Adventure")).forEach(movie => {
            actionRow.appendChild(createMovieCard(movie));
        });
    }

    // Comedy Nights
    if (comedyRow) {
        comedyRow.innerHTML = '';
        movies.filter(m => m.genres.includes("Comedy")).forEach(movie => {
            comedyRow.appendChild(createMovieCard(movie));
        });
    }

    // Horror & Thriller
    if (horrorRow) {
        horrorRow.innerHTML = '';
        movies.filter(m => m.genres.includes("Horror") || m.genres.includes("Thriller")).forEach(movie => {
            horrorRow.appendChild(createMovieCard(movie));
        });
    }
    
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
            row.scrollBy({ left: window.innerWidth * 0.7, behavior: 'smooth' });
        });
        
        prevClone.addEventListener('click', () => {
            row.scrollBy({ left: -window.innerWidth * 0.7, behavior: 'smooth' });
        });
    });
}

// Init Game
renderRows();
