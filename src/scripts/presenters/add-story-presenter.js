import StoryModel from '../models/story-model.js';
import MapHelper from '../utils/map-helper.js';
import { saveStory } from '../utils/idb.js';

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.map = null;
    this.selectedLat = null;
    this.selectedLon = null;
    this.marker = null;
    this.mediaStream = null;
  }
  
  initMap() {
    this.map = MapHelper.initMap('map', -6.2, 106.8, 13);
    MapHelper.addTileLayer(this.map, 'street');
    this.map.on('click', (e) => {
      this.selectedLat = e.latlng.lat;
      this.selectedLon = e.latlng.lng;
      this.view.showCoord(this.selectedLat, this.selectedLon);
      if (this.marker) this.map.removeLayer(this.marker);
      this.marker = MapHelper.addMarker(this.map, this.selectedLat, this.selectedLon, 'Lokasi story Anda');
    });
  }
  
  async submit(desc, photoFile) {
    if (!desc.trim()) throw new Error('Deskripsi wajib');
    if (!photoFile) throw new Error('Foto belum dipilih');
    if (photoFile.size > 1_000_000) throw new Error('Ukuran foto max 1MB');
    if (!navigator.onLine) {
      const dummyStory = {
        id: 'offline_' + Date.now(),
        description: desc,
        photoFile: photoFile,
        lat: this.selectedLat,
        lon: this.selectedLon,
        createdAt: new Date().toISOString(),
        sync: false,
        name: 'User (offline)',
        photoUrl: '#'
      };
      await saveStory(dummyStory);
      return { offline: true };
    } else {
      const result = await StoryModel.addStory(desc, photoFile, this.selectedLat, this.selectedLon);
      return result;
    }
  }
  
  reset() {
    this.selectedLat = null;
    this.selectedLon = null;
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
  }
}