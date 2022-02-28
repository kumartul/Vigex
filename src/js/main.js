import './generate.js';
import { confirmationStates } from './utils.js';
import { outputRegexField } from './buildRegex.js';
import { attachEventListenerToExpandBtn } from './generate.js';

const starsOnGitHubBtn = document.getElementById('stars-on-github');
const copyRegexBtn = document.getElementById('copy-btn');

// Convert the NodeList to an array
const expandBtns = [...document.querySelectorAll('.expand-btn')];

// Convert the NodeList to an array
const confirmationMenus = [...document.querySelectorAll('select.confirmation')];

// Conver the NodeList to an array
const radioBtns = [...document.querySelectorAll('input[type="radio"]')];

// Asynchronous Function: Fetches the number of star gazers of Vigex
const fetchNumberOfStarGazers = async () => {
	const API_URL = 'https://api.github.com/users/kumartul/repos';

	const starGazersSpan = document.getElementById('number-of-star-gazers');

	// Fetch the response from the API and then convert it to JSON
	const response = await fetch(API_URL);
	const responseData = await response.json();

	// Iterate through every object and if the object's name property is 'Vigex', then change the textContent
	// of the starGazersSpan to the actual number of star gazers
	responseData.forEach((responseDatum) => {
		if(responseDatum.name === 'Vigex') {
			starGazersSpan.textContent = responseDatum.stargazers_count;
		}
	});
};

// Attach a 'click' event listener to the starsOnGitHubBtn so that whenever someone clicks on the button,
// he/she will be redirected to the repository on GitHub
starsOnGitHubBtn.addEventListener('click', () => {
	window.location.href = 'https://github.com/kumartul/Vigex';
});

// Attach a 'click' event listener to the copyRegexBtn so that whenever someone
// clicks on the button, the regular expression gets copied to the clipboard
copyRegexBtn.addEventListener('click', async () => {
	await navigator.clipboard.writeText(outputRegexField.value);

	// Change the styling of the button to indicate that the regular expression
	// has been copied
	copyRegexBtn.innerText = 'Copied!';
	copyRegexBtn.style.backgroundColor = '#0082e6';
	copyRegexBtn.style.color = 'white';

	// Reset the styling after 1.5 seconds
	setTimeout(() => {
		copyRegexBtn.innerText = 'Copy Regex';
		copyRegexBtn.style.backgroundColor = 'transparent';
		copyRegexBtn.style.color = '#0082e6';

		copyRegexBtn.addEventListener('mouseover', () => {
			copyRegexBtn.style.backgroundColor = '#0082e6';
			copyRegexBtn.style.color = 'white';
			copyRegexBtn.style.transition = '0.3s';
		});

		copyRegexBtn.addEventListener('mouseout', () => {
			copyRegexBtn.style.backgroundColor = 'transparent';
			copyRegexBtn.style.color = '#0082e6';
			copyRegexBtn.style.transition = '0.3s';
		});
	}, 1500);
});

// Iterate through every confirmationMenu and add a 'click' event listener to each confirmationMenu
confirmationMenus.forEach((confirmationMenu) => {
	confirmationMenu.addEventListener('change', (event) => {
		// Parent of the current select menu
		const formElement = event.target.parentElement;

		// CurrentState: Yes | No
		const currentState = confirmationStates[event.target.selectedIndex];

		if(currentState === 'Yes') {
			// Fetch all the divs in the formElement that are hidden in the form of an array
			const hiddenDivs = [...formElement.querySelectorAll('.hidden')];

			// Iterate through every hiddenDiv and remove the 'hidden' class and add the 'visible' class
			// so that they become visible
			hiddenDivs.forEach((hiddenDiv) => {
				hiddenDiv.classList.remove('hidden');
				hiddenDiv.classList.add('visible');
			});

			// Fetch all the input fields in the form of an array
			const inputFields = [...formElement.querySelectorAll('input[type="radio"]'), ...formElement.querySelectorAll('.quantity input')];

			inputFields.forEach((inputField) => {
				inputField.disabled = false;
			});

			// Get the expandBtn of the formElement
			const expandBtn = formElement.querySelector('.expand-btn');

			// Rotate the expandBtn
			expandBtn.style.transition = '0.25s';
			expandBtn.style.transform = 'rotateZ(90deg)';
		}
		else if(currentState === 'No') {
			// Fetch all the divs in the formElement that are visible in the form of an array
			const hiddenDivs = [...formElement.querySelectorAll('.visible')];

			// Iterate through every hiddenDiv and remove the 'visible' class and add the 'hidden' class
			// so that they become visible
			hiddenDivs.forEach((hiddenDiv) => {
				hiddenDiv.classList.remove('visible');
				hiddenDiv.classList.add('hidden');
			});

			// Fetch all the input fields in the form of an array
			const inputFields = [...formElement.querySelectorAll('input')];

			inputFields.forEach((inputField) => {
				inputField.disabled = true;
			});

			// Get the expandBtn of the formElement
			const expandBtn = formElement.querySelector('.expand-btn');

			// Rotate the expandBtn
			expandBtn.style.transition = '0.25s';
			expandBtn.style.transform = 'rotateZ(0deg)';
		}
	});
});

// Iterate through every expandBtn and attach a 'click' event listener to each of them
expandBtns.forEach((expandBtn) => {
	attachEventListenerToExpandBtn(expandBtn);
});

// Iterate through every radio button and add a 'click' event listener to each of them
radioBtns.forEach((radioBtn) => {
	radioBtn.addEventListener('click', (event) => {
		const formElement = event.target.parentElement.parentElement;

		let inputFieldsToBeActivated = undefined;

		if(event.target.className === 'character-set') {
			// Convert the NodeList of 'HTMLInputElement' to an array
			inputFieldsToBeActivated = [...formElement.querySelectorAll('.character-sets input')];
		}
		else if(event.target.className === 'custom-characters') {
			// Convert the NodeList of 'HTMLInputElement' to an array
			inputFieldsToBeActivated = [...formElement.querySelectorAll('.custom-characters-field input')];
		}
		else if(event.target.className === 'custom-group') {
			// Convert the NodeList of 'HTMLInputElement' to an array
			inputFieldsToBeActivated = [...formElement.querySelectorAll('.custom-groups-field input')];
		}

		// First, deactivate all the fields
		const inputFieldsToBeDeactived =  [...formElement.querySelectorAll('input[type="radio"] input')];

		// Iterate through every inputField and disable it
		inputFieldsToBeDeactived.forEach((inputFieldToBeDeactived) => {
			inputFieldToBeDeactived.disabled = true;
		});

		// Iterate through every inputField and enable it
		inputFieldsToBeActivated.forEach((inputFieldToBeActivated) => {
			inputFieldToBeActivated.disabled = false;
		});
	});
});

fetchNumberOfStarGazers();
