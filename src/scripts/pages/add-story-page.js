import AddStoryPresenter from '../presenters/add-story-presenter.js';

export default class AddStoryPage {
  constructor() {
    this.presenter = null;
    this.video = null;
    this.canvas = null;
    this.capturedBlob = null;
  }
  
  async render() {
    return `
      <div class="container">
        <h1>Tambah Cerita Baru</h1>
        <form id="story-form">
          <div class="form-group">
            <label for="desc">Deskripsi *</label>
            <textarea id="desc" rows="3" required></textarea>
            <div id="desc-error" class="error-message"></div>
          </div>
          <div class="form-group">
            <label for="photo">Foto *</label>
            <input type="file" id="photo" accept="image/*" required>
            <div id="photo-error" class="error-message"></div>
          </div>
          <div class="form-group">
            <label>Klik peta untuk lokasi (opsional)</label>
            <div id="map" style="height:300px; border-radius:8px;"></div>
            <p id="coord-info">Belum pilih lokasi</p>
          </div>
          <button type="submit" id="submit-btn">Kirim Story</button>
          <div id="status" role="status"></div>
        </form>
      </div>
    `;
  }
  
  async afterRender() {
    this.presenter = new AddStoryPresenter(this);
    this.presenter.initMap();
    
    const fileInput = document.getElementById('photo');
    const form = document.getElementById('story-form');
    
    form.onsubmit = async (e) => {
      e.preventDefault();
      const desc = document.getElementById('desc').value.trim();
      const photoFile = fileInput.files[0];
      let valid = true;
      if (!desc) {
        document.getElementById('desc-error').innerText = 'Deskripsi wajib';
        valid = false;
      } else {
        document.getElementById('desc-error').innerText = '';
      }
      if (!photoFile) {
        document.getElementById('photo-error').innerText = 'Foto wajib diupload';
        valid = false;
      } else if (photoFile.size > 1_000_000) {
        document.getElementById('photo-error').innerText = 'Ukuran foto maksimal 1MB';
        valid = false;
      } else {
        document.getElementById('photo-error').innerText = '';
      }
      if (!valid) return;
      
      const submitBtn = document.getElementById('submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerText = 'Mengirim...';
      try {
        const result = await this.presenter.submit(desc, photoFile);
        const statusDiv = document.getElementById('status');
        if (result && result.offline) {
          statusDiv.innerHTML = '<div class="success-message">📱 Disimpan offline. Akan disinkronkan saat online.</div>';
        } else {
          statusDiv.innerHTML = '<div class="success-message">✅ Cerita berhasil ditambahkan!</div>';
        }
        form.reset();
        this.presenter.reset();
        setTimeout(() => window.location.hash = '#/', 1500);
      } catch (err) {
        document.getElementById('status').innerHTML = `<div class="error-message">❌ ${err.message}</div>`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Kirim Story';
      }
    };
  }
  
  showCoord(lat, lng) {
    const el = document.getElementById('coord-info');
    if (el) el.innerHTML = `📍 Lokasi: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}