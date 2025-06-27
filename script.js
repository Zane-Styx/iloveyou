// Elements
const matrixCanvas = document.getElementById('matrix');
const matrixCtx = matrixCanvas.getContext('2d');

const effectsCanvas = document.getElementById('effects');
const effectsCtx = effectsCanvas.getContext('2d');

// Matrix config
const letters = 'ILOVEYOU♥';
const fontSize = 18;
let columns;
let drops;
let gradient;

// Hearts
const hearts = [];

// Resize everything
function resize() {
  matrixCanvas.width = effectsCanvas.width = window.innerWidth;
  matrixCanvas.height = effectsCanvas.height = window.innerHeight;

  columns = Math.floor(matrixCanvas.width / fontSize);
  drops = new Array(columns).fill(1);

  gradient = matrixCtx.createLinearGradient(0, 0, matrixCanvas.width, matrixCanvas.height);
  gradient.addColorStop(0, '#ff69b4');
  gradient.addColorStop(1, '#800080');
}
window.addEventListener('resize', resize);

// Draw matrix
function drawMatrix() {
  matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  matrixCtx.fillStyle = gradient;
  matrixCtx.font = fontSize + 'px monospace';

  for (let i = 0; i < columns; i++) {
    const char = letters.charAt(Math.floor(Math.random() * letters.length));
    matrixCtx.fillText(char, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

// Heart explosion class
class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 2;
    this.alpha = 1;
    this.gravity = 0.1;
    this.size = 20 + Math.random() * 10;
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.01;
  }

  draw(ctx) {
    ctx.font = `${this.size}px monospace`;
    ctx.fillStyle = `rgba(255,105,180,${this.alpha})`;
    ctx.fillText('♥', this.x, this.y);
  }

  isDead(h) {
    return this.y > h || this.alpha <= 0;
  }
}

// Spawn hearts
function spawnHearts(x, y, count = 15) {
  for (let i = 0; i < count; i++) {
    hearts.push(new Heart(x, y));
  }
}

// Draw hearts
function drawHearts() {
  effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].draw(effectsCtx);
    if (hearts[i].isDead(effectsCanvas.height)) {
      hearts.splice(i, 1);
    }
  }
}

// Main animation loop
function animate() {
  drawMatrix();
  drawHearts();
  requestAnimationFrame(animate);
}

// Handle touch/click
function handleTap(e) {
  const x = e.clientX || (e.touches && e.touches[0].clientX);
  const y = e.clientY || (e.touches && e.touches[0].clientY);
  spawnHearts(x, y, 15);
}

effectsCanvas.addEventListener('click', handleTap);
effectsCanvas.addEventListener('touchstart', handleTap);

// Smooth bobbing title
const titleEl = document.getElementById('title');
const amplitudeX = 15;
const amplitudeY = 15;
const speed = 0.0025;

function bobTitle(t) {
  const dx = Math.sin(t * speed) * amplitudeX;
  const dy = Math.cos(t * speed * 1.3) * amplitudeY;
  titleEl.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  requestAnimationFrame(bobTitle);
}

// Initialize and start animation AFTER resize
resize();
animate();
requestAnimationFrame(bobTitle);
