import alertBox, { hideAlertBox, showAlertBox } from "./alert.js";
import { saveToLocalStorage } from "./localStorage.js";

const generateRegexBtn = document.getElementById('generate-regex');

const outputRegexField = document.getElementById('output-regex');

const formElements = document.querySelectorAll('.form-element');

const regexNameField = document.getElementById('regex-name');

// Convert the NodeList to an array
const flags = [...document.querySelectorAll('.flag')];

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

    let _first = "";
    let _last = "";

    // Iterate through every formElement and analyse each of them deeply and generate the regex
    formElements.forEach(formElement => {
        // If the formElement's selectedIndex is 0 (Yes), then only analyse it
        if(formElement.querySelector('select').selectedIndex === 0) {
            // 'Starts-With'
            if(formElement.id === "starts-with") {
                let first = `^`;

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
                                        const lastPortion = first.slice(first.indexOf("^") + 1);

                                        first = first.slice(0, first.indexOf("^") + 1) + "A-Z" + lastPortion;
                                    }
                                    // Lowercase
                                    if(checkBox.id.includes("lowercase")) {
                                        const lastPortion = first.slice(first.indexOf("^") + 1);

                                        first = first.slice(0, first.indexOf("^") + 1) + "a-z" + lastPortion;
                                    }
                                    // Numbers
                                    if(checkBox.id.includes("numbers")) {
                                        const lastPortion = first.slice(first.indexOf("^") + 1);

                                        first = first.slice(0, first.indexOf("^") + 1) + "\\d" + lastPortion;
                                    }
                                    // Special Characters
                                    if(checkBox.id.includes("special")) {
                                        const lastPortion = first.slice(first.indexOf("^") + 1);

                                        first = first.slice(0, first.indexOf("^") + 1) + "_\\W" + lastPortion;
                                    }
                                }
                            });
                            
                            // Enclose the character set in square brackets
                            const lastPortion = first.slice(first.indexOf("^") + 1);

                            first = first.slice(0, first.indexOf("^") + 1) + "[" + lastPortion + "]";
                        }

                        // Custom Characters
                        else if(radioBtn.className === "custom-characters") {
                            // Enclose the character set in square brackets
                            const customCharactersField = formElement.querySelector('.custom-characters-field input');
                            
                            first = `^[${customCharactersField.value}]`;
                        }                        

                        // Custom Group
                        else if(radioBtn.className === "custom-group") {
                            // Enclose the character set in square brackets
                            const customGroupsField = formElement.querySelector('.custom-groups-field input');

                            first = `^(${customGroupsField.value})`;
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
                        first += `{${min}}`;
                    }
                }
                else {
                    first += `{${min}, ${max}}`;
                }

                _first = first;
            }
            // 'Ends-With'
            else if(formElement.id === "ends-with") {
                let last = "";

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
                                        last += "A-Z";
                                    }
                                    // Lowercase
                                    if(checkBox.id.includes("lowercase")) {
                                        last += "a-z";
                                    }
                                    // Numbers
                                    if(checkBox.id.includes("numbers")) {
                                        last += "0-9";
                                    }
                                    // Special Characters
                                    if(checkBox.id.includes("special")) {
                                        last += "_\\W";
                                    }

                                    last = last.split("").splice(0, 0, "[").join("");
                                    last += "]";
                                }
                            });
                        }

                        // Custom Characters
                        else if(radioBtn.className === "custom-characters") {
                            const customCharactersField = formElement.querySelector('.custom-characters-field input');
                            
                            last = `[${customCharactersField.value}]`;
                        }

                        // Custom Group
                        else if(radioBtn.className === "custom-group") {
                            const customGroupsField = formElement.querySelector('.custom-groups-field input');
                            
                            last = `(${customGroupsField.value})`;
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
                        last += `{${min}}`;
                    }
                }
                else {
                    last += `{${min}, ${max}}`;
                }

                last += "$";
                _last = last;
            }
        }
    });

    // Add 'forward slashes'
    regex = "/" + _first + _last + "/";

    // Add the flags accordingly
    flags.forEach(flag => {
        if(flag.checked) {
            regex += flag.value;
        }
    });

    displayRegex(regex);
});