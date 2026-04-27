import SavedPresenter from '../presenters/saved-presenter.js';

export default class SavedPage {
  constructor() {
    this.presenter = null;
  }
  async render() {
    return `
      <div class="container">
        <h1>Cerita Tersimpan</h1>
        <div id="saved-list" class="story-list">Memuat...</div>
      </div>
    `;
  }
  async afterRender() {
    this.presenter = new SavedPresenter(this);
    await this.presenter.loadSavedStories();
  }
  showSavedStories(stories) {
    const container = document.getElementById('saved-list');
    if (!container) return;
    if (!stories.length) {
      container.innerHTML = '<p>Belum ada cerita tersimpan.</p>';
      return;
    }
    container.innerHTML = stories.map((s, index) => `
      <div class="story-card">
        <img src="${s.photoUrl || ''}" alt="Foto cerita" loading="lazy" style="width:100%; height:180px; object-fit:cover;">
        <div class="content">
          <strong>${s.name || 'Tanpa nama'}</strong>
          <p>${(s.description || '').slice(0,100)}</p>
          <small>${new Date(s.createdAt).toLocaleDateString('id-ID')}</small>
          <button class="delete-saved-btn" data-id="${s.id}">Hapus</button>
        </div>
      </div>
    `).join('');
    const deleteButtons = container.querySelectorAll('.delete-saved-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.presenter.deleteSavedStory(id);
      });
    });
  }
  
  showError(msg) {
    const container = document.getElementById('saved-list');
    if (container) container.innerHTML = `<p style="color:red">${msg}</p>`;
  }
}