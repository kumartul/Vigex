import alertBox, { hideAlertBox, showAlertBox } from "./alert.js";

const generateRegexBtn = document.getElementById('generate-regex');

const outputRegexField = document.getElementById('output-regex');

const formElements = document.querySelectorAll('.form-element');

const globalSearchCheckbox = document.getElementById('global-search-checkbox');

// Function: Displays the regex in the outputRegexField
const displayRegex = regex => {
    outputRegexField.value = regex;
}

// Function: Generates the regular expression
generateRegexBtn.addEventListener('click', () => {    
    let regex = ``;

    formElements.forEach(formElement => {
        if(formElement.querySelector('select').selectedIndex === 0) {
            if(formElement.id === "starts-with") {
                regex = `^`;

                const radioBtns = [...formElement.querySelectorAll('input[type="radio"]')];
    
                radioBtns.forEach(radioBtn => {
                    if(radioBtn.checked) {
                        if(radioBtn.className === "character-set") {
                            const checkBoxes = [...formElement.querySelectorAll('.character-sets input')];

                            checkBoxes.forEach(checkBox => {
                                if(checkBox.checked) {
                                    if(checkBox.id.includes("uppercase")) {
                                        const lastPortion = regex.slice(regex.indexOf("^") + 1);
                                        regex = regex.slice(0, regex.indexOf("^") + 1) + "A-Z" + lastPortion;
                                    }
                                    if(checkBox.id.includes("lowercase")) {
                                        const lastPortion = regex.slice(regex.indexOf("^") + 1);
                                        regex = regex.slice(0, regex.indexOf("^") + 1) + "a-z" + lastPortion;
                                    }
                                    if(checkBox.id.includes("numbers")) {
                                        const lastPortion = regex.slice(regex.indexOf("^") + 1);
                                        regex = regex.slice(0, regex.indexOf("^") + 1) + "0-9" + lastPortion;
                                    }
                                    if(checkBox.id.includes("special")) {
                                        const lastPortion = regex.slice(regex.indexOf("^") + 1);
                                        regex = regex.slice(0, regex.indexOf("^") + 1) + "_\\W" + lastPortion;
                                    }

                                }
                            });
                            
                            const lastPortion = regex.slice(regex.indexOf("^") + 1);
                            regex = regex.slice(0, regex.indexOf("^") + 1) + "[" + lastPortion + "]";
                        }
                        else if(radioBtn.className === "custom-characters") {
                            const customCharactersField = formElement.querySelector('.custom-characters-field input');
                            
                            regex = `^[${customCharactersField.value}]`;
                        }
                    }
                });

                const min = formElement.querySelector('.quantity .min').value;
                const max = formElement.querySelector('.quantity .max').value;

                if(max < min) {
                    showAlertBox(alertBox, "Minimum number of occurrences cannot be greater than maximum number of occurrences");                    
                    return;
                }
                else if(min === max) {
                    const lastPortion = regex.slice(regex.indexOf("]") + 1);
                    regex = regex.slice(0, regex.indexOf("]") + 1) + `{${max}}` + lastPortion;
                }
                else {
                    const lastPortion = regex.slice(regex.indexOf("]") + 1);
                    regex = regex.slice(0, regex.indexOf("]") + 1) + `{${min}, ${max}}` + lastPortion;
                }

            }
            else if(formElement.id === "ends-with") {
                regex += "[]$";

                const radioBtns = [...formElement.querySelectorAll('input[type="radio"]')];

                radioBtns.forEach(radioBtn => {
                    if(radioBtn.checked) {
                        if(radioBtn.className === "character-set") {
                            const checkBoxes = [...formElement.querySelectorAll('.character-sets input')];

                            checkBoxes.forEach(checkBox => {
                                if(checkBox.checked) {
                                    if(checkBox.id.includes("uppercase")) {
                                        const lastPortion = regex.slice(regex.lastIndexOf("[") + 1);
                                        regex = regex.slice(0, regex.lastIndexOf("[") + 1) + "A-Z" + lastPortion;
                                    }
                                    if(checkBox.id.includes("lowercase")) {
                                        const lastPortion = regex.slice(regex.lastIndexOf("[") + 1);
                                        regex = regex.slice(0, regex.lastIndexOf("[") + 1) + "a-z" + lastPortion;
                                    }
                                    if(checkBox.id.includes("numbers")) {
                                        const lastPortion = regex.slice(regex.lastIndexOf("[") + 1);
                                        regex = regex.slice(0, regex.lastIndexOf("[") + 1) + "0-9" + lastPortion;
                                    }
                                    if(checkBox.id.includes("special")) {
                                        const lastPortion = regex.slice(regex.lastIndexOf("[") + 1);
                                        regex = regex.slice(0, regex.lastIndexOf("[") + 1) + "_\\W" + lastPortion;
                                    }
                                }
                            });
                        }
                        else if(radioBtn.className === "custom-characters") {
                            const customCharactersField = formElement.querySelector('.custom-characters-field input');
                            
                            const lastPortion = regex.slice(regex.lastIndexOf("]"));
                            regex = regex.slice(0, regex.lastIndexOf("[") + 1) + `${customCharactersField.value}` + lastPortion;
                        }
                    }
                });

                const min = formElement.querySelector('.quantity .min').value;
                const max = formElement.querySelector('.quantity .max').value;

                if(max < min) {
                    showAlertBox(alertBox, "Minimum number of occurrences cannot be greater than maximum number of occurrences");                    
                    return;
                }
                else if(min === max) {
                    regex = regex.slice(0, regex.indexOf("$")) + `{${min}}` + "$";
                }
                else {
                    regex = regex.slice(0, regex.indexOf("$")) + `{${min}, ${max}}` + "$";
                }

            }
        }
    });

    regex = "/" + regex + "/";

    if(globalSearchCheckbox.checked) {
        regex += "g";
    }

    displayRegex(regex);
});