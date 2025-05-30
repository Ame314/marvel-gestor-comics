export default class VistaDetalleComic {
  constructor() {
    this.elemento = document.createElement('div');
    this.elemento.className = 'comic-detail hidden';
  }

  mostrar(comic) {
    this.elemento.innerHTML = `
      <div class="detail-card">
        <img src="${comic.get("thumbnail").path}.${comic.get("thumbnail").extension}" width="300">
        <div class="detail-info">
          <h2>${comic.get("title")}</h2>
          <p>${comic.get("description") || "Sin descripción disponible"}</p>
          <button id="close-detail">Cerrar</button>
        </div>
      </div>
    `;

    this.elemento.classList.remove('hidden');

    this.elemento.querySelector('#close-detail').addEventListener('click', () => {
      this.elemento.classList.add('hidden');
      this.elemento.innerHTML = '';
    });
  }

  render() {
    return this.elemento;
  }
}
