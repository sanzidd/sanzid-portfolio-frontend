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
