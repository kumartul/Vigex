import alertBox, { hideAlertBox, showAlertBox } from "./alert.js";
import { saveToLocalStorage } from "./localStorage.js";

const generateRegexBtn = document.getElementById('generate-regex');

const outputRegexField = document.getElementById('output-regex');

const formElements = document.querySelectorAll('.form-element');

const globalSearchCheckbox = document.getElementById('global-search-checkbox');

const regexNameField = document.getElementById('regex-name');

// Function: Displays the regex in the outputRegexField
const displayRegex = regex => {
    if(regexNameField.value) {
        outputRegexField.value = regex;

        saveToLocalStorage(regexNameField.value, regex);
    }
    else {
        showAlertBox(alertBox, "Please give a name to your regular expression");
    }
}

// Function: Generates the regular expression
generateRegexBtn.addEventListener('click', () => {    
    let regex = ``;

    // Iterate through every formElement and analyse each of them deeply and generate the regex
    formElements.forEach(formElement => {

        // If the formElement's selectedIndex is 0 (Yes), then only analyse it
        if(formElement.querySelector('select').selectedIndex === 0) {

            // 'Starts-With'
            if(formElement.id === "starts-with") {
                regex = `^`;

                // Fetch all the radio buttons in the current formElement in the form of an array
                const radioBtns = [...formElement.querySelectorAll('input[type="radio"]')];
                
                // Iterate through every radio button and analyse each radio button to generate the regex
                radioBtns.forEach(radioBtn => {

                    // If the radio button is checked, then only analyse it
                    if(radioBtn.checked) {
                        if(radioBtn.className === "character-set") {

                            // Fetch all the checkboxes in the form of an array
                            const checkBoxes = [...formElement.querySelectorAll('.character-sets input')];

                            // Iterate through every checkBox and generate the regex accordingly
                            checkBoxes.forEach(checkBox => {

                                // Analyse the checkbox only if it's checked
                                if(checkBox.checked) {

                                    // Uppercase
                                    if(checkBox.id.includes("uppercase")) {
                                        const lastPortion = regex.slice(regex.indexOf("^") + 1);

                                        regex = regex.slice(0, regex.indexOf("^") + 1) + "A-Z" + lastPortion;
                                    }

                                    // Lowercase
                                    if(checkBox.id.includes("lowercase")) {
                                        const lastPortion = regex.slice(regex.indexOf("^") + 1);

                                        regex = regex.slice(0, regex.indexOf("^") + 1) + "a-z" + lastPortion;
                                    }

                                    // Numbers
                                    if(checkBox.id.includes("numbers")) {
                                        const lastPortion = regex.slice(regex.indexOf("^") + 1);

                                        regex = regex.slice(0, regex.indexOf("^") + 1) + "0-9" + lastPortion;
                                    }

                                    // Special Characters
                                    if(checkBox.id.includes("special")) {
                                        const lastPortion = regex.slice(regex.indexOf("^") + 1);

                                        regex = regex.slice(0, regex.indexOf("^") + 1) + "_\\W" + lastPortion;
                                    }

                                }
                            });
                            
                            // Enclose the character set in square brackets
                            const lastPortion = regex.slice(regex.indexOf("^") + 1);

                            regex = regex.slice(0, regex.indexOf("^") + 1) + "[" + lastPortion + "]";
                        }

                        // Custom Characters
                        else if(radioBtn.className === "custom-characters") {

                            // Enclose the character set in square brackets
                            const customCharactersField = formElement.querySelector('.custom-characters-field input');
                            
                            regex = `^[${customCharactersField.value}]`;
                        }
                    }
                });

                // Fetch the 'minimum' and 'maximum' quantity
                const min = formElement.querySelector('.quantity .min').value;
                const max = formElement.querySelector('.quantity .max').value;

                // If 'maximum' is more than 'minimum', then show an alert
                if(max < min) {
                    showAlertBox(alertBox, "Minimum number of occurrences cannot be greater than maximum number of occurrences");                    

                    return;
                }
                // If 'minimum' is equal to 'maximum', then omit any one of the fields
                else if(min === max) {

                    // If 'minimum' and 'maximum' is equal to 1, then omit both of them
                    if(Number(min) !== 1) {
                        const lastPortion = regex.slice(regex.indexOf("]") + 1);

                        regex = regex.slice(0, regex.indexOf("]") + 1) + `{${max}}` + lastPortion;
                    }
                }
                else {
                    const lastPortion = regex.slice(regex.indexOf("]") + 1);

                    regex = regex.slice(0, regex.indexOf("]") + 1) + `{${min}, ${max}}` + lastPortion;
                }

            }
            // 'Ends-With'
            else if(formElement.id === "ends-with") {
                regex += "[]$";

                // Fetch all the radio buttons in the form of an array
                const radioBtns = [...formElement.querySelectorAll('input[type="radio"]')];

                // Iterate through every radio button and analyse them to build the regex
                radioBtns.forEach(radioBtn => {

                    // Analyse the radio button only if it's checked
                    if(radioBtn.checked) {
                        if(radioBtn.className === "character-set") {

                            // Fetch all the checkboxes in the form of an array
                            const checkBoxes = [...formElement.querySelectorAll('.character-sets input')];

                            // Iterate through every checkbox and analyse them to build the regex
                            checkBoxes.forEach(checkBox => {

                                // Analyse the checkbox only if it's checked
                                if(checkBox.checked) {

                                    // Uppercase
                                    if(checkBox.id.includes("uppercase")) {
                                        const lastPortion = regex.slice(regex.lastIndexOf("[") + 1);

                                        regex = regex.slice(0, regex.lastIndexOf("[") + 1) + "A-Z" + lastPortion;
                                    }
                                    
                                    // Lowercase
                                    if(checkBox.id.includes("lowercase")) {
                                        const lastPortion = regex.slice(regex.lastIndexOf("[") + 1);

                                        regex = regex.slice(0, regex.lastIndexOf("[") + 1) + "a-z" + lastPortion;
                                    }
                                    
                                    // Numbers
                                    if(checkBox.id.includes("numbers")) {
                                        const lastPortion = regex.slice(regex.lastIndexOf("[") + 1);

                                        regex = regex.slice(0, regex.lastIndexOf("[") + 1) + "0-9" + lastPortion;
                                    }

                                    // Special Characters
                                    if(checkBox.id.includes("special")) {
                                        const lastPortion = regex.slice(regex.lastIndexOf("[") + 1);

                                        regex = regex.slice(0, regex.lastIndexOf("[") + 1) + "_\\W" + lastPortion;
                                    }
                                }
                            });
                        }

                        // Custom Characters
                        else if(radioBtn.className === "custom-characters") {
                            const customCharactersField = formElement.querySelector('.custom-characters-field input');
                            
                            // Enclose the custom charcacter set in square brackets
                            const lastPortion = regex.slice(regex.lastIndexOf("]"));
                        
                            regex = regex.slice(0, regex.lastIndexOf("[") + 1) + `${customCharactersField.value}` + lastPortion;
                        }
                    }
                });

                // Fetch the 'minimum' and 'maximum' quantity
                const min = formElement.querySelector('.quantity .min').value;
                const max = formElement.querySelector('.quantity .max').value;

                // If the 'maximum' is less than 'minimum', then show an alert
                if(max < min) {
                    showAlertBox(alertBox, "Minimum number of occurrences cannot be greater than maximum number of occurrences");                    

                    return;
                }
                // If 'minimum' is equal to 'maximum', then omit any one of the fields
                else if(min === max) {
                    
                    // If 'maximum' and 'minimum' are equal to 1, then omit both the fields
                    if(Number(min) !== 1) {
                        regex = regex.slice(0, regex.indexOf("$")) + `{${min}}` + "$";
                    }
                }
                else {
                    regex = regex.slice(0, regex.indexOf("$")) + `{${min}, ${max}}` + "$";
                }

            }
        }
    });

    // Add 'forward slashes'
    regex = "/" + regex + "/";

    // If the global search checkbox is checked, then add a 'g' flag at the end
    if(globalSearchCheckbox.checked) {
        regex += "g";
    }

    displayRegex(regex);
});