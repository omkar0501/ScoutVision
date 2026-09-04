// ScoutVision Roster Database Controller

const DEFAULT_ROSTER = [
  { id: 'p1', name: 'Marcus Kane', position: 'Forward', jersey: 9, rating: 88 },
  { id: 'p2', name: 'Alvaro Santos', position: 'Midfielder', jersey: 10, rating: 85 },
  { id: 'p3', name: 'Devon Carter', position: 'Defender', jersey: 4, rating: 82 },
  { id: 'p4', name: 'Simon Mignolet', position: 'Goalkeeper', jersey: 1, rating: 86 },
  { id: 'p5', name: 'Lucas Sterling', position: 'Forward', jersey: 7, rating: 84 },
  { id: 'p6', name: 'Tyler Adams', position: 'Midfielder', jersey: 8, rating: 80 },
  { id: 'p7', name: 'Virgil Diaz', position: 'Defender', jersey: 5, rating: 89 }
];

function getRoster() {
  const rosterStr = localStorage.getItem('scoutvision_roster');
  if (!rosterStr) {
    localStorage.setItem('scoutvision_roster', JSON.stringify(DEFAULT_ROSTER));
    return DEFAULT_ROSTER;
  }
  return JSON.parse(rosterStr);
}

function saveRoster(roster) {
  localStorage.setItem('scoutvision_roster', JSON.stringify(roster));
  // Trigger update event
  window.dispatchEvent(new Event('rosterUpdated'));
}

function addPlayer(name, position, jersey, rating) {
  const roster = getRoster();
  const newPlayer = {
    id: 'p_' + Date.now(),
    name,
    position,
    jersey: parseInt(jersey) || 0,
    rating: parseInt(rating) || 75
  };
  roster.push(newPlayer);
  saveRoster(roster);
  return newPlayer;
}

function deletePlayer(id) {
  let roster = getRoster();
  roster = roster.filter(player => player.id !== id);
  saveRoster(roster);
}

function renderRosterGrid() {
  const container = document.getElementById('rosterGridContainer');
  if (!container) return;
  
  const roster = getRoster();
  container.innerHTML = '';
  
  if (roster.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">No players in roster yet. Click 'Add Squad Player' to add one.</div>`;
    return;
  }
  
  roster.forEach(player => {
    // Generate initials for avatar representation
    const initials = player.name.split(' ').map(n => n[0]).join('').slice(0, 2);
    
    const card = document.createElement('div');
    card.className = 'player-card glass';
    card.innerHTML = `
      <button class="btn-remove-player" data-id="${player.id}" title="Remove Player">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="player-photo">${initials}</div>
      <h4 class="player-name">${player.name}</h4>
      <div class="player-position">${player.position}</div>
      <div class="player-stat-row">
        <div>Jersey <span class="player-stat-val">#${player.jersey}</span></div>
        <div style="width: 1px; height: 14px; background: var(--border-color);"></div>
        <div>Rating <span class="player-stat-val">${player.rating}</span></div>
      </div>
    `;
    container.appendChild(card);
  });
  
  // Attach remove events
  container.querySelectorAll('.btn-remove-player').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const playerId = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to remove this player from the roster?')) {
        deletePlayer(playerId);
        renderRosterGrid();
      }
    });
  });
}

// Attach event listeners for roster UI
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('rosterModal');
  const btnOpen = document.getElementById('btnOpenRosterModal');
  const btnClose = document.getElementById('btnCloseRosterModal');
  const btnCancel = document.getElementById('btnCancelPlayer');
  const btnSave = document.getElementById('btnSavePlayer');
  
  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => modal.classList.add('active'));
  }
  
  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      // Clear inputs
      document.getElementById('playerName').value = '';
      document.getElementById('playerJersey').value = '';
      document.getElementById('playerRating').value = '';
    }
  };
  
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);
  
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const name = document.getElementById('playerName').value.trim();
      const position = document.getElementById('playerPosition').value;
      const jersey = document.getElementById('playerJersey').value;
      const rating = document.getElementById('playerRating').value;
      
      if (!name) {
        alert('Please enter a player name');
        return;
      }
      
      addPlayer(name, position, jersey, rating);
      renderRosterGrid();
      closeModal();
      
      // Post activity record to dashboard if possible
      logActivity(`Added new player <strong>"${name}"</strong> (${position}) to Roster database.`);
    });
  }
  
  renderRosterGrid();
});
