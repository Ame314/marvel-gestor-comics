export default class VistaBuscarComics {
  constructor(callbackBusqueda) {
    this.callbackBusqueda = callbackBusqueda;
  }

  render() {
    const contenedor = document.createElement('div');
    const input = document.createElement('input');
    input.placeholder = 'Buscar cómics...';

    const boton = document.createElement('button');
    boton.textContent = 'Buscar';

    boton.addEventListener('click', () => {
      this.callbackBusqueda(input.value);
    });

    contenedor.append(input, boton);
    return contenedor;
  }
}
