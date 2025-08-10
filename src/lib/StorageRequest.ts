import { StorageMessage } from './StorageMessage.js';

export function sendMessage(message: StorageMessage, cb: (response: StorageMessage) => void) {
  chrome.runtime.sendMessage(message, cb);
}

export function async_requestExportDatabase(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: 'REQUEST_EXPORT_DATABASE' }, (response: StorageMessage) => {
      switch (response.type) {
        case 'RESPONSE_DATABASE_JSON': {
          return resolve(response.data.json);
          break;
        }
        case 'RESPONSE_ERROR': {
          return reject(response.data.message);
          break;
        }
        default: {
          return reject(`incorrect event details: { type: ${response.type} }`);
          break;
        }
      }
    });
  });
}

export function async_requestImportDatabase(json: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: 'REQUEST_IMPORT_DATABASE', data: { json } }, (response: StorageMessage) => {
      switch (response.type) {
        case 'RESPONSE_OK': {
          return resolve();
          break;
        }
        case 'RESPONSE_ERROR': {
          return reject(response.data.message);
          break;
        }
        default: {
          return reject(`incorrect event details: { type: ${response.type} }`);
          break;
        }
      }
    });
  });
}

export function async_requestGetGameCollections(args: { game_id: string }): Promise<Set<string>> {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: 'REQUEST_GET_GAME_COLLECTIONS', data: { game_id: args.game_id } }, (response: StorageMessage) => {
      console.log('async_requestGetGameCollections');
      console.log(response.type);
      switch (response.type) {
        case 'RESPONSE_GAME_COLLECTIONS': {
          console.log(response.data);
          return resolve(new Set(response.data.collection_names));
          break;
        }
        case 'RESPONSE_ERROR': {
          return reject(response.data.message);
          break;
        }
        default: {
          return reject(`incorrect event details: { type: ${response.type} }`);
          break;
        }
      }
    });
  });
}

export async function async_requestAddGameToCollection(args: { collection_name: string; game_id: string }): Promise<void> {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: 'REQUEST_ADD_GAME_TO_COLLECTION', data: { collection_name: args.collection_name, game_id: args.game_id } }, (response: StorageMessage) => {
      switch (response.type) {
        case 'RESPONSE_OK': {
          return resolve();
          break;
        }
        case 'RESPONSE_ERROR': {
          return reject(response.data.message);
          break;
        }
        default: {
          return reject(`incorrect event details: { type: ${response.type} }`);
          break;
        }
      }
    });
  });
}

export async function async_requestRemoveGameFromCollection(args: { collection_name: string; game_id: string }): Promise<void> {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: 'REQUEST_REMOVE_GAME_FROM_COLLECTION', data: { collection_name: args.collection_name, game_id: args.game_id } }, (response: StorageMessage) => {
      switch (response.type) {
        case 'RESPONSE_OK': {
          return resolve();
          break;
        }
        case 'RESPONSE_ERROR': {
          return reject(response.data.message);
          break;
        }
        default: {
          return reject(`incorrect event details: { type: ${response.type} }`);
          break;
        }
      }
    });
  });
}
