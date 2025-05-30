import VistaBuscarComics from './VistaBuscarComics.js';
import VistaComics from './VistaComics.js';
import VistaDetalleComic from './VistaDetalleComic.js';

export default class VistaGlobal {
  constructor(elementoPadre) {
    this.elementoPadre = elementoPadre;
    this.vistaBuscar = new VistaBuscarComics(this.buscarComics.bind(this));
    this.vistaComics = new VistaComics();
    this.vistaDetalle = new VistaDetalleComic();

    // Evento para mostrar detalle
    this.vistaComics.onComicSeleccionado = (comic) => {
      this.vistaDetalle.mostrar(comic);
    };

    this.render();
  }

  async buscarComics(texto) {
    await this.vistaComics.actualizarLista(texto);
    this.render();
  }

  render() {
    this.elementoPadre.innerHTML = '';
    this.elementoPadre.appendChild(this.vistaBuscar.render());
    this.elementoPadre.appendChild(this.vistaComics.render());
    this.elementoPadre.appendChild(this.vistaDetalle.render());
  }
}
