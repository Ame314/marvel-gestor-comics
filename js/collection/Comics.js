// js/collection/Comics.js
const Comics = Backbone.Collection.extend({
  model: Comic,

  initialize: function() {
    // Constructor de la colección
  },

  url: function() {
    const ts = Date.now().toString();
    const publicKey = "ea4aa10fe5dc13cc5e832d8421587bc1";
    const privateKey = "92bea8dd8a72bb0f9e512639715441540a4670e3";

    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    let baseUrl = `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    
    // Agregar parámetros adicionales si existen
    if (this.queryParams) {
      const params = new URLSearchParams(this.queryParams);
      baseUrl += '&' + params.toString();
    }

    return baseUrl;
  },

  fetch: function(options = {}) {
    // Almacenar parámetros de consulta para construir la URL
    if (options.data) {
      this.queryParams = options.data;
    }

    // Llamar al método fetch original de Backbone
    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  parse: function(response) {
    // Retornar solo los resultados de la respuesta de Marvel API
    return response.data.results;
  }
});