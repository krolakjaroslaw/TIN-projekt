const first_name = document.getElementById('first_name');
const last_name = document.getElementById('last_name');
const email = document.getElementById('email');
const delivery = document.getElementById('delivery');
const address = document.getElementById('address');
const products = document.getElementsByClassName('card-text-container');

const first_name_error = 'first-name-error';
const last_name_error = 'last-name-error';
const email_error = 'email-error';
const address_error = 'address-error';
const products_error = 'products-error';

const error_color = '#cc1122';
const success_validation_color = '#b4b2b4';

const blank_field_error_msg = " nie może być puste";
const special_characters_error_msg = " nie może posiadać specjalnych znaków";
const number_characters_error_msg = " nie może posiadać cyfr";
const wrong_email_format_error_msg = "Nieprawidłowy ";
const no_products_error_msg = "Brak produktów w koszyku";

let errorCount = 0;
let isFormValid = true;

function validateForm() {
    validate();
    // if (!errorCount) {
    //     alert("Pomyślnie przesłano formularz!")
    // }
    return !errorCount;
}

function validate() {
    errorCount = 0;
    let is_first_name_ok = simpleValidate(first_name, first_name_error, "Imię");
    let is_last_name_ok = simpleValidate(last_name, last_name_error, "Nazwisko");
    let is_email_ok = validateEmail(email, email_error, "E-mail");
    let is_address_ok = validateAddress(address, address_error, 'Adres');
    let is_products_ok = validateProducts(products, products_error, 'Produkty');

    scrollToFirstElementFailed(is_first_name_ok, is_last_name_ok, is_email_ok, is_address_ok, is_products_ok);
    showErrorSummary();
}

function simpleValidate(input, errorId, name) {
    if (isFieldBlank(input)) {
        errorOnInputField(input, errorId, name + blank_field_error_msg);
        return false;
    } else if (containsNumbers(input)) {
        errorOnInputField(input, errorId, name + number_characters_error_msg);
        return false;
    } else if (containsSpecialCharacters(input)) {
        errorOnInputField(input, errorId, name + special_characters_error_msg);
    } else {
        successValidation(input, errorId);
        return true;
    }
}

function isFieldBlank(input) {
    return !input.value.trim().length;
}

function containsSpecialCharacters(input) {
    let regexOnlyWordsAndNumber = /^[a-zA-Z0-9. ]+$/;
    return !regexOnlyWordsAndNumber.exec(input.value);
}

function errorOnInputField(input, errorId, errorMsg) {
    input.style.borderColor = error_color;
    document.getElementById(errorId).innerHTML = errorMsg;
    input.placeholder = '';
    console.warn(errorMsg);
    errorCount++;
}

function successValidation(input, errorId) {
    input.style.borderColor = success_validation_color;
    document.getElementById(errorId).innerHTML = '';
}

function containsNumbers(input) {
    let regexNumbers = /^.*[0-9.]+.*$/;
    return regexNumbers.exec(input.value);
}

function validateEmail(input, errorId, name) {
    let regexEmail = /^.+[@]{1}.+$/;

    if (isFieldBlank(input)) {
        errorOnInputField(input, errorId, 'Email' + blank_field_error_msg);
        return false;
    } else if (!regexEmail.exec(input.value)) {
        errorOnInputField(input, errorId, wrong_email_format_error_msg + 'email');
        return false;
    } else {
        successValidation(input, errorId);
        return true;
    }
}

function validateAddress(input, errorId, name) {
    if (delivery.checked) {
        if (!address.value) {
            errorOnInputField(input, errorId, name + blank_field_error_msg);
            return false;
        } else {
            successValidation(input, errorId);
            return true;
        }
    }
}

function validateProducts() {
    if (products.length < 1) {
        document.getElementById(products_error).innerHTML = no_products_error_msg;
        console.warn(products_error);
        errorCount++;
        return false;
    } else {
        console.log(products.length);
        document.getElementById(products_error).innerHTML = '';
        return true;
    }
}

function scrollToFirstElementFailed(is_first_name_ok, is_last_name_ok, is_email_ok, is_address_ok, is_products_ok) {
    if (!is_first_name_ok) {
        first_name.scrollIntoView();
    } else if (!is_last_name_ok) {
        last_name.scrollIntoView();
    } else if (!is_email_ok) {
        email.scrollIntoView();
    } else if (!is_address_ok) {
        address.scrollIntoView();
    } else if (!is_products_ok) {
        products.scrollIntoView();
    }
}

function showErrorSummary() {
    let errorSummary = document.getElementById('error-summary');
    errorSummary.style.color = error_color;
    if (errorCount > 0) {
        errorSummary.innerHTML =
            errorCount === 1 ? errorCount + ' błąd' : errorCount > 4 ? errorCount + " błędów" : errorCount + " błędy";
        isFormValid = false;
    } else {
        errorSummary.innerHTML = 'Pomyślnie przesłano formularz!';
        errorSummary.style.color = '#49a02f';
        isFormValid = true;
    }
}