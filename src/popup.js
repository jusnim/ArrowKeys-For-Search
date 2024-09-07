if (typeof browser === "undefined") {
  var browser = chrome;
}

window.addEventListener("load", startup, false);

async function startup() {
  //////// customCSS Editor ////////
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
////////// popup.html styling only //////////

// When internal CSSUpdate is done, change UI 
async function updateCSSHook(){
  await showTextarea(await loadValue("customMode"));
  setColorTheme();
  document.getElementById("color-code").blur();
}

async function showTextarea(bool) {
  let textareaDiv = document.getElementById("textareaDiv");
  let settings = document.getElementById("settings");
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

