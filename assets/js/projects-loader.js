// Chargement dynamique des projets par catégorie

async function renderProjects(listSelector, jsonPath) {
  const res = await fetch(jsonPath);
  const projects = await res.json();
  const list = document.querySelector(listSelector);
  if (!list) return;
  list.innerHTML = '';
  for (const p of projects) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-img-wrapper">
        <img src="${p.img}" alt="${p.title}" class="project-img" loading="lazy" />
        <span class="project-badge ${p.badgeClass}">${p.badge}</span>
      </div>
      <div class="project-card-body">
        <h4 class="project-title">${p.title}</h4>
        <p class="project-desc">${p.desc}</p>
      </div>
    `;
    list.appendChild(card);
    // Si pas d'URL fournie, on rend la card cliquable sur le GitHub
    if (p.github) {
      card.addEventListener('click', e => {
        // Ne pas ouvrir si clic sur un lien déjà présent
        if (e.target.closest('a')) return;
        window.open(p.github, '_blank');
      });
    }
    if (p.github && window.fetchGithubStats && window.renderGithubFooter) {
      try {
        const stats = await window.fetchGithubStats(p.github);
        window.renderGithubFooter(card, stats, p.github);
        console.log('[GitHub Footer]', p.title, stats);
      } catch (e) {
        window.renderGithubFooter(card, null, p.github);
        console.warn('[GitHub Footer] Erreur pour', p.title, e);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderProjects('.projects-list.projects-list-encours', 'assets/data/projects-en-cours.json');
  renderProjects('.projects-list.projects-list-termines', 'assets/data/projects-termines.json');
});
