// Chargement dynamique des réalisations avant/après
// Chargement dynamique des intégrations UX/UI
document.addEventListener('DOMContentLoaded', function () {
  fetch('assets/data/realisations.json')
    .then(res => res.json())
    .then(data => {
      const section = document.querySelector('realisation-slider-section');
      if (section && typeof section.renderIntegrations === 'function') {
        section.renderIntegrations(data);
      }
    });
});
