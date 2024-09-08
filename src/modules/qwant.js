var results = [];

function getResults() {
  return results;
}
function getSearchbarElement() {
  return document.querySelector(
    "form[data-testid='mainSearchBar'] > div > input"
  );
}

function getMoreResultsElement() {
  return document.querySelector('button[data-testid="buttonShowMore"]');
}

function trackSelectableResults() {
  results = [];
  document.querySelectorAll("div[data-testid='webResult']").forEach((el) => {
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
    offsetY = document
      .querySelector("[data-testid='webNavItem']")
      .parentElement.parentElement.getBoundingClientRect().bottom;

    scrollY =
      selectedElement.getBoundingClientRect().bottom -
      offsetY -
      window.innerHeight / 3;

    if (scrollY < window.innerHeight / 2) {
      scrollY = 0;
    }
    window.scrollTo(window.scrollX, scrollY);
  });
}

function setFocus() {
  // normal
  selectedElement.querySelector("a").focus();
}
