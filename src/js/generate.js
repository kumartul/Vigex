import { statements, formElementIDs } from "./utils.js";

const form = document.getElementById('form-group');

const generateFormElements = formElementIDs => {
    formElementIDs.forEach((formElementID, index) => {
        const formElement = document.createElement('div');

        formElement.className = "form-element";
        formElement.id = formElementIDs[index];
        formElement.dataset.expanded = "no";

        form.appendChild(formElement);
    });

    const generateRegexBtn = document.createElement('button');
    
    generateRegexBtn.type = "button";
    generateRegexBtn.id = "generate-regex";
    generateRegexBtn.textContent = "Generate Regex";

    form.appendChild(generateRegexBtn);
}

// Function: Generates the innerHTML of formElements by using their ID
const generateFormElementInnerHTML = formElements => {

    // Iterate through each formElement and populate them based on their IDs
    formElements.forEach((formElement, index) => {
        const id = formElement.id;
        
        formElement.innerHTML = 
        `
        <button type="button" data-expanded="no" id="expand-${id}-confirmation" class="expand-btn">&gt;</button>
        <label for="${id}-confirmation">${statements[index]}</label>
        <select id="${id}-confirmation" class="confirmation">
            <option value="Yes">Yes</option>
            <option value="No" selected>No</option>
        </select>

        <div class="params hidden">

            <div class="character-set">
                <input checked disabled type="radio" name="${id}-confirmation" id="${id}-confirmation-character-set" class="character-set">
                <label for="${id}-confirmation-character-set">Choose character set(s)</label>
            </div>

            <div class="hidden character-sets">

                <div>
                    <input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-uppercase-letters">
                    <label for="${id}-confirmation-character-set-uppercase-letters">Uppercase Letters</label>
                </div>

                <div>
                    <input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-lowercase-letters">
                    <label for="${id}-confirmation-character-set-lowercase-letters">Lowercase Letters</label>
                </div>

                <div>
                    <input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-numbers">
                    <label for="${id}-confirmation-character-set-lowercase-letters">Numbers</label>
                </div>

                <div>
                    <input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-special-characters">
                    <label for="${id}-confirmation-character-set-lowercase-letters">Special Characters</label>
                </div>
            </div>

            <div class="custom-characters">
                <input disabled type="radio" name="${id}-confirmation" id="${id}-confirmation-custom-characters" class="custom-characters">
                <label for="${id}-confirmation-custom-characters">Custom Characters</label>
            </div>

            <div class="hidden custom-characters-field">
                <input disabled type="text" placeholder="Enter your character set">
            </div>

            <div class="hidden quantity">

                <div>
                    <label for="${id}-min-quantity">Minimum number of times this character set must repeat: </label>
                    <input disabled type="number" id="${id}-min-quantity" min="0" value="1">
                </div>

                <div>
                    <label for="${id}-max-quantity">Maximum number of times this character set must repeat: </label>
                    <input disabled type="number" id="${id}-max-quantity" min="1" value="1">
                </div>
            </div>
        </div>
        `;
    });
}

generateFormElements(formElementIDs);

// Convert the NodeList to an array
const formElements = [...document.querySelectorAll('.form-element')];

// This will dynamically populate all the formElements on load
generateFormElementInnerHTML(formElements);