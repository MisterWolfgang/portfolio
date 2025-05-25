// Récupère et affiche les stats GitHub pour chaque projet
async function fetchGithubStats(repoUrl) {
  if (!repoUrl) return null;
  const match = repoUrl.match(/github.com\/(.+?)\/(.+?)(?:$|\/|\?)/);
  if (!match) return null;
  const [_, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      issues: data.open_issues_count,
      url: data.html_url
    };
  } catch {
    return null;
  }
}

function renderGithubFooter(card, stats, repoUrl) {
  if (!repoUrl) return;
  const footer = document.createElement('div');
  footer.className = 'project-footer';
  if (stats) {
    footer.innerHTML = `
      <a href="${repoUrl}" target="_blank" class="github-link"><i class="fab fa-github"></i> GitHub</a>
      <span class="github-stats">
        ⭐ ${stats.stars} &nbsp;|&nbsp; 🍴 ${stats.forks} &nbsp;|&nbsp; 🐞 ${stats.issues}
      </span>
    `;
  } else {
    footer.innerHTML = `<a href="${repoUrl}" target="_blank" class="github-link"><i class="fab fa-github"></i> GitHub</a>`;
  }
  card.appendChild(footer);
}

// À utiliser dans le loader de projets
window.fetchGithubStats = fetchGithubStats;
window.renderGithubFooter = renderGithubFooter;
