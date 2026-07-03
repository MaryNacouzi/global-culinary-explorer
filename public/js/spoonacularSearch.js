// spoonacularSearch.js
// ES6 class handling dynamic recipe search against the Spoonacular API
// (proxied through our own backend at /api/spoonacular/search).

class SpoonacularSearch {
  constructor({ formId, inputId, resultsId, statusId }) {
    this.form = document.getElementById(formId);
    this.input = document.getElementById(inputId);
    this.resultsGrid = document.getElementById(resultsId);
    this.statusRegion = document.getElementById(statusId);

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(event) {
    event.preventDefault();
    const query = this.input.value.trim();
    if (!query) return;
    await this.search(query);
  }

  showLoading() {
    this.resultsGrid.innerHTML = '';
    this.statusRegion.innerHTML = `
      <div class="spinner-wrap">
        <div class="custom-spinner" role="status" aria-label="Loading recipes"></div>
      </div>`;
  }

  showError(message) {
    this.statusRegion.innerHTML = `<p class="empty-state">⚠️ ${message}</p>`;
  }

  showEmpty() {
    this.statusRegion.innerHTML = `<p class="empty-state">No recipes found. Try a different search term.</p>`;
  }

  clearStatus() {
    this.statusRegion.innerHTML = '';
  }

  async search(query) {
    this.showLoading();
    try {
      const response = await fetch(`/api/spoonacular/search?query=${encodeURIComponent(query)}&number=12`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      const items = data.results || [];

      this.clearStatus();

      if (items.length === 0) {
        this.showEmpty();
        return;
      }

      this.render(items);
    } catch (err) {
      console.error('SpoonacularSearch error:', err);
      this.showError('Something went wrong while fetching recipes. Please try again.');
    }
  }

  render(items) {
    this.resultsGrid.innerHTML = items.map((item) => this.renderCard(item)).join('');
  }

  renderCard(item) {
    const title = this.escapeHtml(item.title || 'Untitled recipe');
    const image = item.image || '';
    const readyIn = item.readyInMinutes ? `${item.readyInMinutes} min` : 'N/A';
    const servings = item.servings ? `${item.servings} servings` : '';

    return `
      <article class="dish-card">
        ${image ? `<img src="${image}" alt="${title}" loading="lazy" />` : ''}
        <div class="body">
          <h3>${title}</h3>
          <p>⏱ ${readyIn} ${servings ? '· ' + servings : ''}</p>
        </div>
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
  new SpoonacularSearch({
    formId: 'search-form',
    inputId: 'search-input',
    resultsId: 'results-grid',
    statusId: 'status-region'
  });
});
