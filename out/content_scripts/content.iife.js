(() => {

// src/lib/ericchase/WebPlatform_DOM_ReadyState_Callback.ts
async function Async_WebPlatform_DOM_ReadyState_Callback(config) {
  async function DOMContentLoaded() {
    removeEventListener("DOMContentLoaded", DOMContentLoaded);
    await config.DOMContentLoaded?.();
  }
  async function load() {
    removeEventListener("load", load);
    await config.load?.();
  }
  switch (document.readyState) {
    case "loading":
      if (config.DOMContentLoaded !== undefined) {
        addEventListener("DOMContentLoaded", DOMContentLoaded);
      }
      if (config.load !== undefined) {
        addEventListener("load", load);
      }
      break;
    case "interactive":
      await config.DOMContentLoaded?.();
      if (config.load !== undefined) {
        addEventListener("load", load);
      }
      break;
    case "complete":
      await config.DOMContentLoaded?.();
      await config.load?.();
      break;
  }
}

// src/assets/icons/eye-off.svg
var eye_off_default = `<!-- https://lucide.dev/icons/eye-off -->
<!--
Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part
of Feather (MIT). All other copyright (c) for Lucide are held by Lucide
Contributors 2022.
-->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off">
  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
  <path d="m2 2 20 20" />
</svg>
`;

// src/assets/icons/heart.svg
var heart_default = `<!-- https://lucide.dev/icons/heart -->\r
<!--\r
Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part\r
of Feather (MIT). All other copyright (c) for Lucide are held by Lucide\r
Contributors 2022.\r
-->\r
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart">\r
  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />\r
</svg>\r
`;

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

// src/lib/create-icons.ts
var parser = new DOMParser;
function CreateEyeOffIcon() {
  const svg = WebPlatform_Node_Reference_Class(parser.parseFromString(eye_off_default, "text/html").querySelector("svg")).as(SVGElement);
  svg.classList.add("eye-off-icon");
  return svg;
}
function CreateHeartIcon() {
  const svg = WebPlatform_Node_Reference_Class(parser.parseFromString(heart_default, "text/html").querySelector("svg")).as(SVGElement);
  svg.classList.add("heart-icon");
  return svg;
}

// src/lib/ericchase/Core_Console_Error.ts
function Core_Console_Error(...items) {
  console["error"](...items);
}

// src/lib/ericchase/Core_Map_Get_Or_Default.ts
function Core_Map_Get_Or_Default(map, key, newValue) {
  if (map.has(key)) {
    return map.get(key);
  }
  const value = newValue();
  map.set(key, value);
  return value;
}

// src/lib/ericchase/WebPlatform_DOM_Element_Added_Observer_Class.ts
class Class_WebPlatform_DOM_Element_Added_Observer_Class {
  constructor(config) {
    config.include_existing_elements ??= true;
    config.options ??= {};
    config.options.subtree ??= true;
    config.source ??= document.documentElement;
    this.mutationObserver = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        if (record.target instanceof Element && record.target.matches(config.selector)) {
          this.send(record.target);
        }
        const treeWalker = document.createTreeWalker(record.target, NodeFilter.SHOW_ELEMENT);
        while (treeWalker.nextNode()) {
          if (treeWalker.currentNode.matches(config.selector)) {
            this.send(treeWalker.currentNode);
          }
        }
      }
    });
    this.mutationObserver.observe(config.source, {
      childList: true,
      subtree: config.options.subtree ?? true
    });
    if (config.include_existing_elements === true) {
      const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT);
      while (treeWalker.nextNode()) {
        if (treeWalker.currentNode.matches(config.selector)) {
          this.send(treeWalker.currentNode);
        }
      }
    }
  }
  disconnect() {
    this.mutationObserver.disconnect();
    for (const callback of this.subscriptionSet) {
      this.subscriptionSet.delete(callback);
    }
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    let abort = false;
    for (const element of this.matchSet) {
      callback(element, () => {
        this.subscriptionSet.delete(callback);
        abort = true;
      });
      if (abort)
        return () => {};
    }
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  mutationObserver;
  matchSet = new Set;
  subscriptionSet = new Set;
  send(element) {
    if (!this.matchSet.has(element)) {
      this.matchSet.add(element);
      for (const callback of this.subscriptionSet) {
        callback(element, () => {
          this.subscriptionSet.delete(callback);
        });
      }
    }
  }
}
function WebPlatform_DOM_Element_Added_Observer_Class(config) {
  return new Class_WebPlatform_DOM_Element_Added_Observer_Class(config);
}

// src/assets/game-cell-collections-manager.html
var game_cell_collections_manager_default = `<div class="game-cell-collections-manager hidden">
  <button id="export">export</button>
  <button id="import">import</button>
</div>
`;

// src/lib/ericchase/WebPlatform_Utility_Download.ts
function WebPlatform_Utility_Download(data, filename) {
  const dataurl = (() => {
    if (data.blob !== undefined) {
      return URL.createObjectURL(data.blob);
    }
    if (data.bytes !== undefined) {
      return URL.createObjectURL(new Blob([data.bytes.slice()], { type: "application/octet-stream;charset=utf-8" }));
    }
    if (data.json !== undefined) {
      return URL.createObjectURL(new Blob([data.json], { type: "application/json;charset=utf-8" }));
    }
    if (data.text !== undefined) {
      return URL.createObjectURL(new Blob([data.text], { type: "text/plain;charset=utf-8" }));
    }
    if (data.url !== undefined) {
      return data.url;
    }
  })();
  if (dataurl !== undefined) {
    const anchor = document.createElement("a");
    anchor.setAttribute("download", filename);
    anchor.setAttribute("href", dataurl);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}

// src/lib/ericchase/WebPlatform_Utility_Upload.ts
async function Async_WebPlatform_Utility_Upload(options) {
  return new Promise((resolve, reject) => {
    options ??= {};
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    if (options.ext_or_mime !== undefined) {
      input.setAttribute("accept", options.ext_or_mime);
    }
    input.style.setProperty("display", "none");
    input.addEventListener("error", async (event) => {
      reject(event.error);
    });
    input.addEventListener("change", async () => {
      resolve(await input.files?.[0]?.text());
    });
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}

// src/lib/StorageRequest.ts
function sendMessage(message, cb) {
  chrome.runtime.sendMessage(message, cb);
}
function async_requestExportDatabase() {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: "REQUEST_EXPORT_DATABASE" }, (response) => {
      switch (response.type) {
        case "RESPONSE_DATABASE_JSON": {
          return resolve(response.data.json);
          break;
        }
        case "RESPONSE_ERROR": {
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
function async_requestImportDatabase(json) {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: "REQUEST_IMPORT_DATABASE", data: { json } }, (response) => {
      switch (response.type) {
        case "RESPONSE_OK": {
          return resolve();
          break;
        }
        case "RESPONSE_ERROR": {
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
function async_requestGetGameCollections(args) {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: "REQUEST_GET_GAME_COLLECTIONS", data: { game_id: args.game_id } }, (response) => {
      switch (response.type) {
        case "RESPONSE_GAME_COLLECTIONS": {
          return resolve(new Set(response.data.collection_names));
          break;
        }
        case "RESPONSE_ERROR": {
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
async function async_requestAddGameToCollection(args) {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: "REQUEST_ADD_GAME_TO_COLLECTION", data: { collection_name: args.collection_name, game_id: args.game_id } }, (response) => {
      switch (response.type) {
        case "RESPONSE_OK": {
          return resolve();
          break;
        }
        case "RESPONSE_ERROR": {
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
async function async_requestRemoveGameFromCollection(args) {
  return new Promise(async (resolve, reject) => {
    sendMessage({ type: "REQUEST_REMOVE_GAME_FROM_COLLECTION", data: { collection_name: args.collection_name, game_id: args.game_id } }, (response) => {
      switch (response.type) {
        case "RESPONSE_OK": {
          return resolve();
          break;
        }
        case "RESPONSE_ERROR": {
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

// src/lib/game-cell-collections-manager.ts
var div_manager = undefined;
var parser2 = new DOMParser;
function createGameCellCollectionsManager() {
  const div_manager2 = WebPlatform_Node_Reference_Class(parser2.parseFromString(game_cell_collections_manager_default, "text/html").querySelector("div")).as(HTMLDivElement);
  const button_export = WebPlatform_Node_Reference_Class(div_manager2.querySelector("#export")).as(HTMLButtonElement);
  button_export.addEventListener("click", async () => {
    WebPlatform_Utility_Download({ json: await async_requestExportDatabase() }, "collections_database.json");
  });
  const button_import = WebPlatform_Node_Reference_Class(div_manager2.querySelector("#import")).as(HTMLButtonElement);
  button_import.addEventListener("click", async () => {
    const json = await Async_WebPlatform_Utility_Upload({ ext_or_mime: "application/json" });
    if (json !== undefined) {
      await async_requestImportDatabase(json);
    }
  });
  return div_manager2;
}
function showGameCellCollectionsManager() {
  if (div_manager === undefined) {
    div_manager = createGameCellCollectionsManager();
    document.body.appendChild(div_manager);
  }
  if (div_manager !== undefined) {
    div_manager.classList.remove("hidden");
  }
}

// src/lib/game-cell.ts
var game_cell_selector = "div.game_cell";
var game_cell_thumbnail_container_selector = "div:is(.bordered,.game_thumb):has(a:is(.game_thumb,a.game_link))";
var game_cell_title_container_selector = "div:is(.game_title,.label):has(a.title)";
var game_cell_title_selector = "a.title";
var game_id_dataset_key = "data-game_id";
var game_cell_set = new Set;
var game_id_to_cells_map = new Map;
function setupGameCellObserver() {
  WebPlatform_DOM_Element_Added_Observer_Class({
    selector: game_cell_selector
  }).subscribe(async (div_game_cell) => {
    if (div_game_cell instanceof HTMLDivElement) {
      await async_processGameCell(WebPlatform_Node_Reference_Class(div_game_cell).as(HTMLDivElement));
    }
  });
}
async function async_processGameCell(game_cell) {
  const game_id = game_cell.getAttribute(game_id_dataset_key) ?? undefined;
  if (game_id !== undefined) {
    await async_setupGameCell(game_cell, game_id);
  }
}
async function async_setupGameCell(game_cell, game_id) {
  if (game_cell_set.has(game_cell) === false) {
    try {
      game_cell_set.add(game_cell);
      Core_Map_Get_Or_Default(game_id_to_cells_map, game_id, () => []).push(game_cell);
      const a_title = WebPlatform_Node_Reference_Class(game_cell.querySelector(game_cell_title_selector)).as(HTMLAnchorElement);
      const div_thumbnail_container = WebPlatform_Node_Reference_Class(game_cell.querySelector(game_cell_thumbnail_container_selector)).as(HTMLDivElement);
      const game_collection_set = await async_requestGetGameCollections({ game_id });
      const createCollectionIcon = (collection_name, constructor) => {
        const icon = constructor();
        a_title.before(icon);
        icon.addEventListener("click", async () => {
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
      createCollectionIcon("favorites", CreateHeartIcon);
      createCollectionIcon("hidden", CreateEyeOffIcon);
      {
        const button_open_manager = document.createElement("button");
        button_open_manager.textContent = "manager";
        button_open_manager.style.position = "absolute";
        button_open_manager.style.bottom = "0.5em";
        button_open_manager.style.right = "0.5em";
        button_open_manager.addEventListener("click", () => {
          showGameCellCollectionsManager();
        });
        div_thumbnail_container.appendChild(button_open_manager);
      }
    } catch (error) {
      Core_Console_Error(error);
    }
  }
}
function updateGameCells(args, force_value) {
  for (const game_cell of game_id_to_cells_map.get(args.game_id) ?? []) {
    try {
      const div_title_container = WebPlatform_Node_Reference_Class(game_cell.querySelector(game_cell_title_container_selector)).as(HTMLElement);
      const updateCollectionIcon = (collection_name, icon) => {
        if (icon.classList.contains("toggled")) {
          if (force_value === false || force_value === undefined) {
            icon.classList.remove("toggled");
            game_cell.classList.remove(`collection-${collection_name}`);
            return false;
          }
          return true;
        } else {
          if (force_value === true || force_value === undefined) {
            icon.classList.add("toggled");
            game_cell.classList.add(`collection-${collection_name}`);
            return true;
          }
          return false;
        }
      };
      switch (args.collection_name) {
        case "favorites":
          return updateCollectionIcon(args.collection_name, WebPlatform_Node_Reference_Class(div_title_container.querySelector("&>svg.heart-icon")).as(SVGElement));
        case "hidden":
          return updateCollectionIcon(args.collection_name, WebPlatform_Node_Reference_Class(div_title_container.querySelector("&>svg.eye-off-icon")).as(SVGElement));
      }
    } catch (error) {
      Core_Console_Error(error);
    }
  }
}

// src/assets/game-page-collections-manager.html
var game_page_collections_manager_default = `<div class="game-page-collections-manager">
  <div class="main"></div>
</div>
`;

// src/lib/game-page-collections-manager.ts
var game_manager_set = new Set;
var game_id_to_manager_map = new Map;
var parser3 = new DOMParser;
async function async_createGamePageCollectionsManager(game_id) {
  const div_manager2 = game_id_to_manager_map.get(game_id);
  if (div_manager2 !== undefined) {
    return div_manager2;
  } else {
    const div_manager3 = WebPlatform_Node_Reference_Class(parser3.parseFromString(game_page_collections_manager_default, "text/html").querySelector("div")).as(HTMLDivElement);
    const div_manager_panel = WebPlatform_Node_Reference_Class(div_manager3.querySelector("& > div.main")).as(HTMLDivElement);
    game_manager_set.add(div_manager3);
    game_id_to_manager_map.set(game_id, div_manager3);
    const game_collection_set = await async_requestGetGameCollections({ game_id });
    const createCollectionIcon = (collection_name, constructor) => {
      const icon = constructor();
      div_manager_panel.appendChild(icon);
      icon.addEventListener("click", async () => {
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
    createCollectionIcon("favorites", CreateHeartIcon);
    createCollectionIcon("hidden", CreateEyeOffIcon);
    return div_manager3;
  }
}
async function async_showGamePageCollectionsManager(ul_user_tools, game_id) {
  const div_manager2 = await async_createGamePageCollectionsManager(game_id);
  ul_user_tools.after(div_manager2);
}
function updateGamePageCollectionsManager(args, force_value) {
  const div_manager2 = game_id_to_manager_map.get(args.game_id);
  if (div_manager2 !== undefined) {
    try {
      const updateCollectionIcon = (icon) => {
        if (icon.classList.contains("toggled")) {
          if (force_value === false || force_value === undefined) {
            icon.classList.remove("toggled");
            return false;
          }
          return true;
        } else {
          if (force_value === true || force_value === undefined) {
            icon.classList.add("toggled");
            return true;
          }
          return false;
        }
      };
      switch (args.collection_name) {
        case "favorites":
          return updateCollectionIcon(WebPlatform_Node_Reference_Class(div_manager2.querySelector("& > div.main > svg.heart-icon")).as(SVGElement));
        case "hidden":
          return updateCollectionIcon(WebPlatform_Node_Reference_Class(div_manager2.querySelector("& > div.main > svg.eye-off-icon")).as(SVGElement));
      }
    } catch (error) {
      Core_Console_Error(error);
    }
  }
}

// src/lib/game-page.ts
var game_page_meta_selector = 'meta[name="itch:path"]';
var game_page_user_tools_selector = "#user_tools";
function setupGamePageObserver() {
  WebPlatform_DOM_Element_Added_Observer_Class({
    selector: game_page_meta_selector
  }).subscribe((meta_game_id) => {
    if (meta_game_id instanceof HTMLMetaElement) {
      const game_id = meta_game_id.getAttribute("content")?.slice("games/".length);
      if (game_id !== undefined) {
        processGamePage(game_id);
      }
    }
  });
}
function processGamePage(game_id) {
  WebPlatform_DOM_Element_Added_Observer_Class({
    selector: game_page_user_tools_selector
  }).subscribe(async (ul_user_tools, unsubscribe) => {
    if (ul_user_tools instanceof HTMLUListElement) {
      unsubscribe();
      await async_setupGamePage(WebPlatform_Node_Reference_Class(ul_user_tools).as(HTMLUListElement), game_id);
    }
  });
}
async function async_setupGamePage(ul_user_tools, game_id) {
  await async_showGamePageCollectionsManager(ul_user_tools, game_id);
}

// src/content_scripts/content.iife.ts
Async_WebPlatform_DOM_ReadyState_Callback({
  async DOMContentLoaded() {
    setupGameCellObserver();
    setupGamePageObserver();
  }
});
function updateIcons(args, force_value) {
  updateGameCells(args, force_value);
  updateGamePageCollectionsManager(args, force_value);
}
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "REFRESH_UI") {
    for (const item of message.data) {
      updateIcons(item, item.contains);
    }
  }
});

})();
