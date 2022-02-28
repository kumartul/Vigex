import { statements, formElementIDs, flags } from './utils.js';

const form = document.getElementById('form-group');

// This select menu will be  generated when as soon as the first formElement gets rendered and a user adds
// a new field
const selectMenu =
`
<div class="character-or-group-select-menu">
    <strong>Add</strong>
    <select class="character-or-group-select">
        <option value = "None" selected>None</option>
        <option value = "Character">Character Set</option>
        <option value = "NegativeCharacter">Negative Character Set</option>
        <option value = "Group">Group</option>
        <option value = "Assertion">Assertion</option>
        <option value = "Or">Or</option>
		<option value = "Any">Any Single Character</option>
    </select>
</div>
`;

// Function: Generates the character set block
const generateCharacterSetTemplate = (id, isEndpointElement) => {
	return `<div class="character-set">
		<input checked ${isEndpointElement ? 'disabled' : ''} type="radio" name="${id}-confirmation" id="${id}-confirmation-character-set" class="character-set">
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
			<input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-non-numeric-characters">
			<label for="${id}-confirmation-character-set-non-numeric-characters">Non-numeric Characters</label>
		</div>

		<div>
			<input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-word-characters">
			<label for="${id}-confirmation-character-set-word-characters">Word Characters</label>
		</div>

		<div>
			<input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-special-characters">
			<label for="${id}-confirmation-character-set-special-characters">Special Characters</label>
		</div>

		<div>
			<input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-whitespace">
			<label for="${id}-confirmation-character-set-whitespace">Whitespace</label>
		</div>

		<div>
			<input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-non-whitespace">
			<label for="${id}-confirmation-character-set-non-whitespace">Non-Whitespace Character</label>
		</div>

		<div>
			<input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-horizontal-tab">
			<label for="${id}-confirmation-character-set-horizontal-tab">Horizontal Tab</label>
		</div>

		<div>
			<input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-vertical-tab">
			<label for="${id}-confirmation-character-set-vertical-tab">Vertical Tab</label>
		</div>

		<div>
			<input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-carriage-return">
			<label for="${id}-confirmation-character-set-carriage-return">Carriage Return</label>
		</div>

		<div>
			<input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-linefeed">
			<label for="${id}-confirmation-character-set-linefeed">Linefeed</label>
		</div>

		<div>
			<input type="checkbox" name="${id}-confirmation-character-set" id="${id}-confirmation-character-set-form-feed">
			<label for="${id}-confirmation-character-set-form-feed">Form Feed</label>
		</div>
	</div>

	<div class="custom-characters">
		<input ${isEndpointElement ? 'disabled' : ''} type="radio" name="${id}-confirmation" id="${id}-confirmation-custom-characters" class="custom-characters">
		<label for="${id}-confirmation-custom-characters">Custom Characters</label>
	</div>

	<div class="hidden custom-characters-field">
		<input disabled type="text" placeholder="Enter your character set">
	</div>
	`;
};

// Function: Generates the quantifier block
const generateQuantifierTemplate = (id, isEndpointElement) => {
	return `<div class="hidden quantity">
                <div>
                    <label for="${id}-min-quantity">Minimum number of times this character set / group must repeat: </label>
                    <input ${isEndpointElement ? 'disabled' : ''} type="number" id="${id}-min-quantity" min="0" value="1" class="min">
                </div>

                <div>
                    <label for="${id}-max-quantity">Maximum number of times this character set / group must repeat (Type -1 if you don't want this field): </label>
                    <input ${isEndpointElement ? 'disabled' : ''} type="number" id="${id}-max-quantity" min="-1" value="1" class="max">
                </div>

				<input type="checkbox" id="${id}-is-non-greedy" class="is-non-greedy">
				<label for="${id}-is-non-greedy">Non-greedy</label>
            </div>`;
};

// Function: Generates form elements dynamically
const generateFormElements = (formElementIDs) => {
	// Iterate through every formElementID and create and append formElements
	formElementIDs.forEach((formElementID, index) => {
		const formElement = document.createElement('div');

		formElement.className = 'form-element';
		formElement.classList.add('endpoint');
		formElement.id = formElementIDs[index];
		formElement.dataset.expanded = 'no';

		form.appendChild(formElement);

		// Render the select menu as soon as the first formElement gets rendered
		if(index === 0) {
			form.innerHTML += selectMenu;
		}
	});

	// Create 'Flag checkboxes'
	flags.forEach((flag) => {
		const element =
        `
		<div class="flag-checkbox">
			<input type = "checkbox" id = "${flag.flag}-flag" value = "${flag.flag}" class="flag">
			<label for = "${flag.flag}-flag" class="flag-label">${flag.text}</label>
		</div>
        `;

		form.innerHTML += element;
	});

	form.innerHTML += '<br>';

	// Create 'Generate Regex' button
	const generateRegexBtn = document.createElement('button');

	generateRegexBtn.type = 'button';
	generateRegexBtn.id = 'generate-regex';
	generateRegexBtn.textContent = 'Generate Regex';

	form.appendChild(generateRegexBtn);
};

// Function: Attaches event listener to the expand button
export const attachEventListenerToExpandBtn = (expandBtn) => {
	// Rotate the expandBtn by 90deg on the z-axis
	expandBtn.addEventListener('click', (event) => {
		// Parent element of expandBtn
		const formElement = event.target.parentElement;

		if (event.target.getAttribute('data-expanded') === 'no') {
			event.target.style.transition = '0.25s';
			event.target.style.transform = 'rotateZ(90deg)';

			// Fetch all the divs in the formElement that are hidden in the form of an array
			const hiddenDivs = [...formElement.querySelectorAll('.hidden')];

			// Iterate through every hiddenDiv and remove the 'hidden' class and add the 'visible' class
			// so that they become visible
			hiddenDivs.forEach((hiddenDiv) => {
				hiddenDiv.classList.remove('hidden');
				hiddenDiv.classList.add('visible');
			});

			event.target.setAttribute('data-expanded', 'yes');
		}
		else if (event.target.getAttribute('data-expanded') === 'yes') {
			event.target.style.transition = '0.25s';
			event.target.style.transform = 'rotateZ(0deg)';

			// Fetch all the divs in the formElement that are hidden in the form of an array
			const hiddenDivs = [...formElement.querySelectorAll('.visible')];

			// Iterate through every hiddenDiv and remove the 'hidden' class and add the 'visible' class
			// so that they become visible
			hiddenDivs.forEach((hiddenDiv) => {
				hiddenDiv.classList.remove('visible');
				hiddenDiv.classList.add('hidden');
			});

			event.target.setAttribute('data-expanded', 'no');
		}
	});
};

// Function: Attaches an event listener to the delete button
const attachEventListenerToDeleteBtn = (deleteBtn) => {
	// Attach a 'click' event listener to the delete button so that whenever someone clicks on it,
	// a confirm popup pops up and handle the process based on user input
	deleteBtn.addEventListener('click', (event) => {
		const confirmation = confirm('Are you sure you want to remove this field?');
		if (confirmation) {
			form.removeChild(event.target.parentElement);
		}
	});
};

// Function: Fetches the second last formElement and returns it
const fetchSecondLastFormElement = () => {
	const formElements = [...document.querySelectorAll('.form-element')];
	const secondLastFormElement = formElements[formElements.length - 2];

	return secondLastFormElement;
};

// Function: Generates the innerHTML of endpointFormElements by using their ID
const generateEndpointFormElementInnerHTML = (formElements) => {
	// Iterate through each formElement and populate them based on their IDs
	formElements.forEach((formElement, index) => {
		const { id } = formElement;

		const randomId = Math.random() * Math.random();

		formElement.innerHTML =
        `
        <button type="button" data-expanded="no" id="expand-${id}-confirmation" class="expand-btn">&gt;</button>
        <label for="${id}-confirmation">${statements[index]}</label>
        <select id="${id}-confirmation" class="confirmation">
            <option value="Yes">Yes</option>
            <option value="No" selected>No</option>
        </select>

        <div class="params hidden">

			${generateCharacterSetTemplate(randomId, true)}

            <div class="custom-groups">
                <input disabled type="radio" name="${randomId}-confirmation" id="${randomId}-confirmation-custom-groups" class="custom-group">
                <label for="${randomId}-confirmation-custom-groups">Custom Group</label>
            </div>

            <div class="hidden custom-groups-field">
                <input disabled type="text" placeholder="Enter your group">
            </div>

			${generateQuantifierTemplate(randomId, true)}
        </div>
        `;
	});
};

generateFormElements(formElementIDs);

// Convert the NodeList to an array
const formElements = [...document.querySelectorAll('.form-element')];

// This will dynamically populate all the formElements on load
generateEndpointFormElementInnerHTML(formElements);

const characterOrGroupOrAssertionSelectMenu = document.querySelector('.character-or-group-select');

characterOrGroupOrAssertionSelectMenu.addEventListener('change', (event) => {
	const optionNumber = event.target.selectedIndex;

	if(optionNumber === 1) {    // Character Sets
		const id = Math.random() * Math.random();

		const secondLastFormElement = fetchSecondLastFormElement();

		secondLastFormElement.insertAdjacentHTML('afterend',
			`
        <div class = "form-element character-set-block midpoint ${Boolean(localStorage.getItem('isDarkMode')) ? 'dark' : ''}" id="${id}">
            <button type="button" data-expanded="no" class="expand-btn">&gt;</button>
            <label>Character Set</label>
            <button type = "button" class = "remove" id="delete-${id}">Remove</button>

            <div class = "params hidden">

				${generateCharacterSetTemplate(id, false)}

                ${generateQuantifierTemplate(id, false)}
            </div>
        </div>
        `);

		const expandBtn = document.getElementById(id);

		attachEventListenerToExpandBtn(expandBtn);

		const deleteBtn = document.getElementById(`delete-${id}`);

		attachEventListenerToDeleteBtn(deleteBtn);

		const radioBtns = document.getElementById(id).querySelectorAll('input[type="radio"]');

		radioBtns.forEach((radioBtn) => {
			radioBtn.addEventListener('click', (event) => {
				const checkboxes = document.getElementById(id).querySelectorAll('.character-sets input[type="checkbox"]');
				const customCharactersField = document.getElementById(id).querySelector('input[type="text"]');

				if(event.target.className === 'character-set') {
					checkboxes.forEach((checkbox) => {
						checkbox.disabled = false;
					});

					customCharactersField.disabled = true;
				}
				else if(event.target.className === 'custom-characters') {
					checkboxes.forEach((checkbox) => {
						checkbox.disabled = true;
					});

					customCharactersField.disabled = false;
				}
			});
		});
	}
	if (optionNumber === 2) {    // Negative Character Sets
		const id = Math.random() * Math.random();

		const secondLastFormElement = fetchSecondLastFormElement();

		secondLastFormElement.insertAdjacentHTML('afterend',
			`
        <div class = "form-element negative-character-set-block midpoint ${Boolean(localStorage.getItem('isDarkMode')) ? 'dark' : ''}" id="${id}">
            <button type="button" data-expanded="no" class="expand-btn">&gt;</button>
            <label>Negative Character Set</label>
            <button type = "button" class = "remove" id="delete-${id}">Remove</button>

            <div class = "params hidden">

				${generateCharacterSetTemplate(id, false)}

                ${generateQuantifierTemplate(id, false)}
            </div>
        </div>
        `);

		const expandBtn = document.getElementById(id);

		attachEventListenerToExpandBtn(expandBtn);

		const deleteBtn = document.getElementById(`delete-${id}`);

		attachEventListenerToDeleteBtn(deleteBtn);

		const radioBtns = document.getElementById(id).querySelectorAll('input[type="radio"]');

		radioBtns.forEach((radioBtn) => {
			radioBtn.addEventListener('click', (event) => {
				const checkboxes = document.getElementById(id).querySelectorAll('.character-sets input[type="checkbox"]');
				const customCharactersField = document.getElementById(id).querySelector('input[type="text"]');

				if (event.target.className === 'character-set') {
					checkboxes.forEach((checkbox) => {
						checkbox.disabled = false;
					});

					customCharactersField.disabled = true;
				}
				else if (event.target.className === 'custom-characters') {
					checkboxes.forEach((checkbox) => {
						checkbox.disabled = true;
					});

					customCharactersField.disabled = false;
				}
			});
		});
	}
	else if(optionNumber === 3) {   // Groups
		const secondLastFormElement = fetchSecondLastFormElement();

		const id = Math.random() * Math.random();

		secondLastFormElement.insertAdjacentHTML('afterend',
			`
        <div class = "form-element group-block midpoint ${Boolean(localStorage.getItem('isDarkMode')) ? 'dark' : ''}" id="${id}">
            <button type="button" data-expanded="no" class="expand-btn">&gt;</button>
            <label>Group</label>
            <button type = "button" class = "remove" id="delete-${id}">Remove</button>

            <div class = "params hidden">
                <div class="custom-groups-field">
                    <input type="text" placeholder="Enter your group">
                </div>

				${generateQuantifierTemplate(id, false)}
            </div>
        </div>
        `);

		const expandBtn = document.getElementById(id);

		attachEventListenerToExpandBtn(expandBtn);

		const deleteBtn = document.getElementById(`delete-${id}`);

		attachEventListenerToDeleteBtn(deleteBtn);
	}
	else if(optionNumber === 4) {   // Assertions
		const secondLastFormElement = fetchSecondLastFormElement();

		const id = Math.random() * Math.random();

		secondLastFormElement.insertAdjacentHTML('afterend',
			`
        <div class = "form-element assertion-block midpoint ${Boolean(localStorage.getItem('isDarkMode')) ? 'dark' : ''}" id="${id}">
            <button type="button" data-expanded="no" class="expand-btn">&gt;</button>
            <label>Assertion</label>
            <button type = "button" class = "remove" id="delete-${id}">Remove</button>

            <div class = "params hidden">
                <input type = "radio" value = "lookahead" name = "assertion" id = "lookahead-assertion-radio-${id}" checked>
                <label for = "lookahead-assertion-radio-${id}">Only if followed by</label>

                <br>

                <input type = "radio" value = "negative_lookahead" name = "assertion" id = "negative-lookahead-assertion-radio-${id}">
                <label for = "negative-lookahead-assertion-radio-${id}">Only if not followed by</label>

                <br>

                <input type = "radio" value = "lookbehind" name = "assertion" id = "lookbehind-assertion-radio-${id}">
                <label for = "lookbehind-assertion-radio-${id}">Only if preceded by</label>

                <br>

                <input type = "radio" value = "negative_lookbehind" name = "assertion" id = "negative-lookbehind-assertion-radio-${id}">
                <label for = "negative-lookbehind-assertion-radio-${id}">Only if not preceded by</label>
            </div>
        </div>
        `);

		const expandBtn = document.getElementById(id);

		attachEventListenerToExpandBtn(expandBtn);

		const deleteBtn = document.getElementById(`delete-${id}`);

		attachEventListenerToDeleteBtn(deleteBtn);
	}
	else if(optionNumber === 5) {	// Or
		const secondLastFormElement = fetchSecondLastFormElement();

		const id = Math.random() * Math.random();

		secondLastFormElement.insertAdjacentHTML('afterend',
			`
        <div class = "form-element or-block midpoint ${Boolean(localStorage.getItem('isDarkMode')) ? 'dark' : ''}" id="${id}">
            <button type="button" data-expanded="no" class="expand-btn">&gt;</button>
            <label>Or</label>
            <button type = "button" class = "remove" id="delete-${id}">Remove</button>
        </div>
        `);

		const deleteBtn = document.getElementById(`delete-${id}`);

		attachEventListenerToDeleteBtn(deleteBtn);
	}
	else if(optionNumber === 6) {	// Any Single Character
		const secondLastFormElement = fetchSecondLastFormElement();

		const id = Math.random() * Math.random();

		secondLastFormElement.insertAdjacentHTML('afterend',
			`
		<div class = "form-element any-single-character-block midpoint ${Boolean(localStorage.getItem('isDarkMode')) ? 'dark' : ''}" id="${id}">
            <button type="button" data-expanded="no" class="expand-btn">&gt;</button>
            <label>Any Single Character</label>
            <button type = "button" class = "remove" id="delete-${id}">Remove</button>
        </div>
		`);

		const deleteBtn = document.getElementById(`delete-${id}`);

		attachEventListenerToDeleteBtn(deleteBtn);
	}

	// Reset the value to 'None'
	event.target.selectedIndex = 0;
});
