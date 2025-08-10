import gamepagecollectionsmanagerhtml from '../assets/game-page-collections-manager.html' with { type: 'text' };
import { CreateEyeOffIcon, CreateHeartIcon } from './create-icons.js';
import { Core_Console_Error } from './ericchase/Core_Console_Error.js';
import { WebPlatform_Node_Reference_Class } from './ericchase/WebPlatform_Node_Reference_Class.js';
import { async_requestAddGameToCollection, async_requestGetGameCollections, async_requestRemoveGameFromCollection } from './StorageRequest.js';

const game_manager_set = new Set<HTMLDivElement>();
const game_id_to_manager_map = new Map<string, HTMLDivElement>();

const parser = new DOMParser();
export async function async_createGamePageCollectionsManager(game_id: string): Promise<HTMLDivElement> {
  const div_manager = game_id_to_manager_map.get(game_id);
  if (div_manager !== undefined) {
    return div_manager;
  } else {
    const div_manager = WebPlatform_Node_Reference_Class(parser.parseFromString(gamepagecollectionsmanagerhtml, 'text/html').querySelector('div')).as(HTMLDivElement);
    game_manager_set.add(div_manager);
    game_id_to_manager_map.set(game_id, div_manager);

    // const button_export = WebPlatform_Node_Reference_Class(div_manager.querySelector('#export')).as(HTMLButtonElement);
    // button_export.addEventListener('click', async () => {
    //   WebPlatform_Utility_Download({ json: await async_exportDatabase() }, 'collections_database.json');
    // });
    // const button_import = WebPlatform_Node_Reference_Class(div_manager.querySelector('#import')).as(HTMLButtonElement);
    // button_import.addEventListener('click', async () => {
    //   const json = await Async_WebPlatform_Utility_Upload({ ext_or_mime: 'application/json' });
    //   if (json !== undefined) {
    //     await async_importDatabase(json);
    //   }
    // });

    const game_collection_set = await async_requestGetGameCollections({ game_id });
    const createCollectionIcon = (collection_name: string, constructor: () => SVGElement) => {
      const icon = constructor();
      div_manager.appendChild(icon);
      icon.addEventListener('click', async () => {
        switch (updateGamePageCollectionsManager({ collection_name, game_id })) {
          case true:
            await async_requestAddGameToCollection({ collection_name, game_id });
            break;
          case false:
            await async_requestRemoveGameFromCollection({ collection_name, game_id });
            break;
        }
      });
      updateGamePageCollectionsManager({ collection_name, game_id }, game_collection_set.has(collection_name));
    };

    createCollectionIcon('favorites', CreateHeartIcon);
    createCollectionIcon('hidden', CreateEyeOffIcon);
    return div_manager;
  }
}

export async function async_showGamePageCollectionsManager(ul_user_tools: HTMLUListElement, game_id: string): Promise<void> {
  const div_manager = await async_createGamePageCollectionsManager(game_id);
  ul_user_tools.after(div_manager);
}

export function updateGamePageCollectionsManager(args: { collection_name: string; game_id: string }, force_value?: boolean): boolean | undefined {
  const div_manager = game_id_to_manager_map.get(args.game_id);
  if (div_manager !== undefined) {
    try {
      const updateCollectionIcon = (icon: SVGElement) => {
        if (icon.classList.contains('toggled')) {
          if (force_value === false || force_value === undefined) {
            icon.classList.remove('toggled');
            return false;
          }
          return true;
        } else {
          if (force_value === true || force_value === undefined) {
            icon.classList.add('toggled');
            return true;
          }
          return false;
        }
      };
      switch (args.collection_name) {
        case 'favorites':
          return updateCollectionIcon(WebPlatform_Node_Reference_Class(div_manager.querySelector('&>svg.heart-icon')).as(SVGElement));
        case 'hidden':
          return updateCollectionIcon(WebPlatform_Node_Reference_Class(div_manager.querySelector('&>svg.eye-off-icon')).as(SVGElement));
      }
    } catch (error) {
      Core_Console_Error(error);
    }
  }
}
