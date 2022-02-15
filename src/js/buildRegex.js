import alertBox, { showAlertBox } from './alert.js';
import { saveToLocalStorage } from './localStorage.js';

const generateRegexBtn = document.getElementById('generate-regex');

const outputRegexField = document.getElementById('output-regex');

const formElements = document.querySelectorAll('.form-element');

const regexNameField = document.getElementById('regex-name');

// Convert the NodeList to an array
const flags = [...document.querySelectorAll('.flag')];

// Function: Displays the regex in the outputRegexField
const displayRegex = (regex) => {
	if(regexNameField.value) {
		outputRegexField.value = regex;

		saveToLocalStorage(regexNameField.value, regex);
	}
	else {
		showAlertBox(alertBox, 'Please give a name to your regular expression');
	}
};

// Function: Generates the regular expression
generateRegexBtn.addEventListener('click', () => {
	let regex = '';

	let _first = '';
	let _last = '';

	const assertionInfo = { 'isLookahead': false,
		'isNegativeLookahead': false };

	// Iterate through every formElement and analyse each of them deeply and generate the regex
	formElements.forEach((formElement) => {
		// If the formElement's selectedIndex is 0 (Yes), then only analyse it
		if(formElement.querySelector('select').selectedIndex === 0) {
			// 'Starts-With'
			if(formElement.id === 'starts-with') {
				let first = '';

				// Fetch all the radio buttons in the current formElement in the form of an array
				const radioBtns = [...formElement.querySelectorAll('input[type="radio"]')];

				// Iterate through every radio button and analyse each radio button to generate the regex
				radioBtns.forEach((radioBtn) => {
					// If the radio button is checked, then only analyse it
					if(radioBtn.checked) {
						if(radioBtn.className === 'character-set') {
							// Fetch all the checkboxes in the form of an array
							const checkBoxes = [...formElement.querySelectorAll('.character-sets input')];

							// Iterate through every checkBox and generate the regex accordingly
							checkBoxes.forEach((checkBox) => {
								// Analyse the checkbox only if it's checked
								if(checkBox.checked) {
									// Uppercase
									if(checkBox.id.includes('uppercase')) {
										first += 'A-Z';
									}
									// Lowercase
									if(checkBox.id.includes('lowercase')) {
										first += 'a-z';
									}
									// Numbers
									if(checkBox.id.includes('numbers')) {
										first += '\\d';
									}
									// Special Characters
									if(checkBox.id.includes('special')) {
										first += '_\\W';
									}
									// Whitespace
									if(checkBox.id.includes('whitespace')) {
										first += '\\s';
									}
									// Horizontal Tab
									if(checkBox.id.includes('horizontal')) {
										first += '\\t';
									}
									// Vertical Tab
									if(checkBox.id.includes('vertical')) {
										first += '\\v';
									}
									// Carriage Return
									if(checkBox.id.includes('carriage')) {
										first += '\\r';
									}
									// Linefeed
									if(checkBox.id.includes('linefeed')) {
										first += '\\n';
									}
									// Form Feed
									if(checkBox.id.includes('form')) {
										first += '\\f';
									}
								}
							});

							// Enclose the expression in square brackets
							first = first.split('');
							first.unshift('^', '[');
							first = first.join('');
							first += ']';
						}

						// Custom Characters
						else if(radioBtn.className === 'custom-characters') {
							// Enclose the character set in square brackets
							const customCharactersField = formElement.querySelector('.custom-characters-field input');

							first = `^[${customCharactersField.value}]`;
						}

						// Custom Group
						else if(radioBtn.className === 'custom-group') {
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
				if(Number(max) < Number(min)) {
					showAlertBox(alertBox, 'Minimum number of occurrences cannot be greater than maximum number of occurrences');

					return;
				}
				// If 'minimum' is equal to 'maximum', then omit any one of the fields
				else if(min === max) {
					// If 'minimum' and 'maximum' is equal to 1, then omit both of them
					if(Number(min) !== 1) {
						first += `{${min}}`;
					}
				}
				else if(Number(min) === 0 && Number(max) === 1) {
					first += '?';
				}
				else {
					first += `{${min},${max}}`;
				}

				_first = first;
			}

			// 'Ends-With'
			else if(formElement.id === 'ends-with') {
				let last = '';

				// Fetch all the radio buttons in the form of an array
				const radioBtns = [...formElement.querySelectorAll('input[type="radio"]')];

				// Iterate through every radio button and analyse them to build the regex
				radioBtns.forEach((radioBtn) => {
					// Analyse the radio button only if it's checked
					if(radioBtn.checked) {
						if(radioBtn.className === 'character-set') {
							// Fetch all the checkboxes in the form of an array
							const checkBoxes = [...formElement.querySelectorAll('.character-sets input')];

							// Iterate through every checkbox and analyse them to build the regex
							checkBoxes.forEach((checkBox) => {
								// Analyse the checkbox only if it's checked
								if(checkBox.checked) {
									// Uppercase
									if(checkBox.id.includes('uppercase')) {
										last += 'A-Z';
									}
									// Lowercase
									if(checkBox.id.includes('lowercase')) {
										last += 'a-z';
									}
									// Numbers
									if(checkBox.id.includes('numbers')) {
										last += '\\d';
									}
									// Special Characters
									if(checkBox.id.includes('special')) {
										last += '_\\W';
									}
									// Whitespace
									if(checkBox.id.includes('whitespace')) {
										last += '\\s';
									}
									// Horizontal Tab
									if(checkBox.id.includes('horizontal')) {
										last += '\\t';
									}
									// Vertical Tab
									if(checkBox.id.includes('vertical')) {
										last += '\\v';
									}
									// Carriage Return
									if(checkBox.id.includes('carriage')) {
										last += '\\r';
									}
									// Linefeed
									if(checkBox.id.includes('linefeed')) {
										last += '\\n';
									}
									// Form Feed
									if(checkBox.id.includes('form')) {
										last += '\\f';
									}
								}
							});

							// Enclose the expression in square brackets
							last = last.split('');
							last.unshift('[');
							last = last.join('');
							last += ']';
						}

						// Custom Characters
						else if(radioBtn.className === 'custom-characters') {
							const customCharactersField = formElement.querySelector('.custom-characters-field input');

							last = `[${customCharactersField.value}]`;
						}

						// Custom Group
						else if(radioBtn.className === 'custom-group') {
							const customGroupsField = formElement.querySelector('.custom-groups-field input');

							last = `(${customGroupsField.value})`;
						}
					}
				});

				// Fetch the 'minimum' and 'maximum' quantity
				const min = formElement.querySelector('.quantity .min').value;
				const max = formElement.querySelector('.quantity .max').value;

				// If the 'maximum' is less than 'minimum', then show an alert
				if(Number(max) < Number(min)) {
					showAlertBox(alertBox, 'Minimum number of occurrences cannot be greater than maximum number of occurrences');

					return;
				}
				// If 'minimum' is equal to 'maximum', then omit any one of the fields
				else if(min === max) {
					// If 'maximum' and 'minimum' are equal to 1, then omit both the fields
					if(Number(min) !== 1) {
						last += `{${min}}`;
					}
				}
				else if(Number(min) === 0 && Number(max) === 1) {
					last += '?';
				}
				else {
					last += `{${min},${max}}`;
				}

				last += '$';
				_last = last;
			}
		}
	});

	// This array will store all the expressions used in the midfields
	const midExprs = [];

	// Fetch all the mid fields in the form of an array
	const midFields = [...document.querySelectorAll('.midpoint')];

	// Iterate through every midField and analyse each midField deeply to build the regex
	midFields.forEach((midField) => {
		// Character Set
		if(midField.classList.contains('character-set-block')) {
			let expr = '';

			// Fetch all the radio buttons in the current character-set-block
			const radioBtns = midField.querySelectorAll('input[type="radio"]');

			// Iterate through every radioBtn and analyse each radioBtn to build the regex
			radioBtns.forEach((radioBtn) => {
				// Analyse only if the radioBtn is checked
				if(radioBtn.checked) {
					// Character Set
					if(radioBtn.className === 'character-set') {
						// Fetch all the checkboxes
						const checkBoxes = midField.querySelectorAll('input[type="checkbox"]');

						// Iterate through every checkBox and inspect each checkbox to build the regex
						checkBoxes.forEach((checkBox) => {
							// Check only if the checkbox is checked
							if(checkBox.checked) {
								// Uppercase
								if(checkBox.id.includes('uppercase')) {
									expr += 'A-Z';
								}
								// Lowercase
								if(checkBox.id.includes('lowercase')) {
									expr += 'a-z';
								}
								// Number
								if(checkBox.id.includes('number')) {
									expr += '\\d';
								}
								// Special Characters
								if(checkBox.id.includes('special')) {
									expr += '_\\W';
								}
								// Whitespace
								if(checkBox.id.includes('whitespace')) {
									expr += '\\s';
								}
								// Horizontal Tab
								if(checkBox.id.includes('horizontal')) {
									expr += '\\t';
								}
								// Vertical Tab
								if(checkBox.id.includes('vertical')) {
									expr += '\\v';
								}
								// Carriage Return
								if(checkBox.id.includes('carriage')) {
									expr += '\\r';
								}
								// Linefeed
								if(checkBox.id.includes('linefeed')) {
									expr += '\\n';
								}
								// Form Feed
								if(checkBox.id.includes('form')) {
									expr += '\\f';
								}
							}
						});

						// Enclose the expression in square brackets only if it's not empty
						if(expr) {
							expr = expr.split('');
							expr.unshift('[');
							expr = expr.join('');
							expr += ']';
						}
					}

					// Custom Characters
					else if(radioBtn.className === 'custom-characters') {
						const customCharactersField = midField.querySelector('input[type="text"]');

						expr = `[${customCharactersField.value}]`;
					}
				}
			});

			// Fetch the 'minimum' and 'maximum' quantity
			const min = midField.querySelector('.min').value;
			const max = midField.querySelector('.max').value;

			// If the 'maximum' is less than 'minimum', then show an alert
			if(Number(max) < Number(min)) {
				showAlertBox(alertBox, 'Minimum number of occurrences cannot be greater than maximum number of occurrences');

				return;
			}
			// If 'minimum' is equal to 'maximum', then omit any one of the fields
			else if(min === max) {
				// If 'maximum' and 'minimum' are equal to 1, then omit both the fields
				if(Number(min) !== 1) {
					expr += `{${min}}`;
				}
			}
			else if(Number(min) === 0 && Number(max) === 1) {
				expr += '?';
			}
			else {
				expr += `{${min},${max}}`;
			}

			// Check if any lookahead assertion is applied on the current field
			if(assertionInfo.isLookahead) {
				expr = `(?=${expr})`;
			}
			if(assertionInfo.isNegativeLookahead) {
				expr = `(?!${expr})`;
			}

			assertionInfo.isLookahead = false;
			assertionInfo.isNegativeLookahead = false;

			midExprs.push(expr);
		}
		// Groups
		if(midField.classList.contains('group-block')) {
			const customGroupsField = midField.querySelector('input[type="text"]');

			let expr = `(${customGroupsField.value})`;

			// Fetch the 'minimum' and 'maximum' quantity
			const min = midField.querySelector('.min').value;
			const max = midField.querySelector('.max').value;

			// If the 'maximum' is less than 'minimum', then show an alert
			if(Number(max) < Number(min)) {
				showAlertBox(alertBox, 'Minimum number of occurrences cannot be greater than maximum number of occurrences');

				return;
			}
			// If 'minimum' is equal to 'maximum', then omit any one of the fields
			else if(min === max) {
				// If 'maximum' and 'minimum' are equal to 1, then omit both the fields
				if(Number(min) !== 1) {
					expr += `{${min}}`;
				}
			}
			else {
				expr += `{${min},${max}}`;
			}

			// Check if any lookahead assertion is applied on the current field
			if(assertionInfo.isLookahead) {
				expr = `(?=${expr})`;
			}
			if(assertionInfo.isNegativeLookahead) {
				expr = `(?!${expr})`;
			}

			assertionInfo.isLookahead = false;
			assertionInfo.isNegativeLookahead = false;

			midExprs.push(expr);
		}
		// Assertions
		if(midField.classList.contains('assertion-block')) {
			const assertions = [...midField.querySelectorAll('input[type="radio"]')];

			assertions.forEach((assertion) => {
				if(assertion.checked) {
					if(assertion.value === 'lookahead') {
						assertionInfo.isLookahead = true;

						const topMostParent = assertion.parentElement.parentElement;

						// If the element after the current assertion element is the last element
						if(topMostParent.nextElementSibling.nextElementSibling.id === 'ends-with') {
							_last = `(?=${_last})`;
						}
					}
					if(assertion.value === 'negative_lookahead') {
						assertionInfo.isNegativeLookahead = true;

						// If the element after the current assertion element is the last element
						if(topMostParent.nextElementSibling.nextElementSibling.id === 'ends-with') {
							_last = `(?!${_last})`;
						}
					}
					if(assertion.value === 'lookbehind') {
						if(midExprs.length !== 0) {
							midExprs[midExprs.length - 1] = `(?<=${midExprs[midExprs.length - 1]})`;
						}
						else {
							if(_first.includes('{')) {
								const content = _first.substring(0, _first.indexOf('{'));
								const quantifier = _first.substring(_first.indexOf('{'), _first.indexOf('}') + 1);

								_first = `(?<=${content})${quantifier}`;
							}
							else {
								_first = `(?<=${_first})`;
							}
						}
					}
					if(assertion.value === 'negative_lookbehind') {
						if(midExprs.length !== 0) {
							midExprs[midExprs.length - 1] = `(?!${midExprs[midExprs.length - 1]})`;
						}
						else {
							if(_first.includes('{')) {
								const content = _first.substring(0, _first.indexOf('{'));
								const quantifier = _first.substring(_first.indexOf('{'), _first.indexOf('}') + 1);

								_first = `(?!${content})${quantifier}`;
							}
							else {
								_first = `(?!${_first})`;
							}
						}
					}
				}
			});
		}
		// Or
		if(midField.classList.contains('or-block')) {
			midExprs.push('|');
		}
	});

	// Add 'forward slash' and the '_first' part
	regex = `/${_first}`;

	// Iterate through every midExpr and add each of them to the regex
	midExprs.forEach((midExpr) => {
		regex += midExpr;
	});

	// Add 'forward slash' and the '_last' part
	regex += `${_last}/`;

	// Add the flags accordingly
	flags.forEach((flag) => {
		if(flag.checked) {
			regex += flag.value;
		}
	});

	displayRegex(regex);
});
