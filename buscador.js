// Configuración de la API
const API_CONFIG = {
    key: 'f216ab85a2msh0a0194cf52bf9c3p12fb31jsn31d412c6c24f',
    host: 'api-football-v1.p.rapidapi.com',
    baseUrl: 'https://api-football-v1.p.rapidapi.com/v3'
};

// Ligas sudamericanas principales
const SOUTH_AMERICAN_LEAGUES = {
    128: { name: 'Liga Profesional Argentina', country: 'Argentina', flag: '🇦🇷' },
    71: { name: 'Série A', country: 'Brasil', flag: '🇧🇷' },
    265: { name: 'Primera División', country: 'Chile', flag: '🇨🇱' },
    239: { name: 'Liga BetPlay', country: 'Colombia', flag: '🇨🇴' },
    242: { name: 'Serie A', country: 'Ecuador', flag: '🇪🇨' },
    250: { name: 'División Profesional', country: 'Paraguay', flag: '🇵🇾' },
    281: { name: 'Liga 1', country: 'Perú', flag: '🇵🇪' },
    274: { name: 'Primera División', country: 'Uruguay', flag: '🇺🇾' },
    299: { name: 'Primera División', country: 'Venezuela', flag: '🇻🇪' }
};

// Variables globales
let currentData = [];
let currentView = 'leagues';

// Elementos del DOM
const elements = {
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('error-message'),
    leaguesSection: document.getElementById('leagues-section'),
    teamsSection: document.getElementById('teams-section'),
    playersSection: document.getElementById('players-section'),
    leaguesGrid: document.getElementById('leagues-grid'),
    teamsGrid: document.getElementById('teams-grid'),
    playersGrid: document.getElementById('players-grid'),
    leagueSelect: document.getElementById('league-select'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    modal: document.getElementById('modal'),
    modalBody: document.getElementById('modal-body')
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    populateLeagueSelect();
    showLeagues();
}

function setupEventListeners() {
    // Navegación
    document.getElementById('btn-leagues').addEventListener('click', () => switchView('leagues'));
    document.getElementById('btn-teams').addEventListener('click', () => switchView('teams'));
    document.getElementById('btn-players').addEventListener('click', () => switchView('players'));

    // Búsqueda
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });

    // Selector de liga
    elements.leagueSelect.addEventListener('change', function() {
        if (currentView === 'teams') {
            loadTeams(this.value);
        } else if (currentView === 'players') {
            if (this.value) {
                loadTeams(this.value, true); // Cargar equipos para luego cargar jugadores
            }
        }
    });

    // Modal
    document.querySelector('.close').addEventListener('click', closeModal);
    elements.modal.addEventListener('click', function(e) {
        if (e.target === elements.modal) closeModal();
    });
}

function populateLeagueSelect() {
    const select = elements.leagueSelect;
    select.innerHTML = '<option value="">Selecciona una liga</option>';
    
    Object.entries(SOUTH_AMERICAN_LEAGUES).forEach(([id, league]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `${league.flag} ${league.name} (${league.country})`;
        select.appendChild(option);
    });
}

function switchView(view) {
    currentView = view;
    
    // Actualizar botones de navegación
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${view}`).classList.add('active');
    
    // Mostrar sección correspondiente
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    elements[`${view}Section`].classList.add('active');
    
    // Cargar datos según la vista
    switch(view) {
        case 'leagues':
            showLeagues();
            break;
        case 'teams':
            const selectedLeague = elements.leagueSelect.value;
            if (selectedLeague) {
                loadTeams(selectedLeague);
            } else {
                elements.teamsGrid.innerHTML = '<div class="no-results">Selecciona una liga para ver los equipos</div>';
            }
            break;
        case 'players':
            elements.playersGrid.innerHTML = '<div class="no-results">Selecciona una liga para ver los jugadores</div>';
            break;
    }
}

function showLeagues() {
    const grid = elements.leaguesGrid;
    grid.innerHTML = '';
    
    Object.entries(SOUTH_AMERICAN_LEAGUES).forEach(([id, league]) => {
        const card = createLeagueCard(id, league);
        grid.appendChild(card);
    });
}

function createLeagueCard(id, league) {
    const card = document.createElement('div');
    card.className = 'card league-card';
    card.innerHTML = `
        <div class="league-country">${league.flag} ${league.country}</div>
        <h3>${league.name}</h3>
        <p>Liga profesional de fútbol</p>
        <p class="highlight">Haz clic para ver equipos</p>
    `;
    
    card.addEventListener('click', () => {
        elements.leagueSelect.value = id;
        switchView('teams');
        loadTeams(id);
    });
    
    return card;
}

async function makeAPIRequest(endpoint) {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_CONFIG.key,
            'X-RapidAPI-Host': API_CONFIG.host
        }
    };

    try {
        showLoading();
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        hideLoading();
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        hideLoading();
        showError();
        throw error;
    }
}

async function loadTeams(leagueId, forPlayers = false) {
    try {
        const currentYear = new Date().getFullYear();
        const data = await makeAPIRequest(`/teams?league=${leagueId}&season=${currentYear}`);
        
        if (data && data.response) {
            currentData = data.response;
            if (forPlayers) {
                // Si estamos cargando equipos para mostrar jugadores
                loadPlayersFromTeams(data.response);
            } else {
                displayTeams(data.response);
            }
        } else {
            elements.teamsGrid.innerHTML = '<div class="no-results">No se encontraron equipos para esta liga</div>';
        }
    } catch (error) {
        elements.teamsGrid.innerHTML = '<div class="no-results">Error al cargar equipos</div>';
    }
}

function displayTeams(teams) {
    const grid = elements.teamsGrid;
    grid.innerHTML = '';
    
    if (teams.length === 0) {
        grid.innerHTML = '<div class="no-results">No se encontraron equipos</div>';
        return;
    }
    
    teams.forEach(teamData => {
        const team = teamData.team;
        const venue = teamData.venue;
        const card = createTeamCard(team, venue);
        grid.appendChild(card);
    });
}

function createTeamCard(team, venue) {
    const card = document.createElement('div');
    card.className = 'card team-card';
    card.innerHTML = `
        <div class="team-logo">${team.name.charAt(0)}</div>
        <h3>${team.name}</h3>
        <p><strong>País:</strong> ${team.country || 'N/A'}</p>
        <p><strong>Fundado:</strong> ${team.founded || 'N/A'}</p>
        ${venue ? `<p><strong>Estadio:</strong> ${venue.name}</p>` : ''}
        ${venue ? `<p><strong>Capacidad:</strong> ${venue.capacity || 'N/A'}</p>` : ''}
        <p class="highlight">Haz clic para más detalles</p>
    `;
    
    card.addEventListener('click', () => {
        showTeamDetails(team, venue);
    });
    
    return card;
}

async function loadPlayersFromTeams(teams) {
    const grid = elements.playersGrid;
    grid.innerHTML = '';
    
    try {
        // Tomar los primeros 5 equipos para no sobrecargar la API
        const selectedTeams = teams.slice(0, 5);
        const allPlayers = [];
        
        for (const teamData of selectedTeams) {
            try {
                const currentYear = new Date().getFullYear();
                const playersData = await makeAPIRequest(`/players?team=${teamData.team.id}&season=${currentYear}`);
                
                if (playersData && playersData.response) {
                    // Tomar solo los primeros 10 jugadores de cada equipo
                    const teamPlayers = playersData.response.slice(0, 10).map(playerData => ({
                        ...playerData,
                        teamName: teamData.team.name
                    }));
                    allPlayers.push(...teamPlayers);
                }
                
                // Pequeña pausa para evitar saturar la API
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`Error loading players for team ${teamData.team.name}:`, error);
            }
        }
        
        if (allPlayers.length > 0) {
            displayPlayers(allPlayers);
        } else {
            grid.innerHTML = '<div class="no-results">No se encontraron jugadores</div>';
        }
    } catch (error) {
        grid.innerHTML = '<div class="no-results">Error al cargar jugadores</div>';
    }
}

function displayPlayers(players) {
    const grid = elements.playersGrid;
    grid.innerHTML = '';
    
    players.forEach(playerData => {
        const player = playerData.player;
        const statistics = playerData.statistics[0] || {};
        const card = createPlayerCard(player, statistics, playerData.teamName);
        grid.appendChild(card);
    });
}

function createPlayerCard(player, stats, teamName) {
    const card = document.createElement('div');
    card.className = 'card player-card';
    
    const position = stats.games?.position || 'N/A';
    const appearances = stats.games?.appearences || 0;
    const goals = stats.goals?.total || 0;
    
    card.innerHTML = `
        <div class="player-position">${position}</div>
        <h3>${player.name}</h3>
        <p><strong>Edad:</strong> ${player.age || 'N/A'} años</p>
        <p><strong>Nacionalidad:</strong> ${player.nationality || 'N/A'}</p>
        <p><strong>Equipo:</strong> ${teamName}</p>
        <p><strong>Partidos:</strong> ${appearances}</p>
        <p><strong>Goles:</strong> ${goals}</p>
        <p class="highlight">Haz clic para más detalles</p>
    `;
    
    card.addEventListener('click', () => {
        showPlayerDetails(player, stats, teamName);
    });
    
    return card;
}

function showTeamDetails(team, venue) {
    const modalContent = `
        <h2>${team.name}</h2>
        <div style="text-align: center; margin: 20px 0;">
            ${team.logo ? `<img src="${team.logo}" alt="${team.name}" style="max-width: 100px; height: auto;">` : ''}
        </div>
        <p><strong>País:</strong> ${team.country || 'N/A'}</p>
        <p><strong>Fundado:</strong> ${team.founded || 'N/A'}</p>
        <p><strong>Código:</strong> ${team.code || 'N/A'}</p>
        ${venue ? `
            <h3>Estadio</h3>
            <p><strong>Nombre:</strong> ${venue.name}</p>
            <p><strong>Dirección:</strong> ${venue.address || 'N/A'}</p>
            <p><strong>Ciudad:</strong> ${venue.city || 'N/A'}</p>
            <p><strong>Capacidad:</strong> ${venue.capacity || 'N/A'}</p>
            <p><strong>Superficie:</strong> ${venue.surface || 'N/A'}</p>
            ${venue.image ? `<img src="${venue.image}" alt="${venue.name}" style="width: 100%; max-width: 400px; margin-top: 15px; border-radius: 8px;">` : ''}
        ` : ''}
    `;
    
    elements.modalBody.innerHTML = modalContent;
    elements.modal.style.display = 'block';
}

function showPlayerDetails(player, stats, teamName) {
    const modalContent = `
        <h2>${player.name}</h2>
        <div style="text-align: center; margin: 20px 0;">
            ${player.photo ? `<img src="${player.photo}" alt="${player.name}" style="max-width: 150px; height: auto; border-radius: 50%;">` : ''}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <h3>Información Personal</h3>
                <p><strong>Edad:</strong> ${player.age || 'N/A'} años</p>
                <p><strong>Nacimiento:</strong> ${player.birth?.date || 'N/A'}</p>
                <p><strong>Lugar:</strong> ${player.birth?.place || 'N/A'}, ${player.birth?.country || 'N/A'}</p>
                <p><strong>Nacionalidad:</strong> ${player.nationality || 'N/A'}</p>
                <p><strong>Altura:</strong> ${player.height || 'N/A'}</p>
                <p><strong>Peso:</strong> ${player.weight || 'N/A'}</p>
            </div>
            <div>
                <h3>Estadísticas de Temporada</h3>
                <p><strong>Equipo:</strong> ${teamName}</p>
                <p><strong>Posición:</strong> ${stats.games?.position || 'N/A'}</p>
                <p><strong>Partidos:</strong> ${stats.games?.appearences || 0}</p>
                <p><strong>Titular:</strong> ${stats.games?.lineups || 0}</p>
                <p><strong>Goles:</strong> ${stats.goals?.total || 0}</p>
                <p><strong>Asistencias:</strong> ${stats.goals?.assists || 0}</p>
                <p><strong>Tarjetas amarillas:</strong> ${stats.cards?.yellow || 0}</p>
                <p><strong>Tarjetas rojas:</strong> ${stats.cards?.red || 0}</p>
            </div>
        </div>
    `;
    
    elements.modalBody.innerHTML = modalContent;
    elements.modal.style.display = 'block';
}

function handleSearch() {
    const query = elements.searchInput.value.toLowerCase().trim();
    if (!query) return;
    
    const filteredData = currentData.filter(item => {
        if (currentView === 'teams') {
            return item.team.name.toLowerCase().includes(query) ||
                   (item.team.country && item.team.country.toLowerCase().includes(query));
        } else if (currentView === 'players') {
            return item.player.name.toLowerCase().includes(query) ||
                   item.player.nationality.toLowerCase().includes(query) ||
                   (item.statistics[0]?.games?.position && 
                    item.statistics[0].games.position.toLowerCase().includes(query));
        }
        return false;
    });
