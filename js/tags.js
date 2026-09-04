// ScoutVision Video Event Tag Controller

const DEFAULT_TAGS = [
  { id: 't1', category: 'pass', name: 'Midfield Build-up', timestamp: 1.2 },
  { id: 't2', category: 'goal', name: 'Opening Volley - Santos', timestamp: 2.5 },
  { id: 't3', category: 'shot', name: 'Marcus Kane Shot', timestamp: 5.4 },
  { id: 't4', category: 'foul', name: 'Yellow Card Tackle - Carter', timestamp: 7.8 }
];

function getTags() {
  const tagsStr = localStorage.getItem('scoutvision_tags');
  if (!tagsStr) {
    localStorage.setItem('scoutvision_tags', JSON.stringify(DEFAULT_TAGS));
    return DEFAULT_TAGS;
  }
  return JSON.parse(tagsStr);
}

function saveTags(tags) {
  localStorage.setItem('scoutvision_tags', JSON.stringify(tags));
  // Dispatch event for analytics update
  window.dispatchEvent(new Event('tagsUpdated'));
}

function addTag(category, name, timestamp) {
  const tags = getTags();
  const newTag = {
    id: 't_' + Date.now(),
    category,
    name: name.trim() || `${category.toUpperCase()} event`,
    timestamp: parseFloat(timestamp) || 0
  };
  tags.push(newTag);
  tags.sort((a, b) => a.timestamp - b.timestamp);
  saveTags(tags);
  return newTag;
}

function deleteTag(id) {
  let tags = getTags();
  tags = tags.filter(tag => tag.id !== id);
  saveTags(tags);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  const ms = Math.floor((seconds % 1) * 100).toString().padStart(2, '0');
  return `${m}:${s}.${ms}`;
}

function renderTagsList(videoElement) {
  const container = document.getElementById('tagListContainer');
  if (!container) return;
  
  const tags = getTags();
  container.innerHTML = '';
  
  if (tags.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 20px;">No events tagged. Pause the video and click 'Tag Current Timestamp'.</div>`;
    return;
  }
  
  tags.forEach(tag => {
    const item = document.createElement('div');
    item.className = 'tag-item';
    item.setAttribute('data-time', tag.timestamp);
    
    item.innerHTML = `
      <div class="tag-info" onclick="seekVideoTo(${tag.timestamp})">
        <span class="tag-name">${tag.name}</span>
        <span class="tag-timestamp">${formatTime(tag.timestamp)}</span>
      </div>
      <div style="display:flex; align-items:center; gap: 8px;">
        <span class="tag-badge ${tag.category}">${tag.category}</span>
        <button class="btn-delete-tag" data-id="${tag.id}" title="Remove Tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `;
    container.appendChild(item);
  });
  
  // Attach delete buttons
  container.querySelectorAll('.btn-delete-tag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid seeking video
      const tagId = btn.getAttribute('data-id');
      deleteTag(tagId);
      renderTagsList(videoElement);
    });
  });
}

function seekVideoTo(time) {
  const video = document.getElementById('mainVideo');
  if (video) {
    video.currentTime = time;
    video.pause(); // Pause video so they can inspect/draw on the frame!
  }
}

// Activity logger helper for localStorage
function logActivity(text) {
  const activitiesStr = localStorage.getItem('scoutvision_activities');
  let activities = [];
  if (activitiesStr) {
    activities = JSON.parse(activitiesStr);
  } else {
    // Initial static activities from UI
    activities = [
      { text: 'Tagged clip <strong>"Shot on Goal"</strong> at 0:08 in standard footage.', time: '10 minutes ago' },
      { text: 'Drew tactical runs in the <strong>Whiteboard</strong> setup.', time: '30 minutes ago' },
      { text: 'Added new player <strong>"Marcus Kane"</strong> (Forward) to Roster database.', time: '2 hours ago' }
    ];
  }
  
  activities.unshift({
    text,
    time: 'Just now'
  });
  
  // Cap at 10 activities
  if (activities.length > 10) activities.pop();
  
  localStorage.setItem('scoutvision_activities', JSON.stringify(activities));
  
  // Re-render dashboard activities list if on page
  renderActivities();
}

function renderActivities() {
  const list = document.getElementById('activityList');
  if (!list) return;
  
  const activitiesStr = localStorage.getItem('scoutvision_activities');
  if (activitiesStr) {
    const activities = JSON.parse(activitiesStr);
    list.innerHTML = '';
    activities.forEach(act => {
      const div = document.createElement('div');
      div.className = 'activity-item';
      div.innerHTML = `
        <div class="activity-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="12 8 8 12 12 16 12 8"></polygon></svg>
        </div>
        <div class="activity-details">
          <p class="activity-text">${act.text}</p>
          <span class="activity-time">${act.time}</span>
        </div>
      `;
      list.appendChild(div);
    });
  }
}

// Trigger initial activities render on load
document.addEventListener('DOMContentLoaded', () => {
  renderActivities();
});
