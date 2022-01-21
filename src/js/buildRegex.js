const generateRegexBtn = document.getElementById('generate-regex');

const formElements = document.querySelectorAll('.form-element');

// Function: Generates the regular expression
generateRegexBtn.addEventListener('click', () => {    
    generateRegexBtn.textContent = "Generating...";
    
    generateRegexBtn.disabled = true;

    // Change the style
    generateRegexBtn.style.backgroundColor = "#1b9bff";
    generateRegexBtn.style.color = "white";
    generateRegexBtn.style.cursor = "not-allowed";

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
            }
        }
    });

    regex = "/" + regex + "/";
    console.log(regex);
});