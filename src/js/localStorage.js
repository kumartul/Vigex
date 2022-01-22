import { regexKeyName } from './utils.js';

export const saveToLocalStorage = (regexName, regex) => {
    let regexArr = localStorage.getItem(regexKeyName);

    if(regexArr !== null && regex !== []) {
        regexArr = JSON.parse(regexArr);
    }
    else {
        regexArr = [];
    }

    regexArr.push({
        regexName: regexName,
        regex: regex
    });

    localStorage.setItem(regexKeyName, JSON.stringify(regexArr));
}