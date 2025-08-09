export type StorageMessage =
  | {
      type: 'REQUEST_GET_GAME_COLLECTIONS';
      data: {
        game_id: string;
      };
    }
  | {
      type: 'REQUEST_ADD_GAME_TO_COLLECTION';
      data: {
        collection_name: string;
        game_id: string;
      };
    }
  | {
      type: 'REQUEST_REMOVE_GAME_FROM_COLLECTION';
      data: {
        collection_name: string;
        game_id: string;
      };
    }
  | {
      type: 'RESPONSE_GAME_COLLECTIONS';
      data: {
        collection_names: Set<string>;
      };
    }
  | {
      type: 'RESPONSE_ERROR';
      data: { message: string };
    }
  | {
      type: 'RESPONSE_OK';
      data: {};
    };
