// recipeLabManager.js
// ES6 class: validates the recipe submission form via regex rules,
// posts the payload to our Express/Neon backend, and renders the
// community recipe feed.

class RecipeLabManager {
  constructor() {
    this.form = document.getElementById('recipe-form');
    this.feedback = document.getElementById('form-feedback');
    this.communityGrid = document.getElementById('community-recipes');

    this.rules = {
      title: /^.{3,100}$/,
      author: /^[A-Za-z\u00C0-\u017F' -]{2,60}$/,
      category: /^[A-Za-z '-]{2,40}$/,
      ingredients: /^.{5,}$/s,
      instructions: /^.{10,}$/s,
      prep_time_minutes: /^[1-9][0-9]{0,3}$/
    };

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.loadRecipes();
  }

  validateField(name, value) {
    const rule = this.rules[name];
    return rule ? rule.test(value.trim()) : true;
  }

  clearErrors() {
    Object.keys(this.rules).forEach((name) => {
      const el = document.getElementById(`err-${name}`);
      if (el) el.textContent = '';
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.clearErrors();

    const formData = new FormData(this.form);
    const payload = {};
    let isValid = true;

    for (const name of Object.keys(this.rules)) {
      const value = formData.get(name) || '';
      payload[name] = name === 'prep_time_minutes' ? Number(value) : value.trim();

      if (!this.validateField(name, value)) {
        isValid = false;
        const el = document.getElementById(`err-${name}`);
        if (el) el.textContent = this.errorMessage(name);
      }
    }

    if (!isValid) {
      this.feedback.innerHTML = '';
      return;
    }

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Server rejected the recipe');

      this.feedback.innerHTML = `<div class="form-success">✅ Recipe submitted successfully!</div>`;
      this.form.reset();
      this.loadRecipes();
    } catch (err) {
      console.error('RecipeLabManager submit error:', err);
      this.feedback.innerHTML = `<p class="empty-state">⚠️ Could not save your recipe. Please try again.</p>`;
    }
  }

  errorMessage(name) {
    const messages = {
      title: 'Title must be 3-100 characters.',
      author: 'Enter a valid name (letters only, 2-60 characters).',
      category: 'Category must be 2-40 letters.',
      ingredients: 'Please list at least a few ingredients.',
      instructions: 'Instructions must be at least 10 characters.',
      prep_time_minutes: 'Enter a valid number of minutes.'
    };
    return messages[name] || 'Invalid value.';
  }

  async loadRecipes() {
    this.communityGrid.innerHTML = `
      <div class="spinner-wrap"><div class="custom-spinner"></div></div>`;
    try {
      const response = await fetch('/api/recipes');
      if (!response.ok) throw new Error('Failed to load recipes');
      const recipes = await response.json();

      if (recipes.length === 0) {
        this.communityGrid.innerHTML = `<p class="empty-state">No community recipes yet — be the first to add one!</p>`;
        return;
      }

      this.communityGrid.innerHTML = recipes.map((r) => this.renderCard(r)).join('');
    } catch (err) {
      console.error('RecipeLabManager load error:', err);
      this.communityGrid.innerHTML = `<p class="empty-state">⚠️ Could not load community recipes.</p>`;
    }
  }

  renderCard(recipe) {
    return `
      <article class="dish-card">
        <div class="body">
          <span class="badge-sage">${this.escapeHtml(recipe.category)}</span>
          <h3>${this.escapeHtml(recipe.title)}</h3>
          <p>By ${this.escapeHtml(recipe.author)} · ${recipe.prep_time_minutes} min</p>
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

document.addEventListener('DOMContentLoaded', () => new RecipeLabManager());
