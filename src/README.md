# File Structure
#### manifestv*.json
- manifest files for the extension
- if loading extension unpacked rename one of them to manifest.json
#### main.js
- content script, that is injected into various search pages\
- handles navigation through given results
#### popup.js
- script for popup.html
- setups inputs for interacting with localStorage
#### storage.js
- script for main.js and popup.js
- has functions for interacting with localstorage and defaults

#### ./codemirror/
- files for code editor in custom mode

#### ./modules/
- files providing functions for specific search engines