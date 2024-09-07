// replace Foo with corresponding elements
var results = [];

function getResults() {
  return results;
}

function getSearchbarElement() {
  return FOO;
}

function trackSelectableResults() {
  results = [];
  FOO.forEach((el) => {
    if (results.includes(el)) {
      return;
    }
    results.push(el);
  });
}

function updateScrollPosition() {
  if (selectedElement == null) {
    return;
  }

  window.requestAnimationFrame(() => {
    let offsetY;
    let scrollY;

    // offsetY determines how far has been scrolled. No Scrolling -> eg. 200; far scrolling -> -7
    offsetY = FOO.getBoundingClientRect().bottom;

    scrollY =
      selectedElement.getBoundingClientRect().bottom -
      offsetY -
      window.innerHeight / 3;

    if (scrollY < window.innerHeight / 3) {
      scrollY = 0;
    }
    window.scrollTo(window.scrollX, scrollY);
  });
}

function setFocus() {
  // normal
  selectedElement.querySelector("a").focus();
}
