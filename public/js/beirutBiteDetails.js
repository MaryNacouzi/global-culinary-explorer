// beirutBiteDetails.js
// ES6 class: reads `id` from the URL query string and renders the
// full detail view for a single dish from the local BEIRUT_BITES
// dataset (no backend call needed — this data is static/curated).

class BeirutBiteDetails {
  constructor({ containerId, dataset }) {
    this.container = document.getElementById(containerId);
    this.dataset = dataset;

    const params = new URLSearchParams(window.location.search);
    this.id = Number(params.get('id'));

    this.render();
  }

  render() {
    const dish = this.dataset.find((d) => d.id === this.id);

    if (!dish) {
      this.container.innerHTML = `<p class="empty-state">⚠️ That dish couldn't be found.</p>`;
      return;
    }

    document.title = `${dish.name} | Global Culinary Explorer`;

    const tagsHtml = (dish.tags || [])
      .map((tag) => `<span class="badge-sage" style="margin-right:0.4rem;">${this.escapeHtml(tag)}</span>`)
      .join('');

    this.container.innerHTML = `
      <article class="card-cream">
        <span style="font-size:3rem;">${dish.icon}</span>
        <span class="badge-sage" style="float:right;">${this.escapeHtml(dish.category)}</span>
        <h1 class="section-title" style="margin-top:0.5rem;">${this.escapeHtml(dish.name)}</h1>
        <p style="font-style:italic;font-size:1.1rem;">${this.escapeHtml(dish.arabicName)}</p>

        <h2 class="section-title" style="font-size:1.2rem;margin-top:1.5rem;">About This Dish</h2>
        <p>${this.escapeHtml(dish.description)}</p>

        <h2 class="section-title" style="font-size:1.2rem;margin-top:1.5rem;">Tags</h2>
        <div>${tagsHtml || '<span class="empty-state">No tags.</span>'}</div>
      </article>
    `;
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BeirutBiteDetails({ containerId: 'bite-detail-container', dataset: BEIRUT_BITES });
});
