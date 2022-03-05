import './generate.js';
import { confirmationStates } from './utils.js';
import { outputRegexField } from './buildRegex.js';
import { attachEventListenerToExpandBtn } from './generate.js';

const starsOnGitHubBtn = document.getElementById('stars-on-github');
const copyRegexBtn = document.getElementById('copy-btn');
const flagLabels = [...document.querySelectorAll('.flag-label')];
const regexNameField = document.getElementById('regex-name');
const selects = [...document.querySelectorAll('select')];
const navbar = document.querySelector('.navbar');
const footer = document.querySelector('.footer-container');
const wave = document.querySelector('footer svg path');
const productHuntBadge = document.querySelector('.producthunt-featured-badge img');

const moonIcon =
`
<svg viewBox="0 0 24 24" fill="white" style="width: 2rem; height: 2rem;">
	<path fill-rule="evenodd" clip-rule="evenodd" d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"></path>
	<path d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"></path>
	<path fill-rule="evenodd" clip-rule="evenodd" d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"></path>
</svg>
`;

const sunIcon =
`
<svg viewBox="0 0 24 24" fill="white" style="height: 2rem; width: 2rem;" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
	<path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
	<path d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836" stroke="white"></path>
</svg>
`;

const lightDarkModeToggler = document.querySelector('.light-dark-mode-toggler');

// Handles the state of light/dark mode in the application
let isDarkMode = localStorage.getItem('isDarkMode') === 'true';

// Function: Enables dark mode
const enableDarkMode = () => {
	isDarkMode = true;

	localStorage.setItem('isDarkMode', true);

	lightDarkModeToggler.innerHTML = moonIcon;

	document.body.style.backgroundColor = '#1d1d1d';

	outputRegexField.style.color = 'white';

	productHuntBadge.src = 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=334091&theme=dark';

	flagLabels.forEach(flagLabel => {
		flagLabel.style.color = 'white';
	});

	regexNameField.style.color = 'white';

	selects.forEach(select => {
		select.style.backgroundColor = '#1d1d1d';
		select.style.color = 'white';
	});

	const formElements = [...document.querySelectorAll('.form-element')];
	formElements.forEach(formElement => {
		formElement.classList.add('dark');
	});

	navbar.style.background = '#111';

	footer.style.backgroundColor = '#111';

	wave.setAttribute('fill', '#111');
}

// Function: Enables light mode
const enableLightMode = () => {
	isDarkMode = false;

	localStorage.setItem('isDarkMode', false);

	lightDarkModeToggler.innerHTML = sunIcon;

	document.body.style.backgroundColor = 'white';

	outputRegexField.style.color = '#4a4a4a';

	productHuntBadge.src = 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=334091&theme=light';

	flagLabels.forEach(flagLabel => {
		flagLabel.style.color = 'black';
	});

	regexNameField.style.color = '#4a4a4a';

	selects.forEach(select => {
		select.style.backgroundColor = 'white';
		select.style.color = 'black';
	});

	const darkElements = document.querySelectorAll('.dark');
	darkElements.forEach(darkElement => {
		darkElement.classList.remove('dark');
	});

	navbar.style.background = 'linear-gradient(to right, #0082e6, #1b9bff)';

	footer.style.backgroundColor = '#0099ff';

	wave.setAttribute('fill', '#0099ff');
}

if(isDarkMode) {
	lightDarkModeToggler.innerHTML = moonIcon;

	enableDarkMode();
}
else {
	lightDarkModeToggler.innerHTML = sunIcon;

	enableLightMode();
}

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

// Function: Toggles between light mode and dark mode
const lightDarkModeToggle = _isDarkMode => {
	if (_isDarkMode) {
		enableLightMode();
	}
	else {
		enableDarkMode();
	}
}

// Attach a 'click' event listener to the lightDarkModeToggler
lightDarkModeToggler.addEventListener('click', () => {
	lightDarkModeToggle(isDarkMode);
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
