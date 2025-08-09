// src/lib/ericchase/Core_Promise_Deferred_Class.ts
class Class_Core_Promise_Deferred_Class {
  promise;
  reject;
  resolve;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    if (this.resolve === undefined || this.reject === undefined) {
      throw new Error(`${Class_Core_Promise_Deferred_Class.name}'s constructor failed to setup promise functions.`);
    }
  }
}
function Core_Promise_Deferred_Class() {
  return new Class_Core_Promise_Deferred_Class;
}

// src/external/chrome/chrome.module.ts
function ChromeCallback() {
  const { promise, reject, resolve } = Core_Promise_Deferred_Class();
  return {
    callback(data) {
      const error = chrome.runtime.lastError ?? undefined;
      if (error !== undefined) {
        reject(error);
      } else {
        resolve(data);
      }
    },
    promise
  };
}
export {
  ChromeCallback
};
