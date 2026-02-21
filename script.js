// =============================================
//  PORTFOLIO - script.js (PRODUCTION VERSION)
// =============================================

// ===============================
// API BASE URL (IMPORTANT)
// ===============================
const API_BASE = "https://sanzid-portfolio-api.onrender.com";

// =============================================
// 1. NAVIGATION
// =============================================
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

  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.classList.add('active');
    }
  });
})();

// =============================================
// 2. STATS COUNTERS
// =============================================
(async function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  let savedStats = null;
  try {
    const res = await fetch(`${API_BASE}/api/stats`);
    if (res.ok) savedStats = await res.json();
  } catch (e) { console.error(e); }

  if (savedStats) {
    if (savedStats.projects) counters[0].dataset.target = savedStats.projects;
    if (savedStats.tech)     counters[1].dataset.target = savedStats.tech;
    if (savedStats.years)    counters[2].dataset.target = savedStats.years;
    if (savedStats.commit)   counters[3].dataset.target = savedStats.commit;
  }

  counters.forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 25);
  });
})();

// =============================================
// 3. DYNAMIC CONTENT
// =============================================
(async function initDynamicContent() {

  // -------- PROJECTS --------
  const projectsGrid = document.querySelector('.projects-grid');
  if (projectsGrid) {
    try {
      const res = await fetch(`${API_BASE}/api/projects`);
      const projects = await res.json();

      projects.forEach(proj => {
        const html = `
          <article class="project-card">
            <img src="${proj.image}" alt="${proj.title}">
            <div class="project-body">
              <h3>${proj.title}</h3>
              <p>${proj.desc}</p>
              <div class="project-tags">
                ${proj.tags.split(',').map(t => `<span>${t.trim()}</span>`).join('')}
              </div>
            </div>
          </article>
        `;
        projectsGrid.insertAdjacentHTML('beforeend', html);
      });

    } catch (err) {
      console.error('Project fetch error:', err);
    }
  }

  // -------- EDUCATION --------
  const eduTable = document.querySelector('.edu-table tbody');
  if (eduTable) {
    try {
      const res = await fetch(`${API_BASE}/api/education`);
      const education = await res.json();

      education.forEach((edu, i) => {
        const row = `
          <tr>
            <td>${i + 1}</td>
            <td>${edu.inst}</td>
            <td>${edu.degree}</td>
            <td>${edu.year}</td>
            <td>${edu.status}</td>
          </tr>
        `;
        eduTable.insertAdjacentHTML('beforeend', row);
      });

    } catch (err) {
      console.error('Education fetch error:', err);
    }
  }

  // -------- ADMIN: UPDATE STATS --------
  const statsForm = document.getElementById('statsForm');
  if (statsForm) {
    statsForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        projects: document.getElementById('statProjects').value,
        tech:     document.getElementById('statTech').value,
        years:    document.getElementById('statYears').value,
        commit:   document.getElementById('statCommit').value
      };

      await fetch(`${API_BASE}/api/stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      alert('Stats Updated');
    });
  }

  // -------- ADMIN: ADD PROJECT --------
  const projForm = document.getElementById('projectForm');
  if (projForm) {
    projForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newProj = {
        title: document.getElementById('projTitle').value,
        category: document.getElementById('projCat').value,
        desc: document.getElementById('projDesc').value,
        tags: document.getElementById('projTags').value
      };

      await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProj)
      });

      alert('Project Added');
      projForm.reset();
    });
  }

  // -------- ADMIN: ADD EDUCATION --------
  const eduForm = document.getElementById('eduForm');
  if (eduForm) {
    eduForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newEdu = {
        degree: document.getElementById('eduDegree').value,
        inst:   document.getElementById('eduInst').value,
        year:   document.getElementById('eduYear').value,
        status: document.getElementById('eduStatus').value
      };

      await fetch(`${API_BASE}/api/education`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEdu)
      });

      alert('Qualification Added');
      eduForm.reset();
    });
  }

})();