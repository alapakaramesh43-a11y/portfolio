/* ═══════════════════════════════════════════════════════
   PORTFOLIO SCRIPT — Alapaka Venkata Ramesh
═══════════════════════════════════════════════════════ */

/* ── Navbar: scroll behaviour + active link ── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Add glass effect on scroll
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active section in nav
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

/* ── Hero Canvas Particle Animation ── */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 90;
const colors = ['rgba(0,212,255,', 'rgba(123,47,247,', 'rgba(0,153,255,'];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.3;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.6 + 0.1;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.life = Math.random() * 200 + 100;
    this.maxLife = this.life;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.life <= 0 ||
        this.x < -10 || this.x > canvas.width + 10 ||
        this.y < -10 || this.y > canvas.height + 10) {
      this.reset();
    }
  }
  draw() {
    const alpha = (this.life / this.maxLife) * this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + alpha + ')';
    ctx.fill();
  }
}

// Connection lines between nearby particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const alpha = (1 - dist / 100) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

let mouseX = -999, mouseY = -999;
canvas.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
canvas.addEventListener('mouseleave', () => { mouseX = -999; mouseY = -999; });

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Subtle mouse repulsion
  particles.forEach(p => {
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      p.x += (dx / dist) * 0.6;
      p.y += (dy / dist) * 0.6;
    }
    p.update();
    p.draw();
  });

  drawConnections();
  animId = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ── Typewriter Effect ── */
const roles = [
  'Full Stack Developer',
  'Backend Engineer',
  'Problem Solver',
  'Java Developer',
  'DB Enthusiast'
];
let roleIdx = 0, charIdx = 0, deleting = false, typePause = false;
const typeEl = document.getElementById('typewriter');

function type() {
  if (typePause) return;

  const currentRole = roles[roleIdx];
  if (!deleting) {
    typeEl.textContent = currentRole.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === currentRole.length) {
      typePause = true;
      setTimeout(() => { deleting = true; typePause = false; }, 2000);
      return;
    }
    setTimeout(type, 90);
  } else {
    typeEl.textContent = currentRole.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
    setTimeout(type, 45);
  }
}
setTimeout(type, 1000);

/* ── AOS — Animate on Scroll using Intersection Observer ── */
const aosElements = document.querySelectorAll('[data-aos]');

const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.getAttribute('data-aos-delay') || '0');
      setTimeout(() => el.classList.add('aos-animate'), delay);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

aosElements.forEach(el => aosObserver.observe(el));

/* ── Skill Bar Animation ── */
const barFills = document.querySelectorAll('.bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const targetWidth = bar.getAttribute('data-width') + '%';
      setTimeout(() => { bar.style.width = targetWidth; }, 200);
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

barFills.forEach(bar => barObserver.observe(bar));

/* ── Stat Counter Animation ── */
const statNums = document.querySelectorAll('.stat-num');

function animateCounter(el, end, decimals = 0) {
  const startTime = performance.now();
  const duration = 1500;
  const startVal = 0;
  const endVal = parseFloat(end);

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (endVal - startVal) * eased;

    if (decimals > 0) {
      el.textContent = current.toFixed(decimals);
    } else if (el.dataset.suffix) {
      el.textContent = Math.floor(current) + el.dataset.suffix;
    } else {
      el.textContent = Math.floor(current);
    }

    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent.trim();
      if (text === '8.2') animateCounter(el, 8.2, 1);
      else if (text === '1+') { el.dataset.suffix = '+'; animateCounter(el, 1, 0); }
      else if (text === '2') animateCounter(el, 2, 0);
      else if (text === '1') animateCounter(el, 1, 0);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

/* ── Contact Form Handler ── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('formSubmitBtn');
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');
  const successMsg = document.getElementById('formSuccess');

  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';
  btn.disabled = true;

  // Simulate async — swap with real form service (Formspree, EmailJS etc.)
  setTimeout(() => {
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
    btn.disabled = false;
    successMsg.style.display = 'block';
    e.target.reset();

    setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
  }, 1400);
}

/* ── Smooth active section highlight on nav click ── */
navLinks.forEach(link => {
  link.addEventListener('click', function () {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

/* ── ID Badge slight tilt on mouse move ── */
const badge = document.querySelector('.id-badge');
if (badge) {
  badge.addEventListener('mousemove', (e) => {
    const rect = badge.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * 10;
    const ry = -((e.clientX - cx) / rect.width) * 10;
    badge.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.transform = 'perspective(600px) rotateX(0) rotateY(0) rotate(-2deg)';
  });
}

/* ── Scroll-to-top on logo click ── */
document.querySelector('.nav-logo').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

console.log('%c👋 Hey! Thanks for checking the source.', 'color:#00d4ff;font-size:14px;font-weight:bold;');
console.log('%c Built by Alapaka Venkata Ramesh', 'color:#7b2ff7;font-size:12px;');
