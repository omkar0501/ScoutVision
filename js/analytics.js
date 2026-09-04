// ScoutVision Analytics Engine - SVG Graphic Renderers

function renderFrequencyChart() {
  const svg = document.getElementById('barChartSvg');
  if (!svg) return;
  
  const tags = getTags();
  
  // Calculate frequencies
  const counts = {
    pass: 0,
    shot: 0,
    goal: 0,
    foul: 0
  };
  
  tags.forEach(tag => {
    if (counts[tag.category] !== undefined) {
      counts[tag.category]++;
    }
  });
  
  const data = [
    { label: 'Passes', value: counts.pass, color: '#00bcd4' },
    { label: 'Shots', value: counts.shot, color: '#ff9800' },
    { label: 'Goals', value: counts.goal, color: '#4caf50' },
    { label: 'Fouls', value: counts.foul, color: '#f44336' }
  ];
  
  // Render SVG elements
  svg.innerHTML = '';
  
  const width = svg.clientWidth || 500;
  const height = svg.clientHeight || 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  // Find max value for scale
  const maxVal = Math.max(...data.map(d => d.value), 4); // default min height is 4 scale
  
  // Draw gridlines
  for (let i = 0; i <= 4; i++) {
    const yVal = Math.round((maxVal / 4) * i);
    const y = chartHeight + paddingTop - (chartHeight * (i / 4));
    
    // Gridline
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', paddingLeft);
    line.setAttribute('y1', y);
    line.setAttribute('x2', width - paddingRight);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(255,255,255,0.05)');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
    
    // Label Y axis
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', paddingLeft - 10);
    text.setAttribute('y', y + 4);
    text.setAttribute('fill', 'var(--text-secondary)');
    text.setAttribute('font-size', '10px');
    text.setAttribute('text-anchor', 'end');
    text.textContent = yVal;
    svg.appendChild(text);
  }
  
  // Render Bars
  const barSpacing = chartWidth / data.length;
  const barWidth = barSpacing * 0.5;
  
  data.forEach((d, i) => {
    const x = paddingLeft + (i * barSpacing) + (barSpacing - barWidth) / 2;
    const barHeight = (d.value / maxVal) * chartHeight;
    const y = chartHeight + paddingTop - barHeight;
    
    // The bar rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', barHeight);
    rect.setAttribute('fill', d.color);
    rect.setAttribute('rx', '4');
    rect.setAttribute('ry', '4');
    // Hover micro-animation style
    rect.style.transition = 'all 0.3s ease';
    rect.style.cursor = 'pointer';
    rect.addEventListener('mouseover', () => {
      rect.setAttribute('opacity', '0.85');
    });
    rect.addEventListener('mouseout', () => {
      rect.setAttribute('opacity', '1');
    });
    svg.appendChild(rect);
    
    // Top bar value count label
    const valText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valText.setAttribute('x', x + barWidth/2);
    valText.setAttribute('y', y - 6);
    valText.setAttribute('fill', '#ffffff');
    valText.setAttribute('font-weight', '700');
    valText.setAttribute('font-size', '11px');
    valText.setAttribute('text-anchor', 'middle');
    valText.textContent = d.value;
    svg.appendChild(valText);
    
    // X axis labels
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.setAttribute('x', x + barWidth/2);
    labelText.setAttribute('y', chartHeight + paddingTop + 20);
    labelText.setAttribute('fill', 'var(--text-secondary)');
    labelText.setAttribute('font-size', '11px');
    labelText.setAttribute('text-anchor', 'middle');
    labelText.textContent = d.label;
    svg.appendChild(labelText);
  });
}

function renderPerformanceChart() {
  const svg = document.getElementById('pieChartSvg');
  if (!svg) return;
  
  const roster = getRoster();
  
  // Calculate average rating per position
  const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
  const posStats = positions.map(pos => {
    const players = roster.filter(p => p.position === pos);
    const avg = players.length > 0 
      ? Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length)
      : 0;
    return { label: pos, value: avg };
  });
  
  svg.innerHTML = '';
  
  const width = svg.clientWidth || 500;
  const height = svg.clientHeight || 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  // Horizontal bars representing rating levels
  const maxRating = 100;
  const barSpacing = chartHeight / posStats.length;
  const barHeight = barSpacing * 0.4;
  
  posStats.forEach((d, i) => {
    const y = paddingTop + (i * barSpacing) + (barSpacing - barHeight)/2;
    const barWidth = (d.value / maxRating) * chartWidth;
    
    // Position label
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.setAttribute('x', paddingLeft - 10);
    labelText.setAttribute('y', y + barHeight/2 + 4);
    labelText.setAttribute('fill', 'var(--text-secondary)');
    labelText.setAttribute('font-size', '10px');
    labelText.setAttribute('text-anchor', 'end');
    labelText.textContent = d.label;
    svg.appendChild(labelText);
    
    // Background bar tracker
    const bgBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgBar.setAttribute('x', paddingLeft);
    bgBar.setAttribute('y', y);
    bgBar.setAttribute('width', chartWidth);
    bgBar.setAttribute('height', barHeight);
    bgBar.setAttribute('fill', 'rgba(255,255,255,0.02)');
    bgBar.setAttribute('rx', '2');
    bgBar.setAttribute('ry', '2');
    svg.appendChild(bgBar);
    
    // Performance rating progress fill
    const fillBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fillBar.setAttribute('x', paddingLeft);
    fillBar.setAttribute('y', y);
    fillBar.setAttribute('width', barWidth);
    fillBar.setAttribute('height', barHeight);
    fillBar.setAttribute('fill', 'var(--primary)');
    fillBar.setAttribute('rx', '2');
    fillBar.setAttribute('ry', '2');
    svg.appendChild(fillBar);
    
    // Rating numeric indicator inside bar
    const ratingText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    ratingText.setAttribute('x', paddingLeft + Math.max(barWidth - 25, 10));
    ratingText.setAttribute('y', y + barHeight/2 + 4);
    ratingText.setAttribute('fill', '#ffffff');
    ratingText.setAttribute('font-weight', '700');
    ratingText.setAttribute('font-size', '10px');
    ratingText.textContent = d.value > 0 ? d.value : 'N/A';
    svg.appendChild(ratingText);
  });
}

function updateAnalyticsDashboard() {
  renderFrequencyChart();
  renderPerformanceChart();
}

// Update charts on window resize or data changes
window.addEventListener('resize', updateAnalyticsDashboard);
window.addEventListener('tagsUpdated', updateAnalyticsDashboard);
window.addEventListener('rosterUpdated', updatePerformanceChartOnly);

function updatePerformanceChartOnly() {
  renderPerformanceChart();
}

document.addEventListener('DOMContentLoaded', () => {
  // Listen for view tab swaps to refresh SVG sizing
  window.addEventListener('viewSwapped', (e) => {
    if (e.detail === 'analytics') {
      setTimeout(updateAnalyticsDashboard, 50); // slight delay for layout adjustments
    }
  });
});
