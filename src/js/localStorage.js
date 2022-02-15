import { regexKeyName } from './utils.js';

// Function: Saves the regex in localStorage in the form of an object
export const saveToLocalStorage = (regexName, regex) => {
	// Fetch the item from the localStorage
	let regexArr = localStorage.getItem(regexKeyName);

	// If the regex is not null and not empty, then only parse it else initialize it with an empty array
	if(regexArr !== null && regex !== []) {
		regexArr = JSON.parse(regexArr);
	}
	else {
		regexArr = [];
	}

	regexArr.push({ regexName, regex });

	localStorage.setItem(regexKeyName, JSON.stringify(regexArr));
};
