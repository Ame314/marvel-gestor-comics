import Comics from '../collection/Comics.js';
import VistaComic from './VistaComics.js';

export default class VistaComics {
  constructor() {
    this.comics = new Comics();
    this.elemento = document.createElement('div');
  }

  async actualizarLista(texto) {
    await this.comics.fetchComics(texto);
  }

  render() {
    this.elemento.innerHTML = '';
    this.comics.lista.forEach(comic => {
      const vista = new VistaComic(comic);
      this.elemento.appendChild(vista.render());
    });
    return this.elemento;
  }
}
