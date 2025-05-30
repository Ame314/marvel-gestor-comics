const Comics = Backbone.Collection.extend({
  model: Comic,

  url: function () {
    const ts = Date.now().toString();
    const publicKey = "ea4aa10fe5dc13cc5e832d8421587bc1";
    const privateKey = "92bea8dd8a72bb0f9e512639715441540a4670e3";

    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    return `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=10`;
  },

  parse: function (response) {
    return response.data.results;
  }
});
