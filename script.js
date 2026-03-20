// =============================================
//  PORTFOLIO - script.js
//  Student: Sanzidul Islam (sanzid)
//  Course: CSE 3154 | Vanilla JS only
// =============================================

/* -----------------------------------------------
   1. NAVIGATION — Hamburger + Active Link
----------------------------------------------- */
(function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Highlight active page link
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* -----------------------------------------------
   2. THEME TOGGLE — Light / Dark
----------------------------------------------- */
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const saved = localStorage.getItem('sanzid-theme') || 'dark';
  if (saved === 'light') {
    document.body.classList.add('light');
    btn.textContent = '🌙';
  }

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    btn.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('sanzid-theme', isLight ? 'light' : 'dark');
  });
})();

/* -----------------------------------------------
   3. SCROLL ANIMATIONS (IntersectionObserver)
----------------------------------------------- */
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 75);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();

/* -----------------------------------------------
   4. SKILL BARS — Animate on Scroll
----------------------------------------------- */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = (bar.dataset.width || 0) + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

/* -----------------------------------------------
   5. ANIMATED COUNTERS (stats section)
----------------------------------------------- */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let current  = 0;
      const step   = Math.max(1, Math.ceil(target / 55));
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 28);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* -----------------------------------------------
   6. TYPEWRITER EFFECT
----------------------------------------------- */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words   = [
    'ETE Student',
    'Smart Grid Enthusiast',
    'Deep Learning & NLP',
    'IoT Systems Builder',
    'LLM Explorer'
  ];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ++ci);

    let delay = deleting ? 55 : 95;

    if (!deleting && ci === word.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
      delay = 380;
    }

    setTimeout(type, delay);
  }

  type();
})();

/* -----------------------------------------------
   7. CONTACT FORM — EmailJS Integration
----------------------------------------------- */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  if (!form) return;

  const nameInput  = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const msgInput   = document.getElementById('message');
  const successBox = document.getElementById('formSuccess');

  function showError(input, msg) {
    input.classList.add('error');
    const errEl = document.getElementById(input.id + 'Error');
    if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
  }

  function clearError(input) {
    input.classList.remove('error');
    const errEl = document.getElementById(input.id + 'Error');
    if (errEl) errEl.classList.remove('show');
  }

  [nameInput, emailInput, msgInput].forEach(inp => {
    if (inp) inp.addEventListener('input', () => clearError(inp));
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    if (!nameInput.value.trim()) {
      showError(nameInput, 'Full name is required.');
      valid = false;
    } else if (nameInput.value.trim().length < 2) {
      showError(nameInput, 'Name must be at least 2 characters.');
      valid = false;
    } else {
      clearError(nameInput);
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailInput);
    }

    if (!msgInput.value.trim()) {
      showError(msgInput, 'Message cannot be empty.');
      valid = false;
    } else if (msgInput.value.trim().length < 15) {
      showError(msgInput, 'Message should be at least 15 characters.');
      valid = false;
    } else {
      clearError(msgInput);
    }

    if (!valid) return;

    const btn = form.querySelector('.btn-submit');
    btn.textContent = "Sending...";
    btn.disabled = true;

    emailjs.send("service_9nm3rct", "template_s8yqn7b", {
      from_name: nameInput.value,
      from_email: emailInput.value,
      message: msgInput.value
    })
    .then(function() {
      form.reset();
      btn.textContent = "Send Message ✉️";
      btn.disabled = false;

      if (successBox) {
        successBox.textContent = "Message sent successfully!";
        successBox.classList.add('show');
        setTimeout(() => successBox.classList.remove('show'), 5000);
      }
    })
    .catch(function(error) {
      console.error("EmailJS Error:", error);
      btn.textContent = "Send Message ✉️";
      btn.disabled = false;
      alert("Failed to send message.");
    });
  });
})();

/* -----------------------------------------------
   8. PROJECT FILTER (projects.html)
----------------------------------------------- */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('#projectsGrid .project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
      });
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeUp 0.4s ease both';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* -----------------------------------------------
   9. INTERACTIVE PARTICLE CANVAS
----------------------------------------------- */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const PARTICLE_COUNT = 60;
  const CONNECTION_DIST = 130;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    const hero = canvas.parentElement;
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 217, 180, ${p.opacity})`;
      ctx.fill();

      // Mouse interaction — attract gently
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        p.vx += dx * 0.00015;
        p.vy += dy * 0.00015;
      }

      // Connect particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const ddx = p.x - p2.x;
        const ddy = p.y - p2.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 217, 180, ${0.08 * (1 - d / CONNECTION_DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => { resize(); createParticles(); });

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });
})();

/* -----------------------------------------------
   10. 3D TILT EFFECT ON PROJECT CARDS
----------------------------------------------- */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* -----------------------------------------------
   11. MOUSE-FOLLOW GLOW ON CARDS
----------------------------------------------- */
(function initMouseGlow() {
  const cards = document.querySelectorAll('.project-card, .card');

  cards.forEach(card => {
    const glow = document.createElement('div');
    glow.classList.add('card-glow');
    card.appendChild(glow);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      glow.style.left = (e.clientX - rect.left) + 'px';
      glow.style.top = (e.clientY - rect.top) + 'px';
    });
  });
})();

/* -----------------------------------------------
   12. STAGGERED REVEAL FOR GRID ITEMS
----------------------------------------------- */
(function initStaggeredReveal() {
  const grids = document.querySelectorAll('.projects-grid, .tools-grid, .goals-grid, .home-interests');

  grids.forEach(grid => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = grid.children;
          Array.from(children).forEach((child, i) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, i * 80);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    // Set initial state
    Array.from(grid.children).forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(25px)';
      child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    observer.observe(grid);
  });
})();

/* -----------------------------------------------
   13. PARALLAX ON HERO ICONS
----------------------------------------------- */
(function initParallax() {
  const hero = document.querySelector('.hero');
  const icons = document.querySelectorAll('.hero-icon');
  if (!hero || !icons.length) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    icons.forEach((icon, i) => {
      const speed = (i + 1) * 8;
      icon.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    icons.forEach(icon => {
      icon.style.transform = '';
      icon.style.transition = 'transform 0.5s ease';
    });
  });
})();

/* -----------------------------------------------
   14. SCROLL PROGRESS BAR
----------------------------------------------- */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.classList.add('scroll-progress');
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    bar.style.width = progress + '%';
  });
})();

/* -----------------------------------------------
   15. BACK TO TOP BUTTON
----------------------------------------------- */
(function initBackToTop() {
  const btn = document.createElement('button');
  btn.classList.add('back-to-top');
  btn.innerHTML = '<i class="ri-arrow-up-line"></i>';
  btn.setAttribute('title', 'Back to top');
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* -----------------------------------------------
   16. NAV SCROLL EFFECT
----------------------------------------------- */
(function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
})();

/* 17. CURSOR GLOW — removed by user request */

/* -----------------------------------------------
   18. SMOOTH NAV LINK TRANSITIONS
----------------------------------------------- */
(function initSmoothPageTransitions() {
  const navLinks = document.querySelectorAll('.nav-links a, .footer-links a');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

      e.preventDefault();
      const wrapper = document.querySelector('.page-wrapper');
      if (wrapper) {
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(10px)';
        wrapper.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
})();

/* -----------------------------------------------
   19. AOS-STYLE SCROLL REVEAL
----------------------------------------------- */
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
})();

/* -----------------------------------------------
   20. TILT EFFECT ON PROJECT CARDS (Desktop)
----------------------------------------------- */
(function initCardTilt() {
  if (window.innerWidth < 768) return;
  
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();

/* -----------------------------------------------
   21. MAGNETIC BUTTON EFFECT
----------------------------------------------- */
(function initMagneticButtons() {
  if (window.innerWidth < 768) return;
  
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

