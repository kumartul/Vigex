const generateRegexBtn = document.getElementById('generate-regex');

// Function: Generates the regular expression
generateRegexBtn.addEventListener('click', () => {    
    generateRegexBtn.textContent = "Generating...";
    
    generateRegexBtn.disabled = true;

    // Change the style
    generateRegexBtn.style.backgroundColor = "#1b9bff";
    generateRegexBtn.style.color = "white";
    generateRegexBtn.style.cursor = "not-allowed";
});