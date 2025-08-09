import { ChromeCallback } from '../external/chrome/chrome.module.js';

export const options = {
  checkbox_option: false,
  text_option: 'Yippee!',
  number_option: 0,
};

export const OptionKeys = Object.freeze(Object.keys(options));

export async function LoadOptions() {
  let data: Partial<typeof options> = {};
  if (typeof chrome !== 'undefined') {
    const { callback, promise } = ChromeCallback();
    chrome.storage.local.get(OptionKeys, callback);
    data = await promise;
  } else {
    data = JSON.parse(localStorage.getItem('options') ?? '{}');
  }
  if (typeof data.checkbox_option === 'boolean') {
    options.checkbox_option = data.checkbox_option;
  }
  if (typeof data.text_option === 'string') {
    options.text_option = data.text_option;
  }
  if (typeof data.number_option === 'number') {
    options.number_option = data.number_option;
  }
}

export async function SaveOptions() {
  if (typeof chrome !== 'undefined') {
    const { callback, promise } = ChromeCallback();
    chrome.storage.local.set(options, callback);
    await promise;
  } else {
    localStorage.setItem('options', JSON.stringify(options));
  }
}
