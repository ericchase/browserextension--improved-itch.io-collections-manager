import { CreateEyeOffIcon, CreateHeartIcon } from './create-icons.js';
import { Core_Console_Error } from './ericchase/Core_Console_Error.js';
import { Core_Map_Get_Or_Default } from './ericchase/Core_Map_Get_Or_Default.js';
import { WebPlatform_DOM_Element_Added_Observer_Class } from './ericchase/WebPlatform_DOM_Element_Added_Observer_Class.js';
import { WebPlatform_Node_Reference_Class } from './ericchase/WebPlatform_Node_Reference_Class.js';
import { showGameCellCollectionsManager } from './game-cell-collections-manager.js';
import { async_requestAddGameToCollection, async_requestGetGameCollections, async_requestRemoveGameFromCollection } from './StorageRequest.js';

const game_cell_selector = 'div.game_cell';
const game_cell_thumbnail_container_selector = 'div:is(.bordered,.game_thumb):has(a:is(.game_thumb,a.game_link))';
const game_cell_title_container_selector = 'div:is(.game_title,.label):has(a.title)';
const game_cell_title_selector = 'a.title';
const game_id_dataset_key = 'data-game_id';

const game_cell_set = new Set<HTMLDivElement>();
const game_id_to_cells_map = new Map<string, HTMLDivElement[]>();

export function setupGameCellObserver(): void {
  WebPlatform_DOM_Element_Added_Observer_Class({
    selector: game_cell_selector,
  }).subscribe(async (div_game_cell) => {
    if (div_game_cell instanceof HTMLDivElement) {
      await async_processGameCell(WebPlatform_Node_Reference_Class(div_game_cell).as(HTMLDivElement));
    }
  });
}

async function async_processGameCell(game_cell: HTMLDivElement): Promise<void> {
  const game_id = game_cell.getAttribute(game_id_dataset_key) ?? undefined;
  if (game_id !== undefined) {
    await async_setupGameCell(game_cell, game_id);
  }
}

async function async_setupGameCell(game_cell: HTMLDivElement, game_id: string): Promise<void> {
  if (game_cell_set.has(game_cell) === false) {
    try {
      game_cell_set.add(game_cell);
      Core_Map_Get_Or_Default(game_id_to_cells_map, game_id, () => []).push(game_cell);

      const a_title = WebPlatform_Node_Reference_Class(game_cell.querySelector(game_cell_title_selector)).as(HTMLAnchorElement);
      const div_thumbnail_container = WebPlatform_Node_Reference_Class(game_cell.querySelector(game_cell_thumbnail_container_selector)).as(HTMLDivElement);
      const game_collection_set = await async_requestGetGameCollections({ game_id });
      const createCollectionIcon = (collection_name: string, constructor: () => SVGElement) => {
        const icon = constructor();
        a_title.before(icon);
        icon.addEventListener('click', async () => {
          switch (updateGameCells({ collection_name, game_id })) {
            case true:
              await async_requestAddGameToCollection({ collection_name, game_id });
              break;
            case false:
              await async_requestRemoveGameFromCollection({ collection_name, game_id });
              break;
          }
        });
        updateGameCells({ collection_name, game_id }, game_collection_set.has(collection_name));
      };

      createCollectionIcon('favorites', CreateHeartIcon);
      createCollectionIcon('hidden', CreateEyeOffIcon);

      // add collections manager open button
      {
        const button_open_manager = document.createElement('button');
        button_open_manager.textContent = 'manager';
        button_open_manager.style.position = 'absolute';
        button_open_manager.style.bottom = '0.5em';
        button_open_manager.style.right = '0.5em';
        button_open_manager.addEventListener('click', () => {
          showGameCellCollectionsManager();
        });
        div_thumbnail_container.appendChild(button_open_manager);
      }
    } catch (error) {
      Core_Console_Error(error);
    }
  }
}

export function updateGameCells(args: { collection_name: string; game_id: string }, force_value?: boolean): boolean | undefined {
  for (const game_cell of game_id_to_cells_map.get(args.game_id) ?? []) {
    try {
      const div_title_container = WebPlatform_Node_Reference_Class(game_cell.querySelector(game_cell_title_container_selector)).as(HTMLElement);
      const updateCollectionIcon = (collection_name: string, icon: SVGElement) => {
        if (icon.classList.contains('toggled')) {
          if (force_value === false || force_value === undefined) {
            icon.classList.remove('toggled');
            game_cell.classList.remove(`collection-${collection_name}`);
            return false;
          }
          return true;
        } else {
          if (force_value === true || force_value === undefined) {
            icon.classList.add('toggled');
            game_cell.classList.add(`collection-${collection_name}`);
            return true;
          }
          return false;
        }
      };
      switch (args.collection_name) {
        case 'favorites':
          return updateCollectionIcon(args.collection_name, WebPlatform_Node_Reference_Class(div_title_container.querySelector('&>svg.heart-icon')).as(SVGElement));
        case 'hidden':
          return updateCollectionIcon(args.collection_name, WebPlatform_Node_Reference_Class(div_title_container.querySelector('&>svg.eye-off-icon')).as(SVGElement));
      }
    } catch (error) {
      Core_Console_Error(error);
    }
  }
}
