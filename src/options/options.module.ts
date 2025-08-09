import { WebPlatform_Node_Reference_Class } from '../lib/ericchase/WebPlatform_Node_Reference_Class.js';
import { LoadOptions, options, SaveOptions } from '../lib/lib.options.module.js';
import { HotRefresh } from '../lib/server/HotRefresh.js';

HotRefresh();

const span_save_status = WebPlatform_Node_Reference_Class(document.querySelector('#save-status')).as(HTMLSpanElement);

const checkbox_option = WebPlatform_Node_Reference_Class(document.querySelector('#checkbox-option input')).as(HTMLInputElement);
const text_option = WebPlatform_Node_Reference_Class(document.querySelector('#text-option input')).as(HTMLInputElement);
const number_option = WebPlatform_Node_Reference_Class(document.querySelector('#number-option input')).as(HTMLInputElement);

await LoadOptions();

checkbox_option.checked = options.checkbox_option;
text_option.value = options.text_option;
number_option.value = options.number_option.toString(10);

/** @type {Timer|undefined} */
let save_blinking_interval: Timer | undefined = undefined;

for (const input of [checkbox_option, text_option, number_option]) {
  input.addEventListener('input', CheckForChanges);
}

// Save Options
const button_save = WebPlatform_Node_Reference_Class(document.querySelector('#save-button')).as(HTMLButtonElement);
button_save.addEventListener('click', HandleSave);

CheckForChanges();

// Functions

async function HandleSave() {
  options.checkbox_option = checkbox_option.checked;
  options.text_option = text_option.value;
  options.number_option = ToInt(number_option);

  try {
    await SaveOptions();
    setTimeout(() => {
      span_save_status.textContent = '';
    }, 1500);
  } catch (error) {
    span_save_status.textContent = `Error! ${error}`;
  }
  CheckForChanges();
}

function CheckForChanges() {
  clearInterval(save_blinking_interval);
  if (
    options.checkbox_option !== checkbox_option.checked ||
    options.text_option !== text_option.value ||
    options.number_option !== ToInt(number_option) //
  ) {
    button_save.toggleAttribute('disabled', false);
    button_save.classList.toggle('alt-color');
    save_blinking_interval = setInterval(() => {
      button_save.classList.toggle('alt-color');
    }, 500);
  } else {
    button_save.toggleAttribute('disabled', true);
    button_save.classList.remove('alt-color');
  }
}

function ToInt(input: HTMLInputElement) {
  return Number.parseInt(input.value) || 0;
}
