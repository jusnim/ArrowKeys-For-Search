if (typeof browser === "undefined") {
  var browser = chrome;
}

const Defaults = {
  borderWidth: 3,
  borderMargin: 3,
  borderRadius: 20,
  borderPadding: 3,
  borderColor: "#944b7c",
  customMode: false,
  darkMode: false,
};

// loading Values from localstorage or Defaults
async function loadValue(property) {
  if (!Object.keys(Defaults).includes(property)) {
    console.err(
      `Given Property (${property}) is not supported and has no default value`
    );
    return;
  }
  let tmp = await browser.storage.local.get(property).then((e) => {
    return e[property];
  });
  return tmp == null ? Defaults[property] : tmp;
}

async function returnSimpleCSS() {
  return `.activeSelected {
    border-style: solid;
    border-width: ${await loadValue("borderWidth")}px;
    border-color: ${await loadValue("borderColor")};
    border-radius: ${await loadValue("borderRadius")}px;
    padding: ${await loadValue("borderPadding")}%;
    margin-top: ${await loadValue("borderMargin")}%;
    margin-bottom: ${await loadValue("borderMargin")}%;
  }`;
}

window.addEventListener(
  "load",
  () => {
    // init css with simpleCSS
    Defaults.customCSS = returnSimpleCSS();
    Defaults.css = returnSimpleCSS();
  },
  false
);

// return function for updating/setting values in localStorage
function createUpdateFunction(property, e, skipUpdateCSS = false) {
    if (!Object.keys(Defaults).includes(property)) {
      console.err(
        `Given Property (${property}) is not supported and has no default value`
      );
      return;
    }
  
    let value = e;
    if (e instanceof Event) {
      value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    }
  
    return async function () {
      await browser.storage.local.set({ [property]: value });
  
      browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { message: "CSSChange" });
      });
  
      if (skipUpdateCSS) {
        return;
      }
      updateCSS();
    };
  }

  // Update CSS depending on mode "simple" or "custom"
async function updateCSS() {
    if (await loadValue("customMode")) {
      await createUpdateFunction("css", await loadValue("customCSS"), true)();
    } else {
        await createUpdateFunction("css", await returnSimpleCSS(), true)();    
    }
    await updateCSSHook()
}

async function updateCSSHook(){
    // pass
    {}
}
