// groceryListEngine.js
// ES6 class managing the grocery checklist: fetches items from Neon,
// posts new items, toggles checked state (PUT), and deletes items.

class GroceryListEngine {
  constructor() {
    this.form = document.getElementById('grocery-form');
    this.nameInput = document.getElementById('item-name');
    this.qtyInput = document.getElementById('item-quantity');
    this.listContainer = document.getElementById('grocery-list');
    this.statusRegion = document.getElementById('grocery-status');

    this.items = [];

    this.form.addEventListener('submit', (e) => this.handleAdd(e));
    this.loadItems();
  }

  async loadItems() {
    this.listContainer.innerHTML = `<div class="spinner-wrap"><div class="custom-spinner"></div></div>`;
    try {
      const response = await fetch('/api/grocery');
      if (!response.ok) throw new Error('Failed to load grocery list');
      this.items = await response.json();
      this.render();
    } catch (err) {
      console.error('GroceryListEngine load error:', err);
      this.listContainer.innerHTML = `<p class="empty-state">⚠️ Could not load your grocery list.</p>`;
    }
  }

  async handleAdd(event) {
    event.preventDefault();
    const item_name = this.nameInput.value.trim();
    const quantity = this.qtyInput.value.trim() || '1';
    if (!item_name) return;

    try {
      const response = await fetch('/api/grocery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name, quantity })
      });
      if (!response.ok) throw new Error('Failed to add item');
      const newItem = await response.json();
      this.items.push(newItem);
      this.render();
      this.form.reset();
    } catch (err) {
      console.error('GroceryListEngine add error:', err);
      this.statusRegion.innerHTML = `<p class="empty-state">⚠️ Could not add item.</p>`;
    }
  }

  async toggleChecked(id, currentState) {
    try {
      const response = await fetch(`/api/grocery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_checked: !currentState })
      });
      if (!response.ok) throw new Error('Failed to update item');
      const updated = await response.json();
      this.items = this.items.map((i) => (i.id === id ? updated : i));
      this.render();
    } catch (err) {
      console.error('GroceryListEngine toggle error:', err);
    }
  }

  async deleteItem(id) {
    try {
      const response = await fetch(`/api/grocery/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete item');
      this.items = this.items.filter((i) => i.id !== id);
      this.render();
    } catch (err) {
      console.error('GroceryListEngine delete error:', err);
    }
  }

  render() {
    if (this.items.length === 0) {
      this.listContainer.innerHTML = `<p class="empty-state">Your grocery list is empty. Add something above!</p>`;
      return;
    }

    this.listContainer.innerHTML = this.items
      .map(
        (item) => `
        <div class="grocery-item ${item.is_checked ? 'checked' : ''}" data-id="${item.id}">
          <label class="item-label" style="display:flex;align-items:center;gap:0.6rem;cursor:pointer;">
            <input type="checkbox" class="check-toggle" data-id="${item.id}" ${item.is_checked ? 'checked' : ''} />
            ${this.escapeHtml(item.item_name)} <span class="badge-sage">${this.escapeHtml(item.quantity)}</span>
          </label>
          <button class="delete-btn" data-id="${item.id}" aria-label="Delete item">✕</button>
        </div>
      `
      )
      .join('');

    this.listContainer.querySelectorAll('.check-toggle').forEach((el) => {
      el.addEventListener('change', () => {
        const id = Number(el.dataset.id);
        const item = this.items.find((i) => i.id === id);
        this.toggleChecked(id, item.is_checked);
      });
    });

    this.listContainer.querySelectorAll('.delete-btn').forEach((el) => {
      el.addEventListener('click', () => this.deleteItem(Number(el.dataset.id)));
    });
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => new GroceryListEngine());
