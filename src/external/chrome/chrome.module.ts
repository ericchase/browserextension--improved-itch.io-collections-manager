import { Core_Promise_Deferred_Class } from '../../lib/ericchase/Core_Promise_Deferred_Class.js';

export function ChromeCallback() {
  const { promise, reject, resolve } = Core_Promise_Deferred_Class<{ [key: string]: any }>();
  return {
    callback(data?: any) {
      const error = chrome.runtime.lastError ?? undefined;
      if (error !== undefined) {
        reject(error);
      } else {
        resolve(data);
      }
    },
    promise,
  };
}
