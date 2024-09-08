var results = [];

function getResults() {
  return results;
}
function getSearchbarElement() {
  return document.querySelector("textarea");
}

function getMoreResultsElement() {
  return document.querySelector("#pnnext");
}

function trackSelectableResults() {
  results = [];
  linkSet = [];

  // all regular results
  document
    .querySelector("#search")
    .querySelectorAll("a")
    .forEach((a) => {
      if (a.querySelectorAll("cite").length > 0) {
        linkSet.push(a);
      }
    });

  // news
  document
    .querySelectorAll("#search div[data-news-cluster-id] a")
    .forEach((a) => {
      linkSet.push(a);
    });

  // APPROACH:
  // finding for every link the div which:
  // 1) does not include any other links
  // 2) is from this set optically the largest

  linkSet.forEach((link) => {
    // 1)
    // create the set of links without the current iterating link
    // define all possible divs, that could contain an independent div
    let otherLinks = [...linkSet].filter((e) => e !== link);
    let possibleDivs = document
      .querySelector("#center_col")
      .querySelectorAll("div");

    // init independent Divs Array
    // iterate through all Divs
    // check for:
    // a) if given div contains wanted link
    // b) if given div does not contain other links
    // If Yes, append to independentDivs
    let independentDivs = [];
    possibleDivs.forEach((div) => {
      if (!div.contains(link)) {
        return;
      }
      if (otherLinks.some((otherLink) => div.contains(otherLink))) {
        return;
      }
      independentDivs.push(div);
    });

    // 2)
    // iterate through all independent divs
    // calculate area of div
    // get max div area and their corresponding div
    // append div to results where styling will be applied

    let areaOfDivs = independentDivs.map(
      (div) =>
        div.getBoundingClientRect().height * div.getBoundingClientRect().width
    );
    let largestDiv =
      independentDivs[areaOfDivs.indexOf(Math.max(...areaOfDivs))];

    if (largestDiv.querySelector("div[data-snc]") == null) {
      results.push(largestDiv);
    } else {
      results.push(largestDiv.querySelector("div[data-snc]"));
    }
  });
}

function updateScrollPosition() {
  if (selectedElement == null) {
    return;
  }

  window.requestAnimationFrame(() => {
    let offsetY;
    let offsetYAdd;
    let scrollY;
    let rect = selectedElement.getBoundingClientRect();

    try {
      offsetYAdd = document
        .getElementById("taw")
        .getBoundingClientRect().height;
    } catch {
      offsetYAdd = 0;
    }
    offsetYAdd = 0;

    // offsetY determines how far has been scrolled. No Scrolling -> eg. 200; far scrolling -> -700
    offsetY =
      document.getElementById("topstuff").getBoundingClientRect().height +
      document.getElementById("sfcnt").getBoundingClientRect().bottom;

    scrollY = rect.bottom - offsetY - offsetYAdd - window.innerHeight / 3;

    if (scrollY < window.innerHeight / 2) {
      scrollY = 0;
    }
    window.scrollTo(window.scrollX, scrollY);
  });
}

function setFocus() {
  // expansion questions
  if (selectedElement.querySelector("[aria-expanded]") != null) {
    selectedElement.querySelector("[aria-expanded]").focus();
    return;
  }
  // normal
  selectedElement.querySelector("a").focus();
}
