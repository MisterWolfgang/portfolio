class RealisationSliderSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section id="integrations-uxui">
        <div class="container">
          <div class="section-header">
            <h2>Mes Intégrations UX/UI</h2>
            <p class="subtitle">Découvrez l'impact de mon travail sur des interfaces concrètes.</p>
          </div>
          <div class="integration-list"></div>
        </div>
      </section>
    `;
  }

  renderIntegrations(data) {
    console.log('[UXUI] renderIntegrations appelée');
    const list = this.querySelector('.integration-list');
    if (!list) return;
    list.innerHTML = '';
    data.forEach(item => {
      // On passe le champ link à renderFinal et renderFinalTabs
      list.innerHTML += `
        <div class="integration-item">
          <h3>${item.title}</h3>
          <p class="real-desc">${item.desc}</p>
          <div class="integration-comparatif">
            ${item.proto ? `
              <div class="integration-proto" style="display:flex;flex-direction:column;align-items:center;width:100%;">
                <div style="width:100%;aspect-ratio:16/14;background:#f8f8f8;border:1px solid #ccc;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                  <img src="${item.proto}" alt="Prototype" style="width:100%;height:100%;object-fit:cover;" />
                </div>
              </div>
            ` : ''}
            <span class="final-label">Résultat</span>
            <div class="integration-final">
              ${Array.isArray(item.final) ? this.renderFinalTabs(item.final, item.link) : this.renderFinal(item.final, item.resolution, item.link)}
            </div>
          </div>
        </div>
      `;
    });
    this.updateIframeScales();
    this.enableFullscreenOnMedia();
  }

  enableFullscreenOnMedia() {
    console.log('[UXUI] enableFullscreenOnMedia appelée');
    setTimeout(() => {
      // Images prototypes : ouverture dans un nouvel onglet
      this.querySelectorAll('.integration-proto img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(img.src, '_blank');
        });
        img.addEventListener('touchend', (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(img.src, '_blank');
        });
      });
      // Plus aucune interaction sur les iframes résultats
    }, 100);
  }

  toggleFullscreen(e) {
    e.preventDefault();
    e.stopPropagation();
    let target = e.currentTarget;
    if (target.classList.contains('iframe-simulated-container')) {
      const iframe = target.querySelector('iframe');
      if (target.classList.contains('uxui-fullscreen')) {
        target.classList.remove('uxui-fullscreen');
        document.body.classList.remove('uxui-no-scroll');
        // Rendre l'overlay à nouveau visible
        const overlay = target.querySelector('.iframe-click-overlay');
        if (overlay) overlay.style.display = '';
        // Retirer le scale
        target.style.transform = '';
      } else {
        document.querySelectorAll('.uxui-fullscreen').forEach(el => {
          el.classList.remove('uxui-fullscreen');
          const ov = el.querySelector('.iframe-click-overlay');
          if (ov) ov.style.display = '';
          el.style.transform = '';
        });
        target.classList.add('uxui-fullscreen');
        document.body.classList.add('uxui-no-scroll');
        // Masquer l'overlay pour permettre l'interaction avec l'iframe
        const overlay = target.querySelector('.iframe-click-overlay');
        if (overlay) overlay.style.display = 'none';
        // Appliquer le scale pour simuler un dézoom navigateur
        if (iframe) {
          const w = parseInt(iframe.getAttribute('width'), 10);
          const h = parseInt(iframe.getAttribute('height'), 10);
          const scale = Math.min(window.innerWidth / w, window.innerHeight / h, 1);
          target.style.transform = `scale(${scale})`;
          target.style.transformOrigin = 'center center';
        }
      }
    }
  }

  renderFinalTabs(finalArray, link) {
    if (!Array.isArray(finalArray) || finalArray.length === 0) return '';
    // Tabs
    let tabs = finalArray.map((el, i) => `<button class="final-tab${i===0?' active':''}" data-final-idx="${i}">${el.label||('Aperçu '+(i+1))}</button>`).join('');
    // Contents
    let contents = finalArray.map((el, i) => {
      // Support image ou url
      if (el.url) {
        return `<div class="final-tab-content" style="display:${i===0?'block':'none'};">${this.renderFinal(el.url, el.resolution, link)}</div>`;
      } else if (el.image) {
        let imgSrc = el.image;
        if (!/^assets\//.test(imgSrc) && !/^http/.test(imgSrc)) {
          imgSrc = 'assets/images/' + imgSrc.replace(/^\/+/, '');
        }
        // Centrage horizontal de l'image
        const imgStyle = 'max-width:100%; max-height:600px; display:block; margin-left:auto; margin-right:auto; margin-top:0; margin-bottom:0; cursor:' + (link ? 'pointer' : 'zoom-in') + ';';
        if (link) {
          return `<div class="final-tab-content" style="display:${i===0?'block':'none'}; text-align:center;"><a href="${link}" target="_blank" rel="noopener" aria-label="Ouvrir le projet final dans un nouvel onglet" tabindex="0"><img src="${imgSrc}" alt="${el.label||'Aperçu'}" style="${imgStyle}" /></a><span class="external-link-icon" style="display:inline-block;margin-left:0.3em;vertical-align:middle;"><i class="fas fa-external-link-alt" aria-hidden="true"></i></span></div>`;
        } else {
          return `<div class="final-tab-content" style="display:${i===0?'block':'none'}; text-align:center;"><img src="${imgSrc}" alt="${el.label||'Aperçu'}" style="${imgStyle}" onclick="window.open(this.src, '_blank')" /></div>`;
        }
      } else {
        return `<div class="final-tab-content" style="display:${i===0?'block':'none'};">Aucun aperçu disponible</div>`;
      }
    }).join('');
    // Wrapper
    setTimeout(() => {
      this.querySelectorAll('.integration-final').forEach(finalDiv => {
        const tabBtns = finalDiv.querySelectorAll('.final-tab');
        const tabContents = finalDiv.querySelectorAll('.final-tab-content');
        if (tabBtns.length && tabContents.length) {
          tabBtns.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
              tabBtns.forEach(b => b.classList.remove('active'));
              tabContents.forEach(c => c.style.display = 'none');
              btn.classList.add('active');
              tabContents[idx].style.display = 'block';
              setTimeout(() => this.updateIframeScales(), 50);
              setTimeout(() => this.enableFullscreenOnMedia(), 60);
            });
          });
        }
      });
      // Pour le cas initial (premier onglet affiché)
      setTimeout(() => this.enableFullscreenOnMedia(), 60);
    }, 0);
    return `<div class="final-tabs">${tabs}</div><div class="final-tabs-contents">${contents}</div>`;
  }

  updateIframeScales() {
    const containers = this.querySelectorAll('.iframe-simulated-container');
    containers.forEach(container => {
      const iframe = container.querySelector('iframe');
      if (!iframe) return;
      const w = parseInt(iframe.getAttribute('width'), 10);
      const cw = container.offsetWidth;
      const scale = cw / w;
      iframe.style.transform = `translate(-50%,-50%) scale(${scale})`;
    });
  }

  renderFinal(final, resolution, link) {
    // final peut être une url (iframe), une image, ou un lien externe
    console.log('[renderFinal] typeof final:', typeof final, 'valeur:', final, 'link:', link);
    if (typeof final === 'string') {
      if (final.match(/\.(jpg|jpeg|png|gif|webp|png)$/i)) {
        let imgSrc = final;
        if (!/^assets\//.test(imgSrc) && !/^http/.test(imgSrc)) {
          imgSrc = 'assets/images/' + imgSrc.replace(/^\/+/, '');
        }
        // Si link, on wrappe dans <a>
        if (link) {
          return `<a href="${link}" target="_blank" rel="noopener" aria-label="Ouvrir le projet final dans un nouvel onglet" tabindex="0"><img src="${imgSrc}" alt="Final" style="max-width:100%; max-height:600px; display:block; margin:0;cursor:pointer;" /></a><span class="external-link-icon" style="display:inline-block;margin-left:0.3em;vertical-align:middle;"><i class="fas fa-external-link-alt" aria-hidden="true"></i></span>`;
        } else {
          return `<img src="${imgSrc}" alt="Final" style="max-width:100%; max-height:600px; display:block; margin:0;cursor:zoom-in;" onclick="window.open(this.src, '_blank')" />`;
        }
      } else {
        // Simuler la résolution réelle mais dézoomer l'iframe pour qu'elle tienne dans la card
        let [w, h] = (resolution || '1280x720').split('x');
        w = parseInt(w, 10); h = parseInt(h, 10);
        // Inverser pour le mode portrait
        if (h > w) {
          // portrait déjà, rien à faire
        } else {
          // inverser pour forcer portrait
          let temp = w; w = h; h = temp;
        }
        // Si link, on wrappe l'iframe dans <a> (pour accessibilité, mais on peut aussi ajouter un overlay clickable)
        if (link) {
          return `
            <a href="${link}" target="_blank" rel="noopener" aria-label="Ouvrir le projet final dans un nouvel onglet" tabindex="0" style="display:block;position:relative;">
              <div class="iframe-simulated-container" style="position:relative;width:100%;aspect-ratio:${w}/${h};background:#f8f8f8;border:1px solid #ccc;overflow:hidden;pointer-events:auto;">
                <iframe src="${final}" width="${w}" height="${h}" sandbox="allow-scripts allow-same-origin" scrolling="no" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(1);transform-origin:center center;border:0;overflow:hidden;pointer-events:none;"></iframe>
                <span class="external-link-icon" style="position:absolute;top:10px;right:10px;z-index:10;background:rgba(255,255,255,0.85);border-radius:50%;padding:0.3em 0.4em;"><i class="fas fa-external-link-alt" aria-hidden="true"></i></span>
              </div>
            </a>
          `;
        } else {
          return `
            <div class="iframe-simulated-container" style="position:relative;width:100%;aspect-ratio:${w}/${h};background:#f8f8f8;border:1px solid #ccc;overflow:hidden;">
              <iframe src="${final}" width="${w}" height="${h}" sandbox="allow-scripts allow-same-origin" scrolling="no" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(1);transform-origin:center center;border:0;overflow:hidden;"></iframe>
            </div>
          `;
        }
      }
    } else if (typeof final === 'object' && final !== null && final.url) {
      // Cas d'un objet unique (sécurité)
      return this.renderFinal(final.url, final.resolution, link);
    }
  }
}
// Pour que le scale soit mis à jour au resize
window.addEventListener('resize', () => {
  document.querySelectorAll('realisation-slider-section').forEach(section => {
    if (typeof section.updateIframeScales === 'function') section.updateIframeScales();
  });
});
customElements.define('realisation-slider-section', RealisationSliderSection);
