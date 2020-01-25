const name = document.getElementById('name');
const unit = document.getElementById('unit');
const quantity = document.getElementById('quantity');
const price = document.getElementById('price');
const expiration_date = document.getElementById('expiration_date');
const photo = document.getElementById('photo');
const description = document.getElementById('description');

const name_error = 'name-error';
const unit_error = 'unit-error';
const quantity_error = 'quantity-error';
const price_error = 'price-error';
const expiration_date_error = 'expiration-date-error';
const photo_error = 'photo-error';
const description_error = 'description-error';

const error_color = '#cc1122';
const success_validation_color = '#b4b2b4';

const blank_field_error_msg = " nie może być pusta";
const special_characters_error_msg = " nie może posiadać specjalnych znaków";
const price_lower_than_zero_error_msg = " nie może być ujemna";
const wrong_date_error_msg = " nie może być wcześniejsza";
const wrong_image_format_error_msg = " nie posiada prawidłowego formatu (.jpg, .gif, .png)";

let errorCount = 0;
let isFormValid = true;

function validateForm() {
    validate();
    return !errorCount;
}

function validate() {
    errorCount = 0;
    let is_name_ok = simpleValidate(name, name_error, "Nazwa");
    let is_unit_ok = simpleValidate(unit, unit_error, "Jednostka");
    let is_quantity_ok = simpleValidate(quantity, quantity_error, "Ilość");
    let is_price_ok = validatePrice(price, price_error, "Cena");
    let is_expiration_date_ok = validateExpirationDate(expiration_date, expiration_date_error, "Data przydatności");
    let is_photo_ok = validatePhoto(photo, photo_error, "Zdjęcie");
    let is_description_ok = validateDescription();

    scrollToFirstElementFailed(is_name_ok, is_unit_ok,
        is_quantity_ok, is_price_ok, is_description_ok, is_expiration_date_ok, is_photo_ok, is_description_ok);
    showErrorSummary();
}

function simpleValidate(input, errorId, name) {
    if (isFieldBlank(input)) {
        errorOnInputField(input, errorId, name + blank_field_error_msg);
        return false;
    }
    else if (containsSpecialCharacters(name)) {
        errorOnInputField(input, errorId, name + special_characters_error_msg);
        return false;
    }
    else {
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

function validatePrice(input, errorId, name) {
    if (input) {
        const price = parseFloat(input.value);
            if (price && price < 0) {
                errorOnInputField(input, errorId, name + price_lower_than_zero_error_msg);
                return false;
            }
    }
    return simpleValidate(quantity, errorId, name);
}

function validateExpirationDate(input, errorId, name) {
    if (!expiration_date.value) {
        errorOnInputField(input, errorId, name + blank_field_error_msg);
        return false;
    }

    let now = new Date();
    let date = new Date(expiration_date.value);

    if (date < now) {
        errorOnInputField(input, errorId, name + wrong_date_error_msg);
    }

    return date > now;
}

function validatePhoto(input, errorId, name) {
    if (!photo.value) {
        return true;
    }

    let extension = photo.value.split('.')[1];

    if (extension !== 'jpg' && extension !== 'gif' && extension !== 'png') {
        errorOnInputField(input, errorId, name + wrong_image_format_error_msg);
        return false;
    } else {
        successValidation(input, errorId);
        return true;
    }
}

function validateDescription() {
    if (description.value.length > 200) {
        errorOnInputField(description, description_error, "Maksymalna długość opisu to 200 znaków!");
        return false;
    }
    else {
        successValidation(description, description_error);
        return true;
    }
}

function scrollToFirstElementFailed(is_name_ok, is_unit_ok, is_quantity_ok, is_price_ok, is_expiration_date_ok, is_photo_ok, is_description_ok) {
    if (!is_name_ok) {
        name.scrollIntoView();
    } else if (!is_unit_ok) {
        unit.scrollIntoView();
    } else if (!is_quantity_ok) {
        quantity.scrollIntoView();
    } else if (!is_price_ok) {
        price.scrollIntoView();
    } else if (!is_expiration_date_ok) {
        expiration_date.scrollIntoView();
    } else if (!is_photo_ok) {
        photo.scrollIntoView();
    } else if(!is_description_ok) {
        description.scrollIntoView();
    }
}

function showErrorSummary() {
    let errorSummary = document.getElementById('error-summary');
    errorSummary.style.color = error_color;
    if (errorCount > 0) {
        errorSummary.innerHTML
            = errorCount === 1 ? errorCount + ' błąd' : errorCount > 4 ? errorCount + " błędów" : errorCount + " błędy";
        isFormValid = false;
    } else {
        errorSummary.innerHTML = 'Pomyślnie przesłano formularz!';
        errorSummary.style.color = '#49a02f';
        isFormValid = true;
    }
}