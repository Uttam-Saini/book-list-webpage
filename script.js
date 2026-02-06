(function () {
  var PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="160" viewBox="0 0 120 160"><rect fill="#ddd" width="120" height="160"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="12" font-family="sans-serif">No image</text></svg>'
  );

  function getPageParam() {
    var params = new URLSearchParams(window.location.search);
    return params.get('page') || 'page1';
  }

  function getJsonPath(page) {
    return 'data/' + page + '.json';
  }

  function renderBook(book) {
    var card = document.createElement('article');
    card.className = 'book-card';

    var imgWrap = document.createElement('div');
    imgWrap.className = 'book-card__image-wrap';

    var img = document.createElement('img');
    img.className = 'book-card__image';
    img.alt = book.title || 'Book cover';
    img.src = book.image || PLACEHOLDER_IMAGE;
    img.onerror = function () { img.src = PLACEHOLDER_IMAGE; };
    imgWrap.appendChild(img);

    var content = document.createElement('div');
    content.className = 'book-card__content';

    var title = document.createElement('h2');
    title.className = 'book-card__title';
    title.textContent = book.title || 'Untitled';
    content.appendChild(title);

    var buttons = document.createElement('div');
    buttons.className = 'book-card__buttons';

    if (book.amazon) {
      var amazonBtn = document.createElement('a');
      amazonBtn.className = 'book-card__btn';
      amazonBtn.href = book.amazon;
      amazonBtn.target = '_blank';
      amazonBtn.rel = 'noopener noreferrer';
      amazonBtn.textContent = 'Buy on Amazon';
      buttons.appendChild(amazonBtn);
    }

    if (book.pdf) {
      var pdfBtn = document.createElement('a');
      pdfBtn.className = 'book-card__btn book-card__btn--pdf';
      pdfBtn.href = book.pdf;
      pdfBtn.target = '_blank';
      pdfBtn.rel = 'noopener noreferrer';
      pdfBtn.textContent = 'Free PDF';
      buttons.appendChild(pdfBtn);
    }

    content.appendChild(buttons);
    card.appendChild(imgWrap);
    card.appendChild(content);
    return card;
  }

  function showError(message) {
    var el = document.getElementById('error');
    el.textContent = message;
    el.hidden = false;
  }

  function hideError() {
    document.getElementById('error').hidden = true;
  }

  function loadBooks() {
    var listEl = document.getElementById('book-list');
    listEl.innerHTML = '';
    hideError();

    var page = getPageParam();
    var path = getJsonPath(page);

    fetch(path)
      .then(function (res) {
        if (!res.ok) throw new Error('Could not load ' + path);
        return res.json();
      })
      .then(function (data) {
        var books = Array.isArray(data) ? data : (data.books || []);
        books.forEach(function (book) {
          listEl.appendChild(renderBook(book));
        });
      })
      .catch(function (err) {
        showError(err.message || 'Failed to load book list.');
      });
  }

  loadBooks();
})();
