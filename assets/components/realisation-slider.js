class RealisationSlider extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="case-slider">
        <div class="slider-container">
          <div class="slider-image slider-before">
            <img src="${this.getAttribute('avant') || 'assets/images/avant.jpg'}" alt="Avant" />
          </div>
          <div class="slider-image slider-after">
            <img src="${this.getAttribute('apres') || 'assets/images/apres.jpg'}" alt="Après" />
          </div>
          <input type="range" min="0" max="100" value="50" class="slider-range" aria-label="Comparateur avant/après">
        </div>
        <div class="slider-labels">
          <span>Avant</span>
          <span>Après</span>
        </div>
      </div>
    `;
    const slider = this.querySelector('.slider-range');
    const after = this.querySelector('.slider-after');
    if (slider && after) {
      slider.addEventListener('input', function () {
        after.style.width = slider.value + '%';
      });
      after.style.width = slider.value + '%';
    }
  }
}
customElements.define('realisation-slider', RealisationSlider);
