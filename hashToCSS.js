document.addEventListener("DOMContentLoaded", function() {
    // Function to process hash code and generate CSS
    function hashToCSS(hash) {
        if (!hash) {
            console.log('No hash found');
            return;
        }

        try {
            // Decode the hash and parse JSON
            let decodedHash = JSON.parse(decodeURIComponent(escape(atob(hash))));
            let colors = JSON.parse(decodedHash);

            let cssVariablesLight = '';
            let cssVariablesDark = '';

            for (const [key, value] of Object.entries(colors)) {
                if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(value)) {
                    const [r, g, b] = value.match(/\d+/g).map(Number);
                    const variableName = key.replace(/\s+/g, '-').toLowerCase();

                    for (let i = 11; i >= 1; i--) {
                        const opacity = i / 10;
                        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                        let propertyName;
                        if (i === 11) { 
                            propertyName = `/* ${variableName} color */`;
                        } else if (i === 10) {
                            propertyName = `--${variableName}`;
                        } else {
                            propertyName = `--${variableName}-0t${i}`;
                        }
                        if (i <= 10) {
                            if (propertyName.includes('light')) {
                                propertyName = propertyName.replace('-light', '');
                                cssVariablesLight += `  ${propertyName}: ${rgbaColor};\n`;
                            } else if (propertyName.includes('dark')) {
                                propertyName = propertyName.replace('-dark', '');
                                cssVariablesDark += `  ${propertyName}: ${rgbaColor};\n`;
                            }
                        } else {
                            if (propertyName.includes('light')) {
                                cssVariablesLight += `${propertyName}\n`;
                            } else if (propertyName.includes('dark')) {
                                cssVariablesDark += `${propertyName}\n`;
                            }
                        }
                    }
                } else {
                    console.error(`Invalid color value for ${key}: ${value}`);
                }
            }
            
            // Output the generated CSS custom properties
            console.log(':root.light {\n' + cssVariablesLight + '}');
            console.log(':root.dark {\n' + cssVariablesDark + '}');
            
            // Inject CSS into the head of the document
            const styleTag = document.createElement('style');
            styleTag.innerHTML = `:root.light {\n${cssVariablesLight}}\n:root.dark {\n${cssVariablesDark}}`; // Encapsulate CSS variables inside :root selector
            document.head.appendChild(styleTag);

            // Save hash to local storage
            localStorage.setItem('hash', hash);

            // Hide the form after submitting
            const hashForm = document.getElementById("hashForm");
            hashForm.style.display = "none";
        } catch (error) {}
    }

    // Function to load hash from local storage
    function loadHashFromLocalStorage() {
        return localStorage.getItem('hash');
    }

    // Load hash from local storage
    const cachedHash = loadHashFromLocalStorage();
    if (cachedHash) {
        hashToCSS(cachedHash);
    }

    // Create panel with close button
    const hashPanelHTML = `
        <div class="hash-panel" id="hashPanel">
            <style>
            @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap');

            #hashPanel {
                font-family: 'Lexend', sans-serif !important;
                position: fixed !important;
                bottom: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 70px;
                background: #e07f3e;
                color: white;

                & #hashForm {
                    display: flex;
                    flex-direction: row;
                    margin-right: 10px;
                    height: 100%;
                    justify-content: center;
                    align-items: center;

                    & label {
                        font-size: 70%;
                        margin-bottom: 0;
                    }

                    & button {
                        border: none;
                        background: transparent;
                        font-size: 1.5rem;
                        margin-left: 10px;
                    }
                }

                & a {
                    text-decoration: none;
                    font-size: 140%;
                    color: white;

                    &:hover {
                        color: white;
                    }
                }
            }

            #hashPanel.inactive {
                display: none;
            }
            #closePanel {
                position: absolute;
                right: 0;
                margin: 10px;
                background: none;
                border: none;
                font-size: 1.5em;
                cursor: pointer;
                text-shadow: 0 0 0 white;
                color: transparent;
            }

            input#hashInput {
                background-color: white;
                box-sizing: border-box;
                color: black;
                border-radius: 5px;
                padding: 5px 10px;
                margin: 2px 0px;
                border: 0px;
                width: 30vw;
            }

            button[type="submit"] {
                margin-top: 0px;
            }
            </style>
            <img src="https://pressline.app/favicon.ico" style="position: absolute;left: 0;height: 25px;margin: 10px;">
            <a style="position: absolute;left: 0;margin: 45px;font-size: 100%;" href="https://tools.pressline.app/colors/" target="_blank">PressLine Color Manager</a>
            <span id="closePanel" aria-label="Close">&#10060;</span>
            <div style="flex-direction: row;display: flex;justify-content: center;align-items: center;background: #e07f3e;height: 100%;z-index: 100;padding: 0 10px;">
                <form id="hashForm">
                    <div style="display: flex;flex-direction: column;">
                        <label for="hashInput">Enter Hash Code:</label>
                        <input type="text" id="hashInput" name="hashInput">
                    </div>
                    <button type="submit">✅</button>
                </form>
                <a id="removeFromCache" href="#" title="Remove from Cache" aria-label="Remove from Cache">🗑️</a>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', hashPanelHTML);

    // Close panel function
    const closePanel = function(event) {
        event.preventDefault();
        const hashPanel = document.getElementById("hashPanel");
        hashPanel.classList.remove("active");
        hashPanel.classList.add("inactive");
    };

    // Show panel
    const hashPanel = document.getElementById("hashPanel");
    hashPanel.classList.add("active");

    // Close panel event listener
    const closePanelBtn = document.getElementById("closePanel");
    closePanelBtn.addEventListener("click", closePanel);

    // Form submission handling
    const hashForm = document.getElementById("hashForm");
    hashForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const hashInput = document.getElementById("hashInput").value;
        hashToCSS(hashInput);
    });

    // Remove from cache link event listener
    const removeFromCacheLink = document.getElementById("removeFromCache");
    removeFromCacheLink.addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.removeItem('hash');
        console.log('Hash removed from cache');

        location.reload();
    });
});
