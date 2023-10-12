
if (typeof browser === "undefined") {
    var browser = chrome;
}

document.addEventListener("DOMContentLoaded",function (){


let colorPicker;
window.addEventListener("load", startup, false);



// load || init default values

async function loadBorderWidth(){
    let tmp = await browser.storage.local.get("borderWidth").then(e=>{return e.borderWidth});
    return tmp==null ? 3 : tmp;
}
async function loadBorderColor(){
    let tmp = await browser.storage.local.get("borderColor").then(e=>{return e.borderColor});
    return tmp==null ? "#944b7c" : tmp;
}

async function loadBorderRadius(){
    let tmp  = await browser.storage.local.get("borderRadius").then(e=>{return e.borderRadius});
    return tmp==null ? 20 : tmp;
}
async function loadBorderPadding(){
    let tmp = await browser.storage.local.get("borderPadding").then(e=>{return e.borderPadding});
    return tmp==null ? 3 : tmp;
}
async function loadBorderMargin(){
    let tmp = await browser.storage.local.get("borderMargin").then(e=>{return e.borderMargin});
    return tmp==null ? 3 : tmp;
}

async function loadMode(){
    let tmp = await browser.storage.local.get("mode").then(e=>{return e.mode});
    return tmp==null ? 1 : tmp;
}


async function loadDarkMode(){
    let tmp = await browser.storage.local.get("darkMode").then(e=>{return e.darkMode});
    return tmp==null ? 1 : tmp;
}

async function loadCustomCSS(){
    let tmp = await browser.storage.local.get("customCSS").then(e=>{return e.customCSS});
    return tmp==null ? await loadGeneralCSS() : tmp;
}

async function loadGeneralCSS(){
    let tmp = await browser.storage.local.get("css").then(e=>{return e.css});
    if(tmp == null){
        initSimpleCss()
    }
    return await browser.storage.local.get("css").then(e=>{return e.css});
}

async function initSimpleCss(){
    await browser.storage.local.set({"css" : await returnSimpleCSS()})
}

async function updateGeneralCSS(css){
    await browser.storage.local.set({"css" : css})
}

async function updateCustomCSS(customCss){
    console.log("ei")
    await browser.storage.local.set({"customCSS" : customCss})
    updateCSS()
}
async function updateMode(event) {
    await browser.storage.local.set({"mode" : event.target.checked})
    updateCSS()
}

async function updateDarkMode(event) {
    await browser.storage.local.set({"darkMode" : event.target.checked})
    await changeDarkmode()
}

async function updateColor(event, otherItem) {
    otherItem.value = event.target.value;
    await browser.storage.local.set({"borderColor" : event.target.value})
    updateCSS()
}

async function updateWidth(event) {
    await browser.storage.local.set({"borderWidth" : event.target.value})
    updateCSS()
}
async function updateRadius(event) {
    await browser.storage.local.set({"borderRadius" : event.target.value})
    updateCSS()
}
async function updatePadding(event) {
    await browser.storage.local.set({"borderPadding" : event.target.value})
    updateCSS()
}
async function updateMargin(event) {
    await browser.storage.local.set({"borderMargin" : event.target.value})
    updateCSS()
}

async function updateMargin(event) {
    await browser.storage.local.set({"borderMargin" : event.target.value})
    updateCSS()
}

async function changeDarkmode(){
    try{
    await document.querySelector("#darkModeCSS").remove()
    }
    catch{}
    let linkElement = document.createElement("link")
    await linkElement.setAttribute("rel","stylesheet")
    await linkElement.setAttribute("id","darkModeCSS")
    if (await loadDarkMode()){
        await linkElement.setAttribute("id","darkModeCSS")
        await linkElement.setAttribute("href","googlePreviewDark.css")
    }
    else{
        await linkElement.setAttribute("href","googlePreviewWhite.css")
    }
    document.head.appendChild(await linkElement)
}

async function returnSimpleCSS(){
    let simpleCSS =`.activeSelected {
        border-style: solid;
        border-width: ${await loadBorderWidth()}px;
        border-color: ${await loadBorderColor()};
        border-radius: ${await loadBorderRadius()}px;
        padding: ${await loadBorderPadding()}%;
        margin-top: ${await loadBorderMargin()}%;
        margin-bottom: ${await loadBorderMargin()}%;
    }`
    return simpleCSS
}

async function updatePreview(){
    console.log("previwe")
    try{
    document.querySelectorAll("style").forEach(e=>{e.remove()})
    }
    catch{

    }
    let styleElement = document.createElement("style")
    styleElement.innerText=await loadGeneralCSS()
    document.head.appendChild(styleElement)
}

async function showTextarea(bool){
    let textareaDiv = document.getElementById("textareaDiv")
    let settings = document.getElementById("settings")
    if(bool){
        textareaDiv.style.display = "inline";
        settings.style.display = "none";
    }
    else{
        textareaDiv.style.display = "none";
        settings.style.display = "flex";
    }
}



async function startup() {

    let editor = CodeMirror.fromTextArea(document.getElementById("textarea"), {mode: "css", theme: "ambiance", lineNumbers: true});

    editor.setValue(await loadCustomCSS());
    editor.on("change",  ()=> {
        console.log("fdsf")
        updateCustomCSS(editor.getValue());
    }, false);

    transferButton=document.getElementById('transferFromSimpleMode');
    transferButton.addEventListener('click', async ()=>{
        editor.setValue(await returnSimpleCSS());
        await updateCustomCSS(editor.getValue());
    },false);

    
    
    customCssSwitch = document.getElementById('customCssSwitch');
    customCssSwitch.checked = await loadMode();
    customCssSwitch.addEventListener('click', updateMode,false);
    customCssSwitch.select();

    darkModeSwitch = document.getElementById('darkModeSwitch');
    darkModeSwitch.checked = await loadDarkMode();
    await changeDarkmode()
    darkModeSwitch.addEventListener('click', updateDarkMode,false);
    darkModeSwitch.select();

    

    // colorpicker
    colorPicker = document.querySelector("#color-picker");
    colorPicker.value = await loadBorderColor();
    colorCode = document.querySelector("#color-code");
    colorCode.value = await colorPicker.value

    colorCode.addEventListener("input", (event) =>{updateColor(event, colorPicker)}, false);
    colorCode.select();
    colorPicker.addEventListener("input", (event) =>{updateColor(event, colorCode)}, false);
    colorPicker.select();
    

    // borderwidth
    borderWidth = document.querySelector("#borderWidth");
    borderWidth.value = await loadBorderWidth();
    borderWidth.addEventListener("change", updateWidth, false);
    borderWidth.select()

    //borderradius
    borderRadius = document.querySelector("#borderRadius");
    borderRadius.value = await loadBorderRadius();
    borderRadius.addEventListener("change", updateRadius, false);
    borderPadding.select()

    // borderpadding
    borderPadding = document.querySelector("#borderPadding");
    borderPadding.value = await loadBorderPadding();
    borderPadding.addEventListener("change", updatePadding, false);
    borderPadding.select()

    // borderMargin
    borderMargin = document.querySelector("#borderMargin");
    borderMargin.value = await loadBorderMargin();
    borderMargin.addEventListener("change", updateMargin, false);
    borderMargin.select()

    
    await updateCSS();
}

async function updateCSS(){
    //update Css depending on css mode "simple" or "customCss"
    if(await loadMode()){//TODO
        await showTextarea(true)
        customCSS = await loadCustomCSS()
        await updateGeneralCSS(customCSS)
        }
    else{
        await showTextarea(false)
        await updateGeneralCSS(await returnSimpleCSS())
    }
    await updatePreview();
}
})
  
  