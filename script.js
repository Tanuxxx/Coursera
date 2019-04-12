'use strict';

// Код валидации формы
let formValidClass = '';
let formInvalidClass = '';
let inputErrorClass = '';

/**
 * Add error class for the not valid input
 * @param inputElement
 */
function addInputErrorClass(inputElement) {
  inputElement.classList.add(inputErrorClass);
}

/**
 * Delete error class from the input
 * @param event
 */
function deleteInputErrorClass(event) {
  const inputElement = event.target;
  const inputElementClasses = inputElement.classList;
  inputElementClasses.remove(inputErrorClass);
}

/**
 * Add class to the form depending on the form validation result
 * @param isFormValid
 * @param formElement
 */
function addFormClass(isFormValid, formElement) {
  const formClass = isFormValid ? formValidClass : formInvalidClass;
  const formElementClasses = formElement.classList;
  // Remove all other classes related with form validation
  formElementClasses.remove(formValidClass, formInvalidClass);
  // Add class with form validation result
  formElementClasses.add(formClass);
}

/**
 * Check if input value correspond the requirements storing in data attributes
 * @param inputElement
 * @returns {boolean}
 */
function isInputElementValid(inputElement) {
  let isValid = true;
  const inputValue = inputElement.value;

  // If input is empty, no further validation is required
  // If empty field is required - input is invalid, if not - valid
  if (!inputValue) {
    return !Object.keys(inputElement.dataset).includes('required');
  }

  const validator = inputElement.dataset.validator;
  switch(validator) {
    case 'number':
      isValid = /^\d+$/.test(inputValue);

      const minValue = inputElement.dataset.validatorMin;
      const maxValue = inputElement.dataset.validatorMax;

      if (isValid && minValue) {
        isValid = parseInt(inputValue, 10) > minValue;
      }

      if (isValid && maxValue) {
        isValid = parseInt(inputValue, 10) < maxValue;
      }
      break;
    case 'letters':
      isValid = /^[a-z]+$/i.test(inputValue);
      break;
    case 'regexp':
      isValid = RegExp(inputElement.dataset.validatorPattern).test(inputValue);
      break;
  }
  return isValid;
}

/**
 * Validate input, add error class if validation failed and return validation result
 * @param inputElement
 * @returns {*}
 */
function validateInput(inputElement) {
  const isInputValid = isInputElementValid(inputElement);
  console.log(isInputValid);
  if (!isInputValid) {
    addInputErrorClass(inputElement);
  }
  return isInputValid;
}

/**
 * Validate particular input or all inputs on the form depending on the target type
 * @param event
 */
function validateFormInputs(event) {
  const eventTarget = event.target;

  if (eventTarget.tagName === 'INPUT') {
    validateInput(eventTarget);
  } else {
    const inputElements = eventTarget.getElementsByTagName('input');
    addFormClass(
      Array.from(inputElements).every(inputElement => validateInput(inputElement)),
      eventTarget,
    );
  }
  event.preventDefault();
}

/**
 * Validate form inputs
 * @param formDataObj
 */
function validateForm(formDataObj) {
  formValidClass = formDataObj.formValidClass;
  formInvalidClass = formDataObj.formInvalidClass;
  inputErrorClass = formDataObj.inputErrorClass;

  // Add event listener for submitting form
  const formElement = document.getElementById(formDataObj.formId);
  formElement.addEventListener('submit', validateFormInputs);

  // Add event listeners for all inputs for blur and focus
  const inputElements = formElement.getElementsByTagName('input');
  Array.from(inputElements).forEach(inputElement => {
    inputElement.addEventListener('blur', validateFormInputs, true);
    inputElement.addEventListener('focus', deleteInputErrorClass, true);
  });
}
