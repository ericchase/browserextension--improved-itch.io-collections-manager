// src/lib/ericchase/WebPlatform_Node_Reference_Class.ts
class Class_WebPlatform_Node_Reference_Class {
  node;
  constructor(node) {
    this.node = node;
  }
  as(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
    throw new TypeError(`Reference node ${this.node} is not ${constructor_ref}`);
  }
  is(constructor_ref) {
    return this.node instanceof constructor_ref;
  }
  passAs(constructor_ref, fn) {
    if (this.node instanceof constructor_ref) {
      fn(this.node);
    }
  }
  tryAs(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
  }
  get classList() {
    return this.as(HTMLElement).classList;
  }
  get className() {
    return this.as(HTMLElement).className;
  }
  get style() {
    return this.as(HTMLElement).style;
  }
  getAttribute(qualifiedName) {
    return this.as(HTMLElement).getAttribute(qualifiedName);
  }
  setAttribute(qualifiedName, value) {
    this.as(HTMLElement).setAttribute(qualifiedName, value);
  }
  getStyleProperty(property) {
    return this.as(HTMLElement).style.getPropertyValue(property);
  }
  setStyleProperty(property, value, priority) {
    this.as(HTMLElement).style.setProperty(property, value, priority);
  }
}
function WebPlatform_Node_Reference_Class(node) {
  return new Class_WebPlatform_Node_Reference_Class(node);
}

// src/options/options.module.ts
import { LoadOptions, options, SaveOptions } from "../lib/lib.options.module.js";

// src/lib/server/constants.ts
var SERVER_HOST = process.env.DEVSERVERHOST ?? window.location.host;

// src/lib/server/HotRefresh.ts
function HotRefresh(serverhost) {
  return new CHotRefresh(serverhost);
}

class CHotRefresh {
  serverhost;
  socket;
  methods = {
    onClose: (event) => {
      this.cleanup();
    },
    onError: (event) => {
      this.cleanup();
    },
    onMessage: (event) => {
      if (event.data === "reload") {
        window.location.reload();
      }
    }
  };
  constructor(serverhost) {
    this.serverhost = serverhost;
    this.serverhost ??= SERVER_HOST;
    this.startup();
  }
  cleanup() {
    if (this.socket) {
      this.socket.removeEventListener("close", this.methods.onClose);
      this.socket.removeEventListener("error", this.methods.onError);
      this.socket.removeEventListener("message", this.methods.onMessage);
      this.socket = undefined;
    }
  }
  startup() {
    this.socket = new WebSocket(`ws://${this.serverhost}/`);
    if (this.socket) {
      this.socket.addEventListener("close", this.methods.onClose);
      this.socket.addEventListener("error", this.methods.onError);
      this.socket.addEventListener("message", this.methods.onMessage);
    }
  }
}

// src/options/options.module.ts
HotRefresh();
var span_save_status = WebPlatform_Node_Reference_Class(document.querySelector("#save-status")).as(HTMLSpanElement);
var checkbox_option = WebPlatform_Node_Reference_Class(document.querySelector("#checkbox-option input")).as(HTMLInputElement);
var text_option = WebPlatform_Node_Reference_Class(document.querySelector("#text-option input")).as(HTMLInputElement);
var number_option = WebPlatform_Node_Reference_Class(document.querySelector("#number-option input")).as(HTMLInputElement);
await LoadOptions();
checkbox_option.checked = options.checkbox_option;
text_option.value = options.text_option;
number_option.value = options.number_option.toString(10);
var save_blinking_interval = undefined;
for (const input of [checkbox_option, text_option, number_option]) {
  input.addEventListener("input", CheckForChanges);
}
var button_save = WebPlatform_Node_Reference_Class(document.querySelector("#save-button")).as(HTMLButtonElement);
button_save.addEventListener("click", HandleSave);
CheckForChanges();
async function HandleSave() {
  options.checkbox_option = checkbox_option.checked;
  options.text_option = text_option.value;
  options.number_option = ToInt(number_option);
  try {
    await SaveOptions();
    setTimeout(() => {
      span_save_status.textContent = "";
    }, 1500);
  } catch (error) {
    span_save_status.textContent = `Error! ${error}`;
  }
  CheckForChanges();
}
function CheckForChanges() {
  clearInterval(save_blinking_interval);
  if (options.checkbox_option !== checkbox_option.checked || options.text_option !== text_option.value || options.number_option !== ToInt(number_option)) {
    button_save.toggleAttribute("disabled", false);
    button_save.classList.toggle("alt-color");
    save_blinking_interval = setInterval(() => {
      button_save.classList.toggle("alt-color");
    }, 500);
  } else {
    button_save.toggleAttribute("disabled", true);
    button_save.classList.remove("alt-color");
  }
}
function ToInt(input) {
  return Number.parseInt(input.value) || 0;
}
