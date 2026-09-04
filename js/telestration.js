// ScoutVision Telestration & Video Canvas Drawing Tool

class TelestrationTool {
  constructor(canvasId, videoId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.video = document.getElementById(videoId);
    
    this.drawings = []; // Saves permanent shapes on current frame
    this.currentShape = null; // Temp shape during drag
    
    this.activeTool = 'brush'; // brush, arrow, circle, spotlight
    this.activeColor = '#ff3b00'; // neon orange, cyan, neon green
    this.lineWidth = 4;
    
    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    
    this.setupCanvasResize();
    this.setupMouseEvents();
    this.setupVideoEvents();
  }
  
  setupCanvasResize() {
    const resize = () => {
      // Get the bounding box of the video to match bounds perfectly
      const rect = this.video.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.redraw();
    };
    
    this.video.addEventListener('loadedmetadata', resize);
    window.addEventListener('resize', resize);
    // Trigger on tab reveal
    window.addEventListener('viewSwapped', (e) => {
      if (e.detail === 'video') {
        setTimeout(resize, 100);
      }
    });
    
    // Initial call
    setTimeout(resize, 200);
  }
  
  setupMouseEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      // Support mouse or touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };
    
    const start = (e) => {
      if (this.video.paused === false) {
        this.video.pause(); // Pause video instantly when user tries to draw
        document.getElementById('playIcon').setAttribute('fill', 'currentColor');
        document.getElementById('playIcon').innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
      }
      
      const pos = getPos(e);
      this.isDrawing = true;
      this.startX = pos.x;
      this.startY = pos.y;
      
      if (this.activeTool === 'brush') {
        this.currentShape = {
          type: 'brush',
          color: this.activeColor,
          width: this.lineWidth,
          points: [{ x: pos.x, y: pos.y }]
        };
      } else {
        this.currentShape = {
          type: this.activeTool,
          color: this.activeColor,
          width: this.lineWidth,
          x1: pos.x,
          y1: pos.y,
          x2: pos.x,
          y2: pos.y
        };
      }
    };
    
    const move = (e) => {
      if (!this.isDrawing || !this.currentShape) return;
      e.preventDefault();
      
      const pos = getPos(e);
      
      if (this.activeTool === 'brush') {
        this.currentShape.points.push({ x: pos.x, y: pos.y });
      } else {
        this.currentShape.x2 = pos.x;
        this.currentShape.y2 = pos.y;
      }
      
      this.redraw();
      this.drawShape(this.currentShape); // draw current overlay preview
    };
    
    const end = () => {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      
      if (this.currentShape) {
        this.drawings.push(this.currentShape);
        this.currentShape = null;
      }
      this.redraw();
    };
    
    // Bind listeners
    this.canvas.addEventListener('mousedown', start);
    this.canvas.addEventListener('mousemove', move);
    this.canvas.addEventListener('mouseup', end);
    this.canvas.addEventListener('mouseleave', end);
    
    this.canvas.addEventListener('touchstart', start);
    this.canvas.addEventListener('touchmove', move);
    this.canvas.addEventListener('touchend', end);
  }
  
  setupVideoEvents() {
    // Clear annotations when the video resumes playing
    this.video.addEventListener('play', () => {
      this.clear();
    });
    
    // Clear annotations on significant timeline scrubs
    this.video.addEventListener('seeking', () => {
      this.clear();
    });
  }
  
  drawShape(shape) {
    const ctx = this.ctx;
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (shape.type === 'brush') {
      if (shape.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(shape.points[0].x, shape.points[0].y);
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }
      ctx.stroke();
    } 
    else if (shape.type === 'arrow') {
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
      
      // Calculate Arrow Head angles
      const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
      const headLength = 15;
      
      ctx.fillStyle = shape.color;
      ctx.beginPath();
      ctx.moveTo(shape.x2, shape.y2);
      ctx.lineTo(
        shape.x2 - headLength * Math.cos(angle - Math.PI / 6),
        shape.y2 - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        shape.x2 - headLength * Math.cos(angle + Math.PI / 6),
        shape.y2 - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    } 
    else if (shape.type === 'circle') {
      const rx = (shape.x2 - shape.x1) / 2;
      const ry = (shape.y2 - shape.y1) / 2;
      const cx = shape.x1 + rx;
      const cy = shape.y1 + ry;
      
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
      ctx.stroke();
    } 
    else if (shape.type === 'spotlight') {
      const rx = (shape.x2 - shape.x1) / 2;
      const ry = (shape.y2 - shape.y1) / 2;
      const cx = shape.x1 + rx;
      const cy = shape.y1 + ry;
      const radius = Math.sqrt(rx * rx + ry * ry);
      
      if (radius < 5) return;
      
      // Create translucent dark overlay over everything
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Cutout a transparent circle (aperture) using source-out clipping
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add a stroke outline to spotlight boundary
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    }
  }
  
  redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawings.forEach(shape => this.drawShape(shape));
  }
  
  undo() {
    this.drawings.pop();
    this.redraw();
  }
  
  clear() {
    this.drawings = [];
    this.redraw();
  }
}

// Instantiate and connect UI hooks on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const telestrator = new TelestrationTool('telestrationCanvas', 'mainVideo');
  
  // Set Tool bindings
  document.querySelectorAll('.draw-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      document.querySelectorAll('.draw-btn[data-tool]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (telestrator) {
        telestrator.activeTool = btn.getAttribute('data-tool');
      }
    });
  });
  
  // Color Picker bindings
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      
      if (telestrator) {
        telestrator.activeColor = dot.getAttribute('data-color');
      }
    });
  });
  
  // Undo/Clear buttons
  const btnUndo = document.getElementById('btnUndo');
  const btnClear = document.getElementById('btnClearCanvas');
  
  if (btnUndo) {
    btnUndo.addEventListener('click', () => {
      if (telestrator) telestrator.undo();
    });
  }
  
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (telestrator) telestrator.clear();
    });
  }
  
  // Expose telestrator globally for other controllers to trigger clear
  window.telestration = telestrator;
});
