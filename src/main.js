////////////// Given by Search Engine Modules //////////////
// --- trackSelectableResults()
// Appends HTML Elements to return of getResults(), so they can be stylized
//
// --- updateScrollPosition()
// updates the scroll position each time when selecting another search result
// parameters are depending on padding, margin, height of various Element of each Site
//
// --- setFocus()
// focusses specific search engine depending elements for appropriate enter presses
//
// --- getResults()
// get the results, that will be stylized

// --- let getSearchbarElement()
// get the searchbar - used for selection of the searchbar

// firefox and chrome support
if (typeof browser === "undefined") {
  var browser = chrome;
}

var selectedElement = null;
let selectedElementIndex = -1;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
  addListener();
  injectCSS();
  trackSelectableResults();
  console.log("Arrow Navigation started");
}

async function injectCSS() {
  let styleElement = document.createElement("style");
  styleElement.id = "arrowNavigationCSS";

  css = await browser.storage.local.get("css").then((e) => {
    return e.css;
  });
  styleElement.innerText = css == null ? await returnSimpleCSS() : css

  async function inject(){document.head.appendChild(await styleElement)}
  // inject as fast as possible
  inject()
  // inject afterwards again, for correct
  window.addEventListener('load', inject, false)
}

function selectSearchBar() {
  if (selectedElement != null) {
    selectedElement.classList.remove("activeSelected");
  }
  selectedElement = null;

  searchbarElement = getSearchbarElement()
  searchbarElement.setSelectionRange(0, searchbarElement.value.length)
  document.activeElement.blur()
  searchbarElement.click();
  searchbarElement.focus();
}

function selectElement(div) {
  if (selectedElement != null) {
    selectedElement.classList.remove("activeSelected");
  }
  selectedElement = div;
  selectedElement.classList.add("activeSelected");

  setFocus();
}

function selectPreviousElement() {
  if (selectedElementIndex < 1) {
    selectedElementIndex--;
    selectSearchBar();
  }
  if (selectedElementIndex >= 1) {
    selectedElementIndex--;
    selectElement(getResults()[selectedElementIndex]);
  }
}

function selectNextElement() {
  trackSelectableResults();

  // triggering on last entry
  if (selectedElementIndex >= getResults().length - 1) {
    return;
  }
  selectedElementIndex++;
  selectElement(getResults()[selectedElementIndex]);
}

function addListener() {
  // update style is changed in extension
  browser.runtime.onMessage.addListener((message) => {
    if (message.message === "CSSChange") {
      document.head.removeChild(document.getElementById("arrowNavigationCSS"));
      injectCSS();
    }
  });

  // when site is reloaded by cache, reassign selectedElement
  // then: enter is working, otherwise not
  window.addEventListener(
    "pageshow",
    () => {
      selectedElement = document.querySelector(".activeSelected");
      if (selectedElement != null) {
        setFocus();
      }
    },
    false
  );

  // keypress, arrow navigation
  document.addEventListener("keydown", function (event) {
    if (!(getSearchbarElement() === document.activeElement)) {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          selectPreviousElement();
          updateScrollPosition();
          break;
        case "ArrowDown":
          event.preventDefault();
          selectNextElement();
          updateScrollPosition();
          break;
      }
      return;
    }
  });
}
