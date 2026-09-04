// ScoutVision Master App Controller - View Routing, Video Player, and Dashboard State sync

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Sidebar Tab Switching (View Routing)
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.app-view');
  const viewTitle = document.getElementById('currentViewTitle');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      
      // Update active nav button
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Update active view panel
      views.forEach(view => view.classList.remove('active'));
      const activePanel = document.getElementById(`view-${targetView}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
      
      // Update Title
      if (viewTitle) {
        viewTitle.textContent = item.textContent.trim();
      }
      
      // Emit viewSwapped event for sub-systems (canvas, charts resizing)
      window.dispatchEvent(new CustomEvent('viewSwapped', { detail: targetView }));
      
      // Pause video if we navigate away from analyzer
      if (targetView !== 'video') {
        const video = document.getElementById('mainVideo');
        if (video && !video.paused) {
          video.pause();
          document.getElementById('playIcon').innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        }
      }
    });
  });
  
  // 2. Video Player Integration
  const video = document.getElementById('mainVideo');
  const btnPlay = document.getElementById('btnPlay');
  const playIcon = document.getElementById('playIcon');
  const btnPrev = document.getElementById('btnPrevFrame');
  const btnNext = document.getElementById('btnNextFrame');
  const timeline = document.getElementById('videoTimeline');
  const timeDisplay = document.getElementById('timeCurrent');
  const speedSelect = document.getElementById('selectSpeed');
  
  if (video) {
    // Play/Pause Action
    const togglePlay = () => {
      if (video.paused || video.ended) {
        video.play();
        playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
      } else {
        video.pause();
        playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
      }
    };
    
    if (btnPlay) btnPlay.addEventListener('click', togglePlay);
    if (video) video.addEventListener('click', togglePlay);
    
    // Playback Speed
    if (speedSelect) {
      speedSelect.addEventListener('change', () => {
        video.playbackRate = parseFloat(speedSelect.value);
      });
    }
    
    // Timeline Updates
    video.addEventListener('timeupdate', () => {
      if (!timeline || !timeDisplay) return;
      const progress = (video.currentTime / video.duration) * 100;
      timeline.value = progress || 0;
      
      // Format timestamps
      const cur = formatTime(video.currentTime);
      const dur = formatTime(video.duration || 0);
      timeDisplay.textContent = `${cur} / ${dur}`;
    });
    
    // Timeline Scrubbing
    if (timeline) {
      timeline.addEventListener('input', () => {
        const time = (timeline.value / 100) * video.duration;
        video.currentTime = time;
      });
    }
    
    // Frame scrubbing (approx 30fps = 0.033 seconds per frame)
    const FPS = 1 / 30;
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        video.pause();
        video.currentTime = Math.max(0, video.currentTime - FPS);
        playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        video.pause();
        video.currentTime = Math.min(video.duration, video.currentTime + FPS);
        playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
      });
    }
    
    // Initialize tags list mapping to this video
    renderTagsList(video);
  }
  
  // 3. Event Tagging Form Action
  const btnAddTag = document.getElementById('btnAddTag');
  if (btnAddTag && video) {
    btnAddTag.addEventListener('click', () => {
      const category = document.getElementById('tagCategory').value;
      const nameInput = document.getElementById('tagNameInput');
      let name = nameInput.value.trim();
      
      if (!name) {
        name = `${category.charAt(0).toUpperCase() + category.slice(1)} Clip`;
      }
      
      const newTag = addTag(category, name, video.currentTime);
      renderTagsList(video);
      nameInput.value = ''; // clear input
      
      // Add Activity log
      const formattedTimestamp = formatTime(video.currentTime);
      logActivity(`Tagged clip <strong>"${name}"</strong> at ${formattedTimestamp} in film analysis.`);
      syncDashboardMetrics();
    });
  }
  
  // Keyboard Shortcuts (Space for Play/Pause, Left/Right for Frames)
  document.addEventListener('keydown', (e) => {
    // Only capture shortcut if not typing in form inputs
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
      return;
    }
    
    const activeView = document.querySelector('.app-view.active').id;
    if (activeView === 'view-video' && video) {
      if (e.code === 'Space') {
        e.preventDefault();
        btnPlay.click();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        btnPrev.click();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        btnNext.click();
      }
    }
  });

  // 4. Synchronize Dashboard Stats & Metrics
  function syncDashboardMetrics() {
    const roster = getRoster();
    const tags = getTags();
    
    const rosterCountEl = document.getElementById('dashRosterCount');
    const clipsCountEl = document.getElementById('dashClipsCount');
    const playsCountEl = document.getElementById('dashPlaysCount');
    
    if (rosterCountEl) rosterCountEl.textContent = roster.length;
    if (clipsCountEl) clipsCountEl.textContent = tags.length;
    // mock plays count is based on local storage or fixed initial count
    if (playsCountEl) playsCountEl.textContent = 3; 
  }
  
  // Bind synchronization listeners
  window.addEventListener('rosterUpdated', syncDashboardMetrics);
  window.addEventListener('tagsUpdated', syncDashboardMetrics);
  
  // Initial synchronization
  syncDashboardMetrics();
});

// Switch view helper for dashboard links
function switchToVideoView() {
  const videoBtn = document.getElementById('navVideoBtn');
  if (videoBtn) {
    videoBtn.click();
  }
}
