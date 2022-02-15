const alertBox = document.querySelector('.alert');
export default alertBox;

const hideAlertBtn = alertBox.querySelector('button');

// Attach a 'click' event listener to the hideAlertBtn so that whenever someone clicks on that button, the
// alert box disappears
hideAlertBtn.addEventListener('click', () => {
	hideAlertBox(alertBox);
});

// Function: Hides the alert box
const hideAlertBox = (alertBox) => {
	alertBox.style.display = 'none';
};

// Function: Displays the alert box with a message in it
export const showAlertBox = (alertBox, message) => {
	alertBox.style.display = 'flex';

	alertBox.querySelector('p').innerHTML = `<strong>Error!</strong> ${message}`;
};
