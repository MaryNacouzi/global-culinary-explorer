// recipeDetails.js
// ES6 class: reads `id` and `source` from the URL query string and
// dynamically fetches + renders full ingredient lists and instructions,
// either from the Spoonacular proxy (source=spoonacular) or from our
// own Neon-backed community recipes (source=community).

class RecipeDetails {
  constructor({ containerId }) {
    this.container = document.getElementById(containerId);

    const params = new URLSearchParams(window.location.search);
    this.id = params.get('id');
    this.source = params.get('source') || 'spoonacular';

    this.init();
  }

  async init() {
    if (!this.id) {
      this.showError('No recipe was specified in the URL.');
      return;
    }

    this.showLoading();

    try {
      if (this.source === 'community') {
        await this.loadCommunityRecipe();
      } else {
        await this.loadSpoonacularRecipe();
      }
    } catch (err) {
      console.error('RecipeDetails error:', err);
      this.showError('Something went wrong while loading this recipe.');
    }
  }

  showLoading() {
    this.container.innerHTML = `
      <div class="spinner-wrap">
        <div class="custom-spinner" role="status" aria-label="Loading recipe"></div>
      </div>`;
  }

  showError(message) {
    this.container.innerHTML = `<p class="empty-state">⚠️ ${message}</p>`;
  }

  async loadSpoonacularRecipe() {
    const response = await fetch(`/api/spoonacular/recipe/${this.id}`);
    if (!response.ok) {
      this.showError('Recipe not found.');
      return;
    }
    const data = await response.json();

    document.title = `${data.title} | Global Culinary Explorer`;

    const ingredients = (data.extendedIngredients || [])
      .map((ing) => `<li>${this.escapeHtml(ing.original)}</li>`)
      .join('');

    let instructionsHtml = '';
    if (data.analyzedInstructions && data.analyzedInstructions.length > 0) {
      instructionsHtml = `<ol>${data.analyzedInstructions[0].steps
        .map((step) => `<li>${this.escapeHtml(step.step)}</li>`)
        .join('')}</ol>`;
    } else if (data.instructions) {
      instructionsHtml = `<p>${this.escapeHtml(this.stripHtml(data.instructions))}</p>`;
    } else {
      instructionsHtml = `<p class="empty-state">No instructions were provided for this recipe.</p>`;
    }

    this.container.innerHTML = `
      <article class="card-cream">
        ${data.image ? `<img src="${data.image}" alt="${this.escapeHtml(data.title)}" style="width:100%;max-height:340px;object-fit:cover;border-radius:var(--radius-md);margin-bottom:1rem;" />` : ''}
        <h1 class="section-title">${this.escapeHtml(data.title)}</h1>
        <p>⏱ ${data.readyInMinutes || 'N/A'} min ${data.servings ? '· ' + data.servings + ' servings' : ''}</p>

        <h2 class="section-title" style="font-size:1.2rem;margin-top:1.5rem;">Ingredients</h2>
        <ul>${ingredients || '<li>No ingredient data available.</li>'}</ul>

        <h2 class="section-title" style="font-size:1.2rem;margin-top:1.5rem;">Instructions</h2>
        ${instructionsHtml}
      </article>
    `;
  }

  async loadCommunityRecipe() {
    const response = await fetch(`/api/recipes/${this.id}`);
    if (!response.ok) {
      this.showError('Recipe not found.');
      return;
    }
    const recipe = await response.json();

    document.title = `${recipe.title} | Global Culinary Explorer`;

    const ingredientLines = recipe.ingredients
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<li>${this.escapeHtml(line)}</li>`)
      .join('');

    this.container.innerHTML = `
      <article class="card-cream">
        <span class="badge-sage">${this.escapeHtml(recipe.category)}</span>
        <h1 class="section-title">${this.escapeHtml(recipe.title)}</h1>
        <p>By ${this.escapeHtml(recipe.author)} · ⏱ ${recipe.prep_time_minutes} min</p>

        <h2 class="section-title" style="font-size:1.2rem;margin-top:1.5rem;">Ingredients</h2>
        <ul>${ingredientLines || '<li>No ingredients listed.</li>'}</ul>

        <h2 class="section-title" style="font-size:1.2rem;margin-top:1.5rem;">Instructions</h2>
        <p>${this.escapeHtml(recipe.instructions)}</p>
      </article>
    `;
  }

  stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new RecipeDetails({ containerId: 'recipe-detail-container' });
});
