const alertBox = document.querySelector('.alert');
export default alertBox;

const hideAlertBtn = alertBox.querySelector('button');

hideAlertBtn.addEventListener('click', () => {
    hideAlertBox(alertBox);
});

export const hideAlertBox = alertBox => {
    alertBox.style.display = "none"; 
}

export const showAlertBox = (alertBox, message) => {
    alertBox.style.display = "flex";

    alertBox.querySelector('p').innerHTML = `<strong>Error!</strong> ${message}`;
}