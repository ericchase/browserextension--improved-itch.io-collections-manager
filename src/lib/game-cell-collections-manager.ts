import collectionsmanagerhtml from '../assets/game-cell-collections-manager.html' with { type: 'text' };
import { WebPlatform_Node_Reference_Class } from './ericchase/WebPlatform_Node_Reference_Class.js';
import { WebPlatform_Utility_Download } from './ericchase/WebPlatform_Utility_Download.js';
import { Async_WebPlatform_Utility_Upload } from './ericchase/WebPlatform_Utility_Upload.js';
import { async_requestExportDatabase, async_requestImportDatabase } from './StorageRequest.js';

let div_manager: HTMLDivElement | undefined = undefined;
const parser = new DOMParser();

export function createGameCellCollectionsManager(): HTMLDivElement {
  const div_manager = WebPlatform_Node_Reference_Class(parser.parseFromString(collectionsmanagerhtml, 'text/html').querySelector('div')).as(HTMLDivElement);
  const button_export = WebPlatform_Node_Reference_Class(div_manager.querySelector('#export')).as(HTMLButtonElement);
  button_export.addEventListener('click', async () => {
    WebPlatform_Utility_Download({ json: await async_requestExportDatabase() }, 'collections_database.json');
  });
  const button_import = WebPlatform_Node_Reference_Class(div_manager.querySelector('#import')).as(HTMLButtonElement);
  button_import.addEventListener('click', async () => {
    const json = await Async_WebPlatform_Utility_Upload({ ext_or_mime: 'application/json' });
    if (json !== undefined) {
      await async_requestImportDatabase(json);
    }
  });
  return div_manager;
}

export function showGameCellCollectionsManager(): void {
  if (div_manager === undefined) {
    div_manager = createGameCellCollectionsManager();
    document.body.appendChild(div_manager);
  }
  if (div_manager !== undefined) {
    div_manager.classList.remove('hidden');
  }
}
