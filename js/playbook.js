// ScoutVision Tactical Playbook whiteboard controller

class PlaybookWhiteboard {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.tokens = []; // Player/ball tokens
    this.drawings = []; // Runs sketched on field
    this.currentDrawing = null;
    
    this.isDrawing = false;
    this.activeMode = 'drag'; // 'drag' or 'draw'
    this.draggedToken = null;
    this.dragOffset = { x: 0, y: 0 };
    
    this.tokenRadius = 16;
    this.setupPitchLayout();
    this.setupEvents();
    this.resetField();
  }
  
  setupPitchLayout() {
    this.pitchColor = '#0d381e';
    this.lineColor = 'rgba(255, 255, 255, 0.4)';
  }
  
  resetField() {
    this.tokens = [];
    this.drawings = [];
    
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // Default setup: Red Team (attacking left to right) vs Blue Team (defending right to left)
    // Red Team: 4 forwards/mids
    this.tokens.push({ id: 'r1', label: '9', team: 'red', x: w * 0.45, y: h * 0.3 });
    this.tokens.push({ id: 'r2', label: '10', team: 'red', x: w * 0.45, y: h * 0.7 });
    this.tokens.push({ id: 'r3', label: '7', team: 'red', x: w * 0.35, y: h * 0.15 });
    this.tokens.push({ id: 'r4', label: '11', team: 'red', x: w * 0.35, y: h * 0.85 });
    this.tokens.push({ id: 'r5', label: '8', team: 'red', x: w * 0.25, y: h * 0.5 });
    
    // Blue Team: defenders
    this.tokens.push({ id: 'b1', label: '4', team: 'blue', x: w * 0.6, y: h * 0.35 });
    this.tokens.push({ id: 'b2', label: '5', team: 'blue', x: w * 0.6, y: h * 0.65 });
    this.tokens.push({ id: 'b3', label: '2', team: 'blue', x: w * 0.7, y: h * 0.2 });
    this.tokens.push({ id: 'b4', label: '3', team: 'blue', x: w * 0.7, y: h * 0.8 });
    this.tokens.push({ id: 'b5', label: '1', team: 'blue', x: w * 0.9, y: h * 0.5 }); // Goalkeeper
    
    // Ball
    this.tokens.push({ id: 'ball', label: '⚽', team: 'ball', x: w * 0.5, y: h * 0.5 });
    
    this.redraw();
  }
  
  clearDrawings() {
    this.drawings = [];
    this.redraw();
  }
  
  spawnToken(team) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const label = team === 'red' ? 'R' : team === 'blue' ? 'B' : '⚽';
    
    this.tokens.push({
      id: 'token_' + Date.now(),
      label: label,
      team: team,
      x: w * 0.1 + Math.random() * (w * 0.8),
      y: h * 0.1 + Math.random() * (h * 0.8)
    });
    this.redraw();
  }
  
  drawPitchBackground() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // Turf backdrop
    ctx.fillStyle = this.pitchColor;
    ctx.fillRect(0, 0, w, h);
    
    // Boundary Lines
    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = 2;
    const pad = 15;
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
    
    // Center Line
    ctx.beginPath();
    ctx.moveTo(w / 2, pad);
    ctx.lineTo(w / 2, h - pad);
    ctx.stroke();
    
    // Center Circle
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 50, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Center Spot
    ctx.fillStyle = this.lineColor;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Penalty box Left
    ctx.strokeRect(pad, h / 2 - 80, 80, 160);
    ctx.strokeRect(pad, h / 2 - 40, 30, 80);
    ctx.beginPath();
    ctx.arc(pad + 80, h / 2, 30, -Math.PI/2, Math.PI/2);
    ctx.stroke();
    
    // Penalty box Right
    ctx.strokeRect(w - pad - 80, h / 2 - 80, 80, 160);
    ctx.strokeRect(w - pad - 30, h / 2 - 40, 30, 80);
    ctx.beginPath();
    ctx.arc(w - pad - 80, h / 2, 30, Math.PI/2, -Math.PI/2);
    ctx.stroke();
  }
  
  drawTokens() {
    const ctx = this.ctx;
    this.tokens.forEach(t => {
      ctx.save();
      
      if (t.team === 'red') {
        ctx.fillStyle = '#f44336';
        ctx.strokeStyle = '#ffffff';
      } else if (t.team === 'blue') {
        ctx.fillStyle = '#2196f3';
        ctx.strokeStyle = '#ffffff';
      } else {
        // Ball token representation
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
      }
      
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.tokenRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Token Text label
      ctx.fillStyle = t.team === 'ball' ? '#000000' : '#ffffff';
      ctx.font = 'bold 11px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t.label, t.x, t.y + (t.team === 'ball' ? -1 : 0));
      
      ctx.restore();
    });
  }
  
  drawSketches() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#ffeb3b'; // yellow highlight lines for play runs
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.setLineDash([5, 5]); // Dashed run line
    
    this.drawings.forEach(line => {
      if (line.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
      }
      ctx.stroke();
      
      // Arrow head at terminal end
      const p1 = line.points[line.points.length - 2];
      const p2 = line.points[line.points.length - 1];
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p2.x - 10 * Math.cos(angle - Math.PI / 6), p2.y - 10 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(p2.x - 10 * Math.cos(angle + Math.PI / 6), p2.y - 10 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    });
    
    ctx.restore();
  }
  
  redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPitchBackground();
    this.drawSketches();
    this.drawTokens();
  }
  
  setupEvents() {
    const getMousePos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };
    
    const checkTokenClicked = (pos) => {
      for (let i = this.tokens.length - 1; i >= 0; i--) {
        const t = this.tokens[i];
        const dx = pos.x - t.x;
        const dy = pos.y - t.y;
        if (dx * dx + dy * dy < this.tokenRadius * this.tokenRadius) {
          return t;
        }
      }
      return null;
    };
    
    const start = (e) => {
      const pos = getMousePos(e);
      
      if (this.activeMode === 'drag') {
        const clickedToken = checkTokenClicked(pos);
        if (clickedToken) {
          this.draggedToken = clickedToken;
          this.dragOffset.x = pos.x - clickedToken.x;
          this.dragOffset.y = pos.y - clickedToken.y;
          this.canvas.style.cursor = 'grabbing';
        }
      } else if (this.activeMode === 'draw') {
        this.isDrawing = true;
        this.currentDrawing = {
          points: [{ x: pos.x, y: pos.y }]
        };
      }
    };
    
    const move = (e) => {
      const pos = getMousePos(e);
      
      if (this.activeMode === 'drag' && this.draggedToken) {
        this.draggedToken.x = pos.x - this.dragOffset.x;
        this.draggedToken.y = pos.y - this.dragOffset.y;
        this.redraw();
      } else if (this.activeMode === 'draw' && this.isDrawing && this.currentDrawing) {
        this.currentDrawing.points.push({ x: pos.x, y: pos.y });
        this.redraw();
        
        // draw current sketch overlay preview
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = '#ffeb3b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.currentDrawing.points[0].x, this.currentDrawing.points[0].y);
        for (let i = 1; i < this.currentDrawing.points.length; i++) {
          ctx.lineTo(this.currentDrawing.points[i].x, this.currentDrawing.points[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }
    };
    
    const end = () => {
      if (this.activeMode === 'drag' && this.draggedToken) {
        this.draggedToken = null;
        this.canvas.style.cursor = 'default';
      } else if (this.activeMode === 'draw' && this.isDrawing) {
        this.isDrawing = false;
        if (this.currentDrawing && this.currentDrawing.points.length > 1) {
          this.drawings.push(this.currentDrawing);
        }
        this.currentDrawing = null;
        this.redraw();
      }
    };
    
    this.canvas.addEventListener('mousedown', start);
    this.canvas.addEventListener('mousemove', move);
    this.canvas.addEventListener('mouseup', end);
    this.canvas.addEventListener('mouseleave', end);
    
    this.canvas.addEventListener('touchstart', start);
    this.canvas.addEventListener('touchmove', move);
    this.canvas.addEventListener('touchend', end);
  }
}

// Attach UI hooks on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const whiteboard = new PlaybookWhiteboard('pitchCanvas');
  
  // Drag vs Draw selector
  const btnDrag = document.getElementById('btnPlaybookDrag');
  const btnDraw = document.getElementById('btnPlaybookDraw');
  
  if (btnDrag && btnDraw) {
    btnDrag.addEventListener('click', () => {
      btnDrag.classList.add('active');
      btnDraw.classList.remove('active');
      if (whiteboard) whiteboard.activeMode = 'drag';
    });
    
    btnDraw.addEventListener('click', () => {
      btnDraw.classList.add('active');
      btnDrag.classList.remove('active');
      if (whiteboard) whiteboard.activeMode = 'draw';
    });
  }
  
  // Spawners
  const btnRed = document.getElementById('btnSpawnRed');
  const btnBlue = document.getElementById('btnSpawnBlue');
  const btnBall = document.getElementById('btnSpawnBall');
  
  if (btnRed) btnRed.addEventListener('click', () => whiteboard && whiteboard.spawnToken('red'));
  if (btnBlue) btnBlue.addEventListener('click', () => whiteboard && whiteboard.spawnToken('blue'));
  if (btnBall) btnBall.addEventListener('click', () => whiteboard && whiteboard.spawnToken('ball'));
  
  // Pitch canvas actions
  const btnClear = document.getElementById('btnClearPitch');
  const btnReset = document.getElementById('btnResetPitch');
  
  if (btnClear) btnClear.addEventListener('click', () => whiteboard && whiteboard.clearDrawings());
  if (btnReset) btnReset.addEventListener('click', () => whiteboard && whiteboard.resetField());
});
