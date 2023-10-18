if (typeof browser === "undefined") {
    var browser = chrome;
}

var results=[];
var results_a=[];
function updateSearchResults(){
    //get all a withs cites included
    aHasCite =[]
    document.querySelectorAll("a").forEach(a => {if (a.querySelectorAll("cite").length>0 && !results_a.includes(a)){aHasCite.push(a)}})
    aHasCite.forEach(e=>{results_a.push(e)});

    for (let i=0; i<aHasCite.length;i++){
        // for (let i=0; i<6;i++){

        // copy without aHasCite[i] element - worked
        let tmpArr=[aHasCite.length-1]
        let skip =0;
        for (let n=0; n<aHasCite.length;n++){
            if(n==i){
                skip=1
            }
            tmpArr[n]=aHasCite[n+skip]
        }
         
        // //skip i
        let potentialResults = document.querySelector("#center_col")

        let goodResults=[]
        // go through all potential divs
        potentialResults.querySelectorAll("div").forEach(div =>{

            // removed results, where multipile results are in 1 div
            let containsCheck = (duplicate) => div.contains(duplicate)
            if(div.contains(aHasCite[i]) && !tmpArr.some(containsCheck)){
                goodResults.push(div)
            }
        })

        // search for div with maximum size
        let result;
            let max=0;
            goodResults.forEach(el =>{
                let value = el.getBoundingClientRect().height * el.getBoundingClientRect().width
                if(value > max){
                    max=value
                    result=el
                }
            })
            if(result.querySelector("div[data-snc]")==null){
                results.push(result)
            }
            else{ 
                results.push(result.querySelector("div[data-snc]"))
            }
    }
}

function focusTab(){
    let universe = document.querySelectorAll('input, button, select, textarea, a[href]');
    let list = Array.prototype.filter.call(universe, function(item) {return item.tabIndex >= "0"});
    let index = list.indexOf(selectedDiv.querySelector("a"));
    list[index].focus();
}

function selectDiv(div){
    if(selectedDiv != null){
    selectedDiv.classList.remove("activeSelected");
    }   
    selectedDiv = div;
    selectedDiv.classList.add("activeSelected");
}

// if up
function selectPreviousElement(){
    if(savedIndex<1&&savedIndex>0){
        //only remove selected
        selectedDiv.classList.remove("activeSelected");
        selectedDiv = null;
        savedIndex--
    }
    if(savedIndex>=1){
        savedIndex--
        selectDiv(results[savedIndex])
    }
}

//if down
function selectNextElement(){
    //if last element dont respond
    updateSearchResults()
    if(!(savedIndex>=results.length-1)){
        savedIndex++
        selectDiv(results[savedIndex])
    }
}

function updateScrollPosition(){
    if (selectedDiv != null) {
        window.requestAnimationFrame(() => {            

                let padding1 = document.getElementById("appbar").getBoundingClientRect().height + document.getElementById("sfcnt").getBoundingClientRect().bottom;
                let padding2 =0;
                try{
                    padding2=document.getElementById("taw").getBoundingClientRect().height
                }
                catch{}
                
                let allpadding = padding1 +padding2;
                
                let rect = selectedDiv.getBoundingClientRect();
                let scrollY=rect.bottom-allpadding - window.innerHeight/3
                if (scrollY < window.innerHeight/2){scrollY=0}
                window.scrollTo(window.scrollX,scrollY);
            }
        )}
}

async function getCSS(){
    let styleElement = document.createElement("style")
    styleElement.innerText=await browser.storage.local.get("css").then(e=>{return e.css})
    document.head.appendChild(await styleElement)
}



var selectedDiv = null;
let savedIndex = -1;
var css;
let textarea = document.querySelector("textarea")
getCSS()

document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (!((textarea === document.activeElement)||(document.querySelector("input[type='text']") === document.activeElement))){
    switch (key) {
        case "ArrowUp":
            try{
            event.preventDefault();
            selectPreviousElement();
            updateScrollPosition();
            }
            catch{}
            break;
        case "ArrowDown":
            try{
            event.preventDefault();
            selectNextElement();
            updateScrollPosition();
            }
            catch{}
            break;
        case "Tab":
            focusTab()
            break;
        case "Enter":
            event.preventDefault();
            try{
                let span = selectedDiv.querySelector("div > div[role='button']");
                if(span.querySelector("svg")!=null){
                    throw new Exception("no svg");
                }
                span.querySelector("span").setAttribute("tabindex","-1")
            span.click()
            }
            catch{selectedDiv.querySelector("a").click()}
            break;
    }
}
});