import alertBox, { showAlertBox } from './alert.js';

const generateRegexBtn = document.getElementById('generate-regex');

export const outputRegexField = document.getElementById('output-regex');

const formElements = document.querySelectorAll('.form-element');

// Convert the NodeList to an array
const flags = [...document.querySelectorAll('.flag')];

// Function: Displays the regex in the outputRegexField
const displayRegex = (regex) => {
	outputRegexField.value = regex;
};

// Function: Analyse checkboxes
const analyseCheckBoxes = (checkBoxes) => {
	let expression = '';

	// Iterate through every checkBox and generate the regex accordingly
	checkBoxes.forEach((checkBox) => {
		// Analyse the checkbox only if it's checked
		if(checkBox.checked) {
			// Uppercase
			if(checkBox.id.includes('uppercase')) {
				expression += 'A-Z';
			}
			// Lowercase
			if(checkBox.id.includes('lowercase')) {
				expression += 'a-z';
			}
			// Numbers
			if(checkBox.id.includes('numbers')) {
				expression += '\\d';
			}
			// Non-numeric Characters
			if(checkBox.id.includes('non-numeric')) {
				expression += '\\D';
			}
			// Word Characters
			if(checkBox.id.includes('word-characters')) {
				expression += '\\w';
			}
			// Special Characters
			if(checkBox.id.includes('special')) {
				expression += '_\\W';
			}
			// Whitespace
			if(checkBox.id.includes('set-whitespace')) {
				expression += '\\s';
			}
			// Non-Whitespace Character
			if(checkBox.id.includes('non-whitespace')) {
				expression += '\\S';
			}
			// Horizontal Tab
			if(checkBox.id.includes('horizontal')) {
				expression += '\\t';
			}
			// Vertical Tab
			if(checkBox.id.includes('vertical')) {
				expression += '\\v';
			}
			// Carriage Return
			if(checkBox.id.includes('carriage')) {
				expression += '\\r';
			}
			// Linefeed
			if(checkBox.id.includes('linefeed')) {
				expression += '\\n';
			}
			// Form Feed
			if(checkBox.id.includes('form')) {
				expression += '\\f';
			}
		}
	});

	return expression;
};

// Function: Encloses the expression in square brackets based on the position of the expression
const encloseExpressionInSquareBrackets = (expression) => {
	return `[${expression}]`;
};

// Function: Generates the quantifier
const generateQuantifier = (min, max, isNonGreedy) => {
	let expression = '';

	min = Number(min);
	max = Number(max);

	// If 'maximum' is more than 'minimum', then show an alert
	if(max < min && max === -1) {
		expression += `{${min},}`;
	}
	else if (max < min) {
		showAlertBox(alertBox, 'Minimum number of occurrences cannot be greater than maximum number of occurrences');
	}
	// If 'minimum' is equal to 'maximum', then omit any one of the fields
	else if (min === max) {
		// If 'minimum' and 'maximum' is equal to 1, then omit both of them
		if (Number(min) !== 1) {
			expression += `{${min}}`;
		}
	}
	else if (min === 0 && max === 1) {
		expression += '?';
	}
	else if(min === 0 && max >= 65535) {
		expression += '*';
	}
	else if (min === 1 && max >= 65535) {
		expression += '+';
	}
	else {
		expression += `{${min},${max}}`;
	}

	if(isNonGreedy) {
		if(expression === '') {
			expression += '{1}?';
		}
		else {
			expression += '?';
		}
	}

	return expression;
};

// Function: Handles lookahead assertion
const handleLookaheadAssertion = (assertionInfo, expression) => {
	// Check if any lookahead assertion is applied on the current field
	if (assertionInfo.isLookahead) {
		expression = `(?=${expression})`;
	}
	if (assertionInfo.isNegativeLookahead) {
		expression = `(?!${expression})`;
	}

	assertionInfo.isLookahead = false;
	assertionInfo.isNegativeLookahead = false;

	return expression;
};

// Function: Escapes special characters in the expression
const escapeSpecialCharacters = (expression) => {
	return expression.replace(/\W/g, '\\$&');
};

// Attach a 'click' event listener to the generateRegexBtn
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

							first = analyseCheckBoxes(checkBoxes);

							first = encloseExpressionInSquareBrackets(first);

							first = `^${first}`;
						}

						// Custom Characters
						else if(radioBtn.className === 'custom-characters') {
							// Enclose the character set in square brackets
							const customCharactersField = formElement.querySelector('.custom-characters-field input');

							first = `^[${escapeSpecialCharacters(customCharactersField.value)}]`;
						}

						// Custom Group
						else if(radioBtn.className === 'custom-group') {
							// Enclose the character set in square brackets
							const customGroupsField = formElement.querySelector('.custom-groups-field input');

							first = `^(${escapeSpecialCharacters(customGroupsField.value)})`;
						}
					}
				});

				// Fetch the 'minimum' and 'maximum' quantity
				const min = formElement.querySelector('.quantity .min').value;
				const max = formElement.querySelector('.quantity .max').value;

				const isNonGreedy = formElement.querySelector('.quantity .is-non-greedy').checked;

				first += generateQuantifier(min, max, isNonGreedy);

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

							last = analyseCheckBoxes(checkBoxes);

							last = encloseExpressionInSquareBrackets(last);
						}

						// Custom Characters
						else if(radioBtn.className === 'custom-characters') {
							const customCharactersField = formElement.querySelector('.custom-characters-field input');

							last = `[${escapeSpecialCharacters(customCharactersField.value)}]`;
						}

						// Custom Group
						else if(radioBtn.className === 'custom-group') {
							const customGroupsField = formElement.querySelector('.custom-groups-field input');

							last = `(${escapeSpecialCharacters(customGroupsField.value)})`;
						}
					}
				});

				// Fetch the 'minimum' and 'maximum' quantity
				const min = formElement.querySelector('.quantity .min').value;
				const max = formElement.querySelector('.quantity .max').value;

				const isNonGreedy = formElement.querySelector('.quantity .is-non-greedy').checked;

				last += generateQuantifier(min, max, isNonGreedy);

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

						expr = analyseCheckBoxes(checkBoxes);

						// Enclose the expression in square brackets only if it's not empty
						if(expr) {
							expr = encloseExpressionInSquareBrackets(expr);
						}
					}

					// Custom Characters
					else if(radioBtn.className === 'custom-characters') {
						const customCharactersField = midField.querySelector('input[type="text"]');

						expr = `[${escapeSpecialCharacters(customCharactersField.value)}]`;
					}
				}
			});

			// Fetch the 'minimum' and 'maximum' quantity
			const min = midField.querySelector('.min').value;
			const max = midField.querySelector('.max').value;

			const isNonGreedy = midField.querySelector('.quantity .is-non-greedy').checked;

			expr += generateQuantifier(min, max, isNonGreedy);

			expr = handleLookaheadAssertion(assertionInfo, expr);

			midExprs.push(expr);
		}
		// Negative Character Set
		if (midField.classList.contains('negative-character-set-block')) {
			let expr = '';

			// Fetch all the radio buttons in the current character-set-block
			const radioBtns = midField.querySelectorAll('input[type="radio"]');

			// Iterate through every radioBtn and analyse each radioBtn to build the regex
			radioBtns.forEach((radioBtn) => {
				// Analyse only if the radioBtn is checked
				if (radioBtn.checked) {
					// Character Set
					if (radioBtn.className === 'character-set') {
						// Fetch all the checkboxes
						const checkBoxes = midField.querySelectorAll('input[type="checkbox"]');

						expr = analyseCheckBoxes(checkBoxes);

						expr = `^${expr}`;

						// Enclose the expression in square brackets only if it's not empty
						if (expr) {
							expr = encloseExpressionInSquareBrackets(expr);
						}
					}

					// Custom Characters
					else if (radioBtn.className === 'custom-characters') {
						const customCharactersField = midField.querySelector('input[type="text"]');

						expr = `[^${escapeSpecialCharacters(customCharactersField.value)}]`;
					}
				}
			});

			// Fetch the 'minimum' and 'maximum' quantity
			const min = midField.querySelector('.min').value;
			const max = midField.querySelector('.max').value;

			const isNonGreedy = midField.querySelector('.quantity .is-non-greedy').checked;

			expr += generateQuantifier(min, max, isNonGreedy);

			expr = handleLookaheadAssertion(assertionInfo, expr);

			midExprs.push(expr);
		}
		// Groups
		if(midField.classList.contains('group-block')) {
			const customGroupsField = midField.querySelector('input[type="text"]');

			let expr = `(${customGroupsField.value})`;

			// Fetch the 'minimum' and 'maximum' quantity
			const min = midField.querySelector('.min').value;
			const max = midField.querySelector('.max').value;

			const isNonGreedy = midField.querySelector('.quantity .is-non-greedy').checked;

			expr += generateQuantifier(min, max, isNonGreedy);

			expr = handleLookaheadAssertion(assertionInfo, expr);

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

						const topMostParent = assertion.parentElement.parentElement;

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
		// Any single character
		if(midField.classList.contains('any-single-character-block')) {
			midExprs.push('.');
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
