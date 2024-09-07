if (typeof browser === "undefined") {
  var browser = chrome;
}

document.addEventListener("DOMContentLoaded", function () {
  let colorPicker;

  window.addEventListener("load", startup, false);

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

  async function showTextarea(bool) {
    let textareaDiv = document.getElementById("textareaDiv");
    let settings = document.getElementById("settings");
    console.log(textareaDiv.style.display, settings.style.display);
    if (bool) {
      textareaDiv.style.display = "inline";
      settings.style.display = "none";
    } else {
      textareaDiv.style.display = "none";
      settings.style.display = "flex";
    }
  }

  async function setColorTheme() {
    document.querySelectorAll(".slider").forEach(async (el) => {
      el.style = `accent-color: ${await loadValue("borderColor")}`;
    });
    document.querySelector(
      "input + .toggleSwitch"
    ).style = `background-color: ${await loadValue("borderColor")}`;
    document.querySelector(
      "#transferFromSimpleMode"
    ).style = `box-shadow: 0px 0px 5px ${await loadValue(
      "borderColor"
    )}, 0px 0px 3px white; `;
  }

  async function updateCSS() {
    //update Css depending on css mode "simple" or "customCss"
    if (await loadValue("customMode")) {
      await showTextarea(true);
      await createUpdateFunction("css", await loadValue("customCSS"), true)();
    } else {
      await showTextarea(false);
      await createUpdateFunction("css", await returnSimpleCSS(), true)();
    }
    setColorTheme();
    document.getElementById("color-code").blur();
  }

  async function startup() {
    //////// customCSS Editor ////////

    // init css with simpleCSS
    Defaults.customCSS = returnSimpleCSS();
    Defaults.css = returnSimpleCSS();

    let editor = CodeMirror.fromTextArea(document.getElementById("textarea"), {
      mode: "css",
      theme: "simple_ambiance",
    });

    editor.setValue(await loadValue("customCSS"));
    editor.on(
      "change",
      () => {
        createUpdateFunction("customCSS", editor.getValue())();
      },
      false
    );

    // setup transfer button - simple css to custom
    transferButton = document.getElementById("transferFromSimpleMode");
    transferButton.addEventListener(
      "click",
      async () => {
        editor.setValue(await returnSimpleCSS());
        await createUpdateFunction("customCSS", editor.getValue())();
      },
      false
    );

    //////// setup input for updating localStorage ////////

    async function setupInput(property, type) {
      tmp = document.getElementById(`${property}-input`);
      tmp.value = await loadValue(property);
      tmp.addEventListener(
        type,
        (event) => {
          createUpdateFunction(property, event)();
        },
        false
      );
      tmp.select();
    }

    await setupInput("customMode", "click");
    tmp.checked = await loadValue("customMode");
    await setupInput("borderWidth", "change");
    await setupInput("borderRadius", "change");
    await setupInput("borderPadding", "change");
    await setupInput("borderMargin", "change");

    // bidirectional bound of color picker and colorcode
    await setupInput("borderColor", "change");
    colorPicker = document.getElementById("borderColor-input");
    colorCode = document.querySelector("#color-code");

    colorCode.value = await colorPicker.value;

    colorPicker.addEventListener(
      "input",
      (event) => {
        colorCode.value = event.target.value;
      },
      false
    );
    colorCode.addEventListener(
      "input",
      (event) => {
        if (event.target.value[0] == "#" && event.target.value.length == 7) {
          colorPicker.value = event.target.value;
          colorPicker.dispatchEvent(new Event("change"));
        }
      },
      false
    );
    colorCode.select();
    await updateCSS();
  }
});
