// beirutBitesFilter.js
// ES6 class: renders the curated dish grid and filters it client-side
// using native .includes() string matching against name, category,
// description, and tags.

class BeirutBitesFilter {
  constructor({ dishes, gridId, inputId, emptyId }) {
    this.dishes = dishes;
    this.grid = document.getElementById(gridId);
    this.input = document.getElementById(inputId);
    this.emptyState = document.getElementById(emptyId);

    this.renderAll(this.dishes);
    this.input.addEventListener('input', () => this.handleFilter());
  }

  renderAll(list) {
    if (list.length === 0) {
      this.grid.style.display = 'none';
      this.emptyState.style.display = 'block';
      return;
    }
    this.grid.style.display = 'grid';
    this.emptyState.style.display = 'none';

    this.grid.innerHTML = list.map((dish) => this.renderCard(dish)).join('');
  }

  renderCard(dish) {
    return `
      <a class="dish-card-link" href="beirut-bite-details.html?id=${dish.id}">
        <article class="dish-card" data-id="${dish.id}">
          <div class="body">
            <span style="font-size:2rem;">${dish.icon}</span>
            <span class="badge-sage" style="float:right;">${this.escapeHtml(dish.category)}</span>
            <h3>${this.escapeHtml(dish.name)}</h3>
            <p style="font-style:italic;margin-bottom:0.3rem;">${this.escapeHtml(dish.arabicName)}</p>
            <p>${this.escapeHtml(dish.description)}</p>
          </div>
        </article>
      </a>
    `;
  }

  handleFilter() {
    const query = this.input.value.trim().toLowerCase();

    if (!query) {
      this.renderAll(this.dishes);
      return;
    }

    const filtered = this.dishes.filter((dish) => {
      const searchable = [dish.name, dish.category, dish.description, ...dish.tags]
        .join(' ')
        .toLowerCase();
      return searchable.includes(query);
    });

    this.renderAll(filtered);
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BeirutBitesFilter({
    dishes: BEIRUT_BITES,
    gridId: 'dish-grid',
    inputId: 'dish-filter',
    emptyId: 'no-results'
  });
});
