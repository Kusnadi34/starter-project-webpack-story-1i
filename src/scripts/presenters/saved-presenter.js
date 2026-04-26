import { getAllStories, deleteStory } from '../utils/idb.js';

export default class SavedPresenter {
  constructor(view) {
    this.view = view;
  }
  async loadSavedStories() {
    try {
      const stories = await getAllStories();
      this.view.showSavedStories(stories);
    } catch (error) {
      this.view.showError('Gagal memuat cerita tersimpan');
    }
  }
  async deleteSavedStory(id) {
    if (confirm('Yakin ingin menghapus cerita ini?')) {
      await deleteStory(id);
      this.loadSavedStories();
    }
  }
}