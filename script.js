// script.js - Core Logic, State Management, and Event Listeners

// =======================================================================
// Global State, Constants, and Budget/Visitor Tracking
// =======================================================================

const ADMIN_PASSWORD = "admin8pm"; 
const MAX_REQUESTS_PER_MONTH = 500;
const LS_REQUEST_COUNT_KEY = 'apiRequestsUsed';
const UNIQUE_VISITOR_FLAG = 'dashboardVisited';
const LS_UNIQUE_COUNT_KEY = 'globalUniqueVisitorCount';
const LS_TOTAL_VIEWS_KEY = 'globalTotalViewsCount';

let currentPortfolio = [];
let currentLang = localStorage.getItem('appLang') || 'en';
let lastUpdateTime = localStorage.getItem('lastApiUpdate') || 'Never';
let apiRequestsUsed = parseInt(localStorage.getItem(LS_REQUEST_COUNT_KEY) || '0');
let globalUniqueVisitors = parseInt(localStorage.getItem(LS_UNIQUE_COUNT_KEY) || '0');
let globalTotalViews = parseInt(localStorage.getItem(LS_TOTAL_VIEWS_KEY) || '0');

let processedGameData = []; 

// =======================================================================
// Utility Functions (EV, Staking, VIG)
// =======================================================================

function calculateEV(odds, trueProbability) {
    const probDecimal = trueProbability / 100;
    return ((probDecimal * odds) - 1) * 100;
}

function determineStake(evPercent) {
    if (evPercent >= 5.0) return 3.0;
    if (evPercent >= 3.0) return 2.0;
    if (evPercent >= 2.0) return 1.0;
    if (evPercent >= 0.5) return 0.5;
    return 0.0;
}

function getMarketConfidence(oddsHome, oddsAway) {
    const ipHome = 1 / oddsHome;
    const ipAway = 1 / oddsAway;
    const vigPercent = ((ipHome + ipAway) - 1) * 100;
    
    let score;
    if (vigPercent >= 8.0) {
        score = 'Low'; 
    } else if (vigPercent >= 5.0) {
        score = 'Medium'; 
    } else {
        score = 'High'; 
    }
    return { score, message: `VIG: ${vigPercent.toFixed(1)}%` };
}

// =======================================================================
// Data Processing and Rendering
// =======================================================================

function initializeGameData(data) {
    if (typeof data === 'undefined' || !Array.isArray(data)) {
        console.error("Error: Game data is not available.");
        return [];
    }
    
    return data.map(game => {
        const homeEV = calculateEV(game.oddsHome, game.probHome);
        const awayEV = calculateEV(game.oddsAway, game.probAway);
        
        const teamToBet = homeEV > awayEV ? game.home : game.away;
        const evToBet = Math.max(homeEV, awayEV);
        const oddsToBet = teamToBet === game.home ? game.oddsHome : game.oddsAway;
        const stake = determineStake(evToBet);
        const marketConfidence = getMarketConfidence(game.oddsHome, game.oddsAway);
        
        const lineupStatus = game.lineupStatus || 'Expected'; 

        return {
            ...game,
            teamToBet,
            oddsToBet,
            evToBet,
            stake,
            marketConfidenceScore: marketConfidence.score,
            marketConfidenceMessage: marketConfidence.message,
            lineupStatus: lineupStatus,
        };
    });
}

function renderGames() {
    const container = document.getElementById('games-container');
    container.innerHTML = '';
    
    if (!processedGameData || processedGameData.length === 0) {
        container.innerHTML = `<p data-key="loadingMessage">${translate('loadingMessage')}</p>`;
        return;
    }
    
    let filteredGames = [...processedGameData]; 

    filteredGames.forEach(game => {
        const evClass = game.evToBet > 0.5 ? 'ev-positive' : (game.evToBet <= 0.0 ? 'ev-negative' : 'ev-marginal');
        const stakeClass = game.stake >= 2.0 ? 'stake-high' : (game.stake >= 0.5 ? 'stake-medium' : 'stake-low');
        const lineupClass = game.lineupStatus === 'Impactful' ? 'lineup-alert' : '';

        const isAdded = currentPortfolio.some(item => item.id === game.id);
        const buttonKey = isAdded ? 'buttonAdded' : 'buttonAdd';
        
        const gameCardHTML = `
            <div class="game-card ${evClass} ${lineupClass}" data-id="${game.id}">
                <h3 class="game-title">${game.away} @ ${game.home} (${game.sport})</h3>
                <p class="game-time">${new Date(game.date).toLocaleTimeString(currentLang, { hour: '2-digit', minute: '2-digit' })}</p>
                <hr>
                <div class="odds-header">
                    <span class="team-label"></span>
                    <span>${translate('oddsLabel')}</span>
                    <span>Prob.</span>
                </div>
                <div class="odds-row home-row ${game.teamToBet === game.home ? 'best-play-side' : ''}">
                    <p class="team-label">${game.home}</p>
                    <p class="odds-value">${game.oddsHome.toFixed(2)}</p>
                    <p class="model-prob">${game.probHome.toFixed(1)}%</p>
                </div>
                <div class="odds-row away-row ${game.teamToBet === game.away ? 'best-play-side' : ''}">
                    <p class="team-label">${game.away}</p>
                    <p class="odds-value">${game.oddsAway.toFixed(2)}</p>
                    <p class="model-prob">${game.probAway.toFixed(1)}%</p>
                </div>
                <hr>
                <div class="analysis-box ${evClass}">
                    <p data-key="evLabel">${translate('evLabel')}: <strong>${game.evToBet.toFixed(2)}%</strong></p>
                    <p data-key="stakeLabel">${translate('stakeLabel')}: <strong class="${stakeClass}">${game.stake.toFixed(1)} U</strong></p>
                </div>
                <p class="recommendation">
                    Best Play: <strong class="best-bet-name">${game.teamToBet}</strong>
                </p>
                <div class="meta-data">
                    <span class="meta-item lineup-status">
                        ${translate('lineupLabel')}: ${translate(game.lineupStatus === 'Impactful' ? 'impactfulLineup' : 'expectedLineup')}
                    </span>
                    <span class="meta-item market-confidence">
                        ${translate('confidenceLabel')}: ${translate(`confidence${game.marketConfidenceScore}`)} (${game.marketConfidenceMessage})
                    </span>
                </div>
                <button class="add-to-portfolio-btn" data-key="${buttonKey}" data-id="${game.id}" ${game.stake < 0.5 ? 'disabled' : ''}>
                    ${translate(buttonKey)}
                </button>
            </div>
        `;
        container.innerHTML += gameCardHTML;
    });
}

function findBestEVPlay() {
    const bestPlay = processedGameData.reduce((max, game) => (game.evToBet > max.evToBet ? game : max), { evToBet: -Infinity });

    const panel = document.getElementById('best-play-card');
    if (bestPlay && bestPlay.evToBet > 0.5) {
        panel.innerHTML = `
            <p>Game: <strong>${bestPlay.away} @ ${bestPlay.home}</strong></p>
            <p>Pick: <strong>${bestPlay.teamToBet}</strong> @ ${bestPlay.oddsToBet.toFixed(2)}</p>
            <p data-key="evLabel">${translate('evLabel')}: <strong class="ev-positive">${bestPlay.evToBet.toFixed(2)}%</strong></p>
            <p data-key="stakeLabel">${translate('stakeLabel')}: <strong class="stake-high">${bestPlay.stake.toFixed(1)} Units (Max recommended)</strong></p>
        `;
    } else {
        panel.innerHTML = `<p data-key="noBestPlay">${translate('noBestPlay')}</p>`;
    }
}


// =======================================================================
// Budget, Visitor, and Header Logic
// =======================================================================

function fetchAndRenderData() {
    // CRITICAL: Budget Check and Increment - ONLY RUNS ON BUTTON PRESS
    if (apiRequestsUsed >= MAX_REQUESTS_PER_MONTH) {
        alert("API BUDGET EXCEEDED: Cannot fetch new data until next month.");
        return; 
    }

    // 1. Increment Budget Counter
    apiRequestsUsed++;
    localStorage.setItem(LS_REQUEST_COUNT_KEY, apiRequestsUsed);

    // 2. Update Timestamp and Process Data
    lastUpdateTime = new Date().toLocaleTimeString();
    localStorage.setItem('lastApiUpdate', lastUpdateTime);
    
    // Process the currently loaded mock data (Simulates fetching new data)
    processedGameData = initializeGameData(mockGameData); 
    
    // 3. Update UI
    updateHeaderStatus();
    renderGames(); 
    findBestEVPlay();
}

function updateHeaderStatus() {
    document.getElementById('data-update-status').textContent = `Data Last Updated: ${lastUpdateTime}`;
    document.getElementById('budget-status').textContent = `API Budget: ${apiRequestsUsed}/${MAX_REQUESTS_PER_MONTH} Used`;
    
    const adminInput = document.getElementById('admin-code-input');
    const fetchButton = document.getElementById('fetch-data-btn');
    if (adminInput && fetchButton) {
        const isBudgetAvailable = apiRequestsUsed < MAX_REQUESTS_PER_MONTH;
        if (!isBudgetAvailable || adminInput.value !== ADMIN_PASSWORD) {
            fetchButton.classList.add('disabled');
            fetchButton.setAttribute('disabled', 'disabled');
        }
    }
}

function trackVisitors() {
    let isNewVisitor = localStorage.getItem(UNIQUE_VISITOR_FLAG) === null;

    // 1. Increment Total Views
    globalTotalViews++;
    localStorage.setItem(LS_TOTAL_VIEWS_KEY, globalTotalViews);

    // 2. Check for Unique Visitor (Only increments if the local storage flag is missing)
    if (isNewVisitor) {
        globalUniqueVisitors++;
        localStorage.setItem(LS_UNIQUE_COUNT_KEY, globalUniqueVisitors);
        localStorage.setItem(UNIQUE_VISITOR_FLAG, 'true');
    }

    // 3. Render the counts on the dashboard
    const uniqueEl = document.getElementById('unique-visitors-count');
    const totalEl = document.getElementById('total-views-count');
    if (uniqueEl) uniqueEl.textContent = globalUniqueVisitors;
    if (totalEl) totalEl.textContent = globalTotalViews;
}

// =======================================================================
// Translation and Manual Calculator Logic
// =======================================================================

function translate(key) {
    return (typeof languageDictionary !== 'undefined' && languageDictionary[key]) ? languageDictionary[key][currentLang] : key;
}

function translatePage(lang) {
    currentLang = lang;
    localStorage.setItem('appLang', lang);

    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (typeof languageDictionary !== 'undefined' && languageDictionary[key] && languageDictionary[key][lang]) {
            element.textContent = languageDictionary[key][lang];
        }
    });
    renderGames(); 
    findBestEVPlay();
}

function calculateManualEV() {
    const oddsInput = parseFloat(document.getElementById('odds-input').value);
    const probInput = parseFloat(document.getElementById('prob-input').value);
    const evResultEl = document.getElementById('manual-ev-result');
    const verdictEl = document.getElementById('manual-action-verdict');

    if (isNaN(oddsInput) || isNaN(probInput) || oddsInput <= 1 || probInput < 0 || probInput > 100) {
        evResultEl.textContent = '0.00%';
        verdictEl.textContent = translate('verdictInput');
        verdictEl.className = 'verdict-neutral';
        return;
    }

    const ev = calculateEV(oddsInput, probInput); 
    const stake = determineStake(ev);

    evResultEl.textContent = `${ev.toFixed(2)}%`;
    evResultEl.className = ev > 0.5 ? 'ev-positive' : 'ev-negative';

    let verdictKey;
    if (stake >= 2.0) {
        verdictKey = 'verdictStrongBuy';
        verdictEl.className = 'verdict-strong-buy';
    } else if (stake >= 1.0) {
        verdictKey = 'verdictGoodValue';
        verdictEl.className = 'verdict-good-value';
    } else if (stake >= 0.5) {
        verdictKey = 'verdictMarginal';
        verdictEl.className = 'verdict-marginal';
    } else {
        verdictKey = 'verdictAvoid';
        verdictEl.className = 'verdict-avoid';
    }
    verdictEl.textContent = translate(verdictKey);
}

// =======================================================================
// Initial Dashboard Setup (0 API Cost on load)
// =======================================================================

function initializeDashboard() {
    if (typeof mockGameData !== 'undefined') {
        processedGameData = initializeGameData(mockGameData);
    }
    updateHeaderStatus();
    renderGames(); 
    findBestEVPlay();
}


// =======================================================================
// DOM Load and Event Listeners
// =======================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INITIAL SETUP
    trackVisitors(); 
    
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('change', (event) => {
            translatePage(event.target.value);
        });
    }
    translatePage(currentLang);

    initializeDashboard();

    // 2. EVENT LISTENERS
    
    const adminInput = document.getElementById('admin-code-input');
    const fetchButton = document.getElementById('fetch-data-btn');

    if (adminInput && fetchButton) {
        adminInput.addEventListener('input', () => {
            const isBudgetAvailable = apiRequestsUsed < MAX_REQUESTS_PER_MONTH;

            if (adminInput.value === ADMIN_PASSWORD && isBudgetAvailable) {
                fetchButton.classList.remove('disabled');
                fetchButton.removeAttribute('disabled');
                adminInput.style.borderColor = '#4CAF50';
            } else {
                fetchButton.classList.add('disabled');
                fetchButton.setAttribute('disabled', 'disabled');
                adminInput.style.borderColor = '#555';
            }
        });

        fetchButton.addEventListener('click', () => {
            if (!fetchButton.classList.contains('disabled')) {
                fetchAndRenderData();
            }
        });
    }

    const calcButton = document.getElementById('calculate-ev-btn');
    if (calcButton) {
        calcButton.addEventListener('click', calculateManualEV);
    }
    
    const gamesContainer = document.getElementById('games-container');
    if (gamesContainer) {
        gamesContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-portfolio-btn')) {
                const gameId = event.target.dataset.id;
                alert(`${translate('buttonAdd')}: Game ID ${gameId}`);
            }
        });
    }
});
