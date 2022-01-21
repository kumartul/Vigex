import './generate.js';
import { confirmationStates } from './constants.js';

const generateRegexBtn = document.getElementById('generate-regex');
const starsOnGitHubBtn = document.getElementById('stars-on-github');

// Convert the NodeList to an array
const expandBtns = [...document.querySelectorAll('.expand-btn')];

// Convert the NodeList to an array
const confirmationMenus = [...document.querySelectorAll('select')];

// Conver the NodeList to an array
const radioBtns = [...document.querySelectorAll('input[type="radio"]')];

// Asynchronous Function: Fetches the number of star gazers of Vigex
const fetchNumberOfStarGazers = async () => {
    const API_URL = "https://api.github.com/users/kumartul/repos";

    const starGazersSpan = document.getElementById('number-of-star-gazers');

    // Fetch the response from the API and then convert it to JSON
    const response = await fetch(API_URL);
    const responseData = await response.json();

    // Iterate through every object and if the object's name property is 'Vigex', then change the textContent
    // of the starGazersSpan to the actual number of star gazers
    responseData.forEach(responseDatum => {
        if(responseDatum.name === "Vigex") {
            starGazersSpan.textContent = responseDatum.stargazers_count;
        }
    });
}

// Function: Generates the regular expression
generateRegexBtn.addEventListener('click', () => {    
    generateRegexBtn.textContent = "Generating...";
    
    generateRegexBtn.disabled = true;

    // Change the style
    generateRegexBtn.style.backgroundColor = "#1b9bff";
    generateRegexBtn.style.color = "white";
    generateRegexBtn.style.cursor = "not-allowed";
});

// Attach a 'click' event listener to the starsOnGitHubBtn so that whenever someone clicks on the button,
// he/she will be redirected to the repository on GitHub
starsOnGitHubBtn.addEventListener('click', () => {
    window.location.href = "https://github.com/kumartul/vigex";
});

confirmationMenus.forEach(confirmationMenu => {
    confirmationMenu.addEventListener('change', event => {
        // Parent of the current select menu
        const formElement = event.target.parentElement;

        // CurrentState: Yes | No
        const currentState = confirmationStates[event.target.selectedIndex];

        if(currentState === "Yes") {
            // Fetch all the divs in the formElement that are hidden in the form of an array
            const hiddenDivs = [...formElement.querySelectorAll(`.hidden`)];

            // Iterate through every hiddenDiv and remove the 'hidden' class and add the 'visible' class
            // so that they become visible
            hiddenDivs.forEach(hiddenDiv => {
                hiddenDiv.classList.remove('hidden');
                hiddenDiv.classList.add('visible');
            });

            // Fetch all the input fields in the form of an array
            let inputFields = [...formElement.querySelectorAll('input[type="radio"]'), ...formElement.querySelectorAll('.quantity input')];

            inputFields.forEach(inputField => {
                inputField.disabled = false;
            });

            // Get the expandBtn of the formElement
            const expandBtn = formElement.querySelector(`.expand-btn`);

            // Rotate the expandBtn
            expandBtn.style.transition = "0.25s";
            expandBtn.style.transform = "rotateZ(90deg)";
        }
        else if(currentState === "No") {
            // Fetch all the divs in the formElement that are visible in the form of an array
            const hiddenDivs = [...formElement.querySelectorAll(".visible")];

            // Iterate through every hiddenDiv and remove the 'visible' class and add the 'hidden' class
            // so that they become visible
            hiddenDivs.forEach(hiddenDiv => {
                hiddenDiv.classList.remove('visible');
                hiddenDiv.classList.add('hidden');
            });

            // Fetch all the input fields in the form of an array
            const inputFields = [...formElement.querySelectorAll('input')];

            inputFields.forEach(inputField => {
                inputField.disabled = true;
            });

            // Get the expandBtn of the formElement
            const expandBtn = formElement.querySelector(".expand-btn");

            // Rotate the expandBtn
            expandBtn.style.transition = "0.25s";
            expandBtn.style.transform = "rotateZ(0deg)";
        }
    });
});

// Iterate through every expandBtn and attach a 'click' event listener to each of them
expandBtns.forEach(expandBtn => {
    // Rotate the expandBtn by 90deg on the z-axis
    expandBtn.addEventListener('click', event => {
        // Parent element of expandBtn
        const formElement = event.target.parentElement;

        if(event.target.getAttribute("data-expanded") === "no") {
            event.target.style.transition = "0.25s";
            event.target.style.transform = "rotateZ(90deg)";

            // Fetch all the divs in the formElement that are hidden in the form of an array
            const hiddenDivs = [...formElement.querySelectorAll(".hidden")];

            // Iterate through every hiddenDiv and remove the 'hidden' class and add the 'visible' class
            // so that they become visible
            hiddenDivs.forEach(hiddenDiv => {
                hiddenDiv.classList.remove('hidden');
                hiddenDiv.classList.add('visible');
            });

            event.target.setAttribute("data-expanded", "yes");
        }
        else if(event.target.getAttribute("data-expanded") === "yes") {
            event.target.style.transition = "0.25s";
            event.target.style.transform = "rotateZ(0deg)";

            // Fetch all the divs in the formElement that are hidden in the form of an array
            const hiddenDivs = [...formElement.querySelectorAll(".visible")];

            // Iterate through every hiddenDiv and remove the 'hidden' class and add the 'visible' class
            // so that they become visible
            hiddenDivs.forEach(hiddenDiv => {
                hiddenDiv.classList.remove('visible');
                hiddenDiv.classList.add('hidden');
            });

            event.target.setAttribute("data-expanded", "no");
        }
    });
});

radioBtns.forEach(radioBtn => {
    radioBtn.addEventListener('click', event => {
        const formElement = event.target.parentElement.parentElement;

        let inputFieldsToBeActivated = undefined;
        let inputFieldsToBeDeactivated = undefined;

        if(event.target.className === "character-set") {
            // Convert the NodeList of 'HTMLInputElement' to an array
            inputFieldsToBeActivated = [...formElement.querySelectorAll('.character-sets input')];
            inputFieldsToBeDeactivated = [...formElement.querySelectorAll('.custom-characters-field input')];
        }
        else if(event.target.className === "custom-characters") {
            // Convert the NodeList of 'HTMLInputElement' to an array
            inputFieldsToBeActivated = [...formElement.querySelectorAll('.custom-characters-field input')];
            inputFieldsToBeDeactivated = [...formElement.querySelectorAll('.character-sets input')];
        }

        // Iterate through every inputField and enable it
        inputFieldsToBeActivated.forEach(inputFieldToBeActivated => {
            inputFieldToBeActivated.disabled = false;
        });

        // Iterate through every inputField and disable it
        inputFieldsToBeDeactivated.forEach(inputFieldToBeDeactivated => {
            inputFieldToBeDeactivated.disabled = true;
        });
    });
});

// TODO: This function will be called when the project will be made open-source
// fetchNumberOfStarGazers();
