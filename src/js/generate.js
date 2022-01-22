import { statements, formElementIDs } from "./utils.js";

const form = document.getElementById('form-group');

// This select menu will be  generated when as soon as the first formElement gets rendered and a user adds
// a new field
const selectMenu = 
`
<div class="character-or-group-select-menu">
    <strong>Add</strong>
    <select>
        <option value = "None" selected>None</option>
        <option value = "Character">Character Set</option>
        <option value = "Group">Group</option>
    </select>
</div>
`;

// Function: Generates form elements dynamically
const generateFormElements = formElementIDs => {
    // Iterate through every formElementID and create and append formElements
    formElementIDs.forEach((formElementID, index) => {
        const formElement = document.createElement('div');
        
        formElement.className = "form-element";
        formElement.classList.add("endpoint");
        formElement.id = formElementIDs[index];
        formElement.dataset.expanded = "no";

        form.appendChild(formElement);

        // Render the select menu as soon as the first formElement gets rendered
        if(index === 0) {
            form.innerHTML += selectMenu;
        }
    });

    // Create 'Global Search' checkbox
    const globalCheckbox = document.createElement('input');
    globalCheckbox.type = "checkbox";
    globalCheckbox.value = "Global";
    globalCheckbox.id = "global-search-checkbox";

    const globalLabel = document.createElement("label");
    globalLabel.textContent = "Global Search";
    globalLabel.setAttribute("for", "global-search-checkbox");

    form.appendChild(globalCheckbox);
    form.appendChild(globalLabel);
    
    form.innerHTML += "<br>";

    // Create 'Generate Regex' button
    const generateRegexBtn = document.createElement('button');
    
    generateRegexBtn.type = "button";
    generateRegexBtn.id = "generate-regex";
    generateRegexBtn.textContent = "Generate Regex";

    form.appendChild(generateRegexBtn);
}

// Function: Generates the innerHTML of endpointFormElements by using their ID
const generateEndpointFormElementInnerHTML = formElements => {
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
                    <label for="${id}-confirmation-character-set-numbers">Numbers</label>
                </div>

                <div>
                    <input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-special-characters">
                    <label for="${id}-confirmation-character-set-special-characters">Special Characters</label>
                </div>
            </div>

            <div class="custom-characters">
                <input disabled type="radio" name="${id}-confirmation" id="${id}-confirmation-custom-characters" class="custom-characters">
                <label for="${id}-confirmation-custom-characters">Custom Characters</label>
            </div>

            <div class="hidden custom-characters-field">
                <input disabled type="text" placeholder="Enter your character set">
            </div>

            <div class="custom-groups">
                <input disabled type="radio" name="${id}-confirmation" id="${id}-confirmation-custom-groups" class="custom-group">
                <label for="${id}-confirmation-custom-groups">Custom Groups</label>
            </div>

            <div class="hidden custom-groups-field">
                <input disabled type="text" placeholder="Enter your group">
            </div>

            <div class="hidden quantity">

                <div>
                    <label for="${id}-min-quantity">Minimum number of times this character set must repeat: </label>
                    <input disabled type="number" id="${id}-min-quantity" min="0" value="1" class="min">
                </div>

                <div>
                    <label for="${id}-max-quantity">Maximum number of times this character set must repeat: </label>
                    <input disabled type="number" id="${id}-max-quantity" min="1" value="1" class="max">
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
generateEndpointFormElementInnerHTML(formElements);