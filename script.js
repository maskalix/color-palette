let colorMappingList = {
    'Primary Light': 'rgb(240, 240, 240)',
    'Secondary Light': 'rgb(10, 10, 10)',
    'Terciary Light': 'rgb(128, 128, 128)',
    'Accent Light': 'rgb(129, 171, 244)',
    'Add Light': 'rgb(255, 255, 255)',
    'Add-2 Light': 'rgb(255, 255, 255)',
    'Primary Dark': 'rgb(255, 255, 255)',
    'Secondary Dark': 'rgb(0, 0, 0)',
    'Terciary Dark': 'rgb(128, 128, 128)',
    'Accent Dark': 'rgb(129, 171, 244)',
    'Add Dark': 'rgb(255, 255, 255)',
    'Add-2 Dark': 'rgb(255, 255, 255)'
};

$(document).ready(function() {
    initializeColorPickers();
    generateColorContrastTable();
    createColorBoxes();
    // Delegate the click event to a static parent element
    $('#colorColumnsContainer').on('click', '.base-color', function() {
        // Find the corresponding color picker within the same container
        $colorPicker = $(this).parent().parent().find('.colorPicker').first();
        // Toggle the color picker
        $colorPicker.focus();
        $colorPicker.click();
    });
});

function initializeColorPickers(updatedColorMappingList) {
    $(".colorPicker").each(function() {
        if (updatedColorMappingList) {
            colorMappingList = updatedColorMappingList;
        }
        let $colorPicker = $(this);
        let $colorPickerContainer = $colorPicker.closest('.colorPickerContainer');
        let $transparencyList = $colorPickerContainer.siblings('.transparencyList');
        let colorKey = $colorPicker.data('color');
        let colorColumnName = $colorPickerContainer.parent().find('h3').first().text().trim();
        let defaultColor = colorMappingList[colorKey] || colorMappingList[colorColumnName] || 'rgb(255, 255, 255)'; // Default to white if color not found
        $colorPicker.val(defaultColor);
        $colorPicker.change(function() {
            let baseColor = $colorPicker.val();
            generateTransparencyVariations(baseColor, $colorPickerContainer.siblings('.transparencyList'));
            let currentColors = getTransparencyListColors();
            generateColorContrastTable(currentColors);
            updateColorMapping(colorKey, baseColor);
        });
        generateTransparencyVariations(defaultColor, $transparencyList);
    });
}

function exportColors() {
    let exportText = '{';
    $('.colorColumn').each(function() {
        let lightTitle = $(this).find('.light h3').first().text(); // Retrieve light title dynamically
        let lightColor = $(this).find('.light .transparencyList .base-color span').text();
        let lightX = `"${lightTitle}": "${lightColor}",`;
        exportText += lightX;
    });

    $('.colorColumn').each(function() {
        let darkTitle = $(this).find('.dark h3').first().text(); // Retrieve dark title dynamically
        let darkColor = $(this).find('.dark .transparencyList .base-color span').text();
        let darkX = `"${darkTitle}": "${darkColor}",`;
        exportText += darkX;
    });
    exportText = exportText.slice(0, -1);
    exportText += '}';
    return exportText;
}

function hashExport() {
    let hash = btoa(unescape(encodeURIComponent(JSON.stringify(exportColors()))));
    showAlert("Added hash code in clipboard", 3000);
    navigator.clipboard.writeText(hash);
    console.log(hash); // <<<!!!<<< Log the hash to the console
}

function hashImport() {
    let hash = prompt("Enter the hash:");
    if (hash) {
        try {
            // Decode the hash and parse JSON
            let decodedHash = JSON.parse(decodeURIComponent(escape(atob(hash))));
            // Update colorMappingList with the imported colors
            decodedHash = JSON.parse(decodedHash);
            
            initializeColorPickers(decodedHash);
            generateColorContrastTable();
            showAlert("Colors loaded from hash code", 3000);        
            return decodedHash;   
        } catch (error) {
            showAlert("Invalid hash format", 3000);
        }
    }
}

// Function to update colorMappingList with the new color
function updateColorMapping(colorKey, colorValue) {
    colorMappingList[colorKey] = colorValue;
}

function getTransparencyListColors() {
    let colors = {};
    $(".transparencyList div.base-color").each(function() {
        let colorColumnName = $(this).parent().parent().find('h3').text();
        let style = $(this).attr('style');
        let color = style.substring(style.indexOf("background-color:") + 18, style.indexOf(";"));
        colors[colorColumnName] = color;
    });
    return colors;
}

function generateColorContrastTable(colorMapping = colorMappingList) {
    let contrastLightTable = document.getElementById('contrast-light');
    let contrastDarkTable = document.getElementById('contrast-dark');
    let contrastTableContainer = document.getElementById('contrast-table');

    if (!contrastLightTable) {
        contrastLightTableHeader = document.createElement('h2');
        contrastLightTable = document.createElement('table');
        div = document.createElement('div');
        div.classList.add('contrast-table-column');
        contrastLightTable.setAttribute('id', 'contrast-light'); // Changed ID
        div.appendChild(contrastLightTableHeader);
        div.appendChild(contrastLightTable);
        contrastTableContainer.appendChild(div);
    } else {
        contrastLightTable.innerHTML = ''; // Clear existing table content
    }

    if (!contrastDarkTable) {
        contrastDarkTableHeader = document.createElement('h2');
        contrastDarkTable = document.createElement('table');
        div = document.createElement('div');
        div.classList.add('contrast-table-column');
        contrastDarkTable.setAttribute('id', 'contrast-dark'); // Changed ID
        div.appendChild(contrastDarkTableHeader);
        div.appendChild(contrastDarkTable);
        contrastTableContainer.appendChild(div);
    } else {
        contrastDarkTable.innerHTML = ''; // Clear existing table content
    }

    let tableLightContent = "<thead><tr><th></th>";
    let tableDarkContent = "<thead><tr><th></th>";

    // Create table headers with light color names
    for (let lightColor in colorMapping) {
        if (lightColor.includes('Light')) {
            tableLightContent += `<th>${lightColor.replace(' Light', '')}</th>`;
        }
    }
    tableLightContent += "</tr></thead><tbody>";

    // Iterate over each light color as the row color
    for (let lightColor in colorMapping) {
        if (lightColor.includes('Light')) {
            const rowName = lightColor.replace(' Light', '');
            tableLightContent += `<tr><td>${rowName}</td>`;

            // Iterate over each light color as the column color
            for (let columnLightColor in colorMapping) {
                if (columnLightColor.includes('Light')) {
                    const contrastRatio = parseFloat(parseFloat(calculateContrast(colorMapping[lightColor], colorMapping[columnLightColor])).toFixed(1));
                    const backgroundColor = getBackgroundColor(contrastRatio);
                    tableLightContent += `<td style="background-color: ${backgroundColor}">${contrastRatio}</td>`;
                }
            }
            tableLightContent += "</tr>";
        }
    }
    tableLightContent += "</tbody>";

    // Append content to the light table
    contrastLightTableHeader.innerHTML = "<span class='iconify-inline' data-icon='fluent:ratio-one-to-one-24-filled'></span> Ratio for light mode";
    contrastLightTable.innerHTML = tableLightContent;

    // Create table headers with dark color names
    for (let darkColor in colorMapping) {
        if (darkColor.includes('Dark')) {
            tableDarkContent += `<th>${darkColor.replace(' Dark', '')}</th>`;
        }
    }
    tableDarkContent += "</tr></thead><tbody>";

    // Iterate over each dark color as the row color
    for (let darkColor in colorMapping) {
        if (darkColor.includes('Dark')) {
            const rowName = darkColor.replace(' Dark', '');
            tableDarkContent += `<tr><td>${rowName}</td>`;

            // Iterate over each dark color as the column color
            for (let columnDarkColor in colorMapping) {
                if (columnDarkColor.includes('Dark')) {
                    const contrastRatio = parseFloat(parseFloat(calculateContrast(colorMapping[darkColor], colorMapping[columnDarkColor])).toFixed(1));
                    const backgroundColor = getBackgroundColor(contrastRatio);
                    tableDarkContent += `<td style="background-color: ${backgroundColor}">${contrastRatio}</td>`;
                }
            }
            tableDarkContent += "</tr>";
        }
    }
    tableDarkContent += "</tbody>";

    // Append content to the dark table
    contrastDarkTableHeader.innerHTML = "<span class='iconify-inline' data-icon='fluent:ratio-one-to-one-24-filled'></span> Ratio for dark mode";
    contrastDarkTable.innerHTML = tableDarkContent;
}

const colors = ['#ff5858', '#ff8d54', '#faa148', '#fcc24f', '#fddc5a', '#ffff63', '#a4e762', '#6eed6e', '#45df79', '#48d18d', '#2bc18f'];
// Function to determine background color based on contrast ratio
function getBackgroundColor(contrastRatio) {
    if (contrastRatio <= 1.00) {
        return 'var(--primary-0t3);';
    }
    const index = Math.min(Math.floor(contrastRatio) - 1, colors.length - 1);
    return colors[index];
}

function createColorBoxes() {
    const colorScale = document.getElementById('colorScale');
    q = 1;
    for (let i = 0; i < colors.length; i++) {
        const colorBox = document.createElement('div');
        colorBox.classList.add('color-box');
        colorBox.style.backgroundColor = colors[i];
        if (!(q > 1 && q < 21)) {
            colorBox.textContent = Math.round(q);
        }
        colorScale.appendChild(colorBox);
        q += Math.round(21/11);
    }
}

function calculateContrast(color1, color2) {
    // Function to calculate relative luminance
    const relativeLuminance = (color) => {
        let r;
        let g;
        let b;
        if (color.includes('rgba') || color.includes('rgb')) {
            r = parseInt(color.substring(color.indexOf('(') + 1, color.indexOf(','))) / 255; // Red component
            g = parseInt(color.substring(color.indexOf(',') + 1, color.lastIndexOf(','))) / 255; // Green component
            b = parseInt(color.substring(color.lastIndexOf(',') + 1, color.indexOf(')'))) / 255; // Blue component
        } else if (color.includes('#')) {
            const rgb = color.substring(1); // Remove the '#' from the hex code
            r = parseInt(rgb.substring(0,2), 16) / 255; // Red component
            g = parseInt(rgb.substring(2,4), 16) / 255; // Green component
            b = parseInt(rgb.substring(4,6), 16) / 255; // Blue component
        }
        const gammaCorrection = (c) => {
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };

        const rLinear = gammaCorrection(r);
        const gLinear = gammaCorrection(g);
        const bLinear = gammaCorrection(b);

        return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear; // Standard luminance calculation
    };

    // Calculate relative luminance for both colors
    const luminance1 = relativeLuminance(color1);
    const luminance2 = relativeLuminance(color2);

    // Calculate contrast ratio
    const contrastRatio = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);

    // Return contrast ratio
    return contrastRatio.toFixed(2); // Return with 2 decimal places
}

// Function to generate transparency variations
function generateTransparencyVariations(selectedColor, transparencyList) {
    // Clear existing transparency variations
    transparencyList.empty();
    let $baseColor = $("<div class='base-color'></div>");
    let colorObject = tinycolor(selectedColor); // Convert the hexadecimal color string to a tinycolor object
    let rgbaColor = colorObject.toRgbString();
    let $copyButton = transparencyList.parent().find('p');
    $copyButton.attr('onclick', 'copy(\"' + rgbaColor + '\")');
    $baseColor.css("background-color", rgbaColor);
    $baseColor.append('<span>' + rgbaColor + '</span>');
    transparencyList.append($baseColor);
    // Generate and display transparency variations
    for (let i = 100; i >= 10; i -= 10) {
        let transparentColor = colorObject.setAlpha(i / 100).toRgbString();
        let $transparencyItem = $("<div class='variations-color'></div>");
        $transparencyItem.css("background-color", transparentColor);
        $transparencyItem.append('<span>' + i + '</span>');
        transparencyList.append($transparencyItem);
    }    
}

function copy(toCopy) {
    var textarea = document.createElement('textarea');
    textarea.value = toCopy;
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showAlert('Copied to clipboard', 3000);
}
// CSS Export
// Function to export color variations to CSS
function exportColorVariations() {
    let exportText = '';
    const mainComment = '/*\nExported using PressLine Color Palette Generator\n----------------------------------------------\nPressLine Color Palette\nhttps://tools.pressline.app/colors/\n----------------------------------------------\nComment:\n- only light is set because we ofc want to handle the colors ourselves\n- https://github.com/maskalix\n*/\n';
    exportText += mainComment;
    exportText += `\n:root {\n\tcolor-scheme: only light;\n}\n`;
   
    // Light mode    
    const lightModeHeader = `\n/*\n⚪ Light Mode\nComment:\n*/\n`;
    const darkModeHeader = `\n/*\n⚫ Dark Mode\nComment:\n*/\n`;
    exportText += lightModeHeader + "\n:root.light {\n";
    $(".colorColumn").each(function() {
        let lightMode = $(this).find('.light');
        let columnName = $(this).find('h2').first().text().trim();
        let $list = lightMode.find('.transparencyList');
        
        exportText += "\n\t/* " + capitalizeFirstLetter(columnName) + " */\n";
        exportText += exportColorVariationsForColumn(columnName, $list);
    });
    exportText += "}";
    
    // Dark mode
    exportText += darkModeHeader + "\n:root.dark {\n";
    $(".colorColumn").each(function() {
        let darkMode = $(this).find('.dark');
        let columnName = $(this).find('h2').first().text().trim();
        let $list = darkMode.find('.transparencyList');
        exportText += "\n\t/* " + capitalizeFirstLetter(columnName) + " */\n";
        exportText += exportColorVariationsForColumn(columnName, $list);
    });
    exportText += "}";
    let hash = btoa(unescape(encodeURIComponent(JSON.stringify(exportColors()))));
    exportText += "\n/* HASH CODE FOR EDITOR >> " + hash + "\n<< END*/";

    // Display the exported text in textarea
    $('#exportedColorVariations').val(exportText + '\n\n');
}


// Function to export color variations for a specific column
function exportColorVariationsForColumn(columnName, $transparencyList) {
    let exportText = '';
    $transparencyList.find('.variations-color').each(function() {
        let transparencyLevel = $(this).find('span').text();
        let rgbCode = $(this).css('background-color');
        if (parseInt(transparencyLevel) !== 100) {
            let formattedTransparencyLevel = transparencyLevel.padStart(2, '0').replace(/^(\d)(\d)$/, "$2t$1"); // Formatting
            exportText += '\t--' + columnName.toLowerCase() + '-' + formattedTransparencyLevel + ': ' + rgbCode + ';\n';
        } else {
            exportText += '\t--' + columnName.toLowerCase() + ': ' + rgbCode + ';\n';
        }
    });
    return exportText;
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showAlert(content, duration) {
    var alertBox = document.createElement('div');
    alertBox.classList.add('alert');
    alertBox.textContent = content;
    document.body.appendChild(alertBox);

    setTimeout(function() {
      alertBox.classList.add('hide');
      setTimeout(function() {
        document.body.removeChild(alertBox);
      }, 600); // After hiding, remove the alert from the DOM
    }, duration);
}

function hashToCSSInput() {
    let hash = $('#colorInput').val();
    $('#exportedColorVariations').val(hashToCSS(hash));
}

function hashToCSS(hash) {
    if (!hash) {
        showAlert('No hash found', 3000);
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
        
        return `:root.light {\n${cssVariablesLight}}\n:root.dark {\n${cssVariablesDark}}`; 
    } catch (error) {}
}