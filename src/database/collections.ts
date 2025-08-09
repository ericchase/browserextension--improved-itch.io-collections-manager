import Dexie from 'dexie';

class CollectionsDB extends Dexie {
  games: Dexie.Table<{ id: string }, string>;
  collections: Dexie.Table<{ name: string }, string>;
  collectionGames: Dexie.Table<{ collectionName: string; gameId: string }, [string, string]>;

  constructor() {
    super(CollectionsDB.name.toLowerCase());

    this.version(1).stores({});

    this.version(2)
      .stores({
        games: '&id',
        collections: '&name',
        collectionGames: '[collectionName+gameId], collectionName, gameId',
      })
      .upgrade(async () => {});

    this.games = this.table('games');
    this.collections = this.table('collections');
    this.collectionGames = this.table('collectionGames');
  }
}

const db = new CollectionsDB();

export async function async_initCollectionsDatabase() {
  await db.open();
}

export async function async_addCollection(args: { collection_name: string }): Promise<void> {
  await db.collections.put({ name: args.collection_name });
}

export async function async_removeCollection(args: { collection_name: string }): Promise<void> {
  await db.transaction('rw', db.collections, db.collectionGames, async () => {
    await db.collections.delete(args.collection_name);
    await db.collectionGames.where('collectionName').equals(args.collection_name).delete();
  });
}

export async function async_addGameToCollection(args: { collection_name: string; game_id: string }): Promise<void> {
  await db.transaction('rw', db.games, db.collections, db.collectionGames, async () => {
    if ((await db.collections.get(args.collection_name)) === undefined) {
      await db.collections.put({ name: args.collection_name });
    }
    if ((await db.games.get(args.game_id)) === undefined) {
      await db.games.put({ id: args.game_id });
    }
    await db.collectionGames.put({ collectionName: args.collection_name, gameId: args.game_id });
  });
}

export async function async_getGameCollections(args: { game_id: string }): Promise<Set<string>> {
  const collectionGames_records = await db.collectionGames.where('gameId').equals(args.game_id).toArray();
  const collection_names = collectionGames_records.map((record) => record.collectionName);
  if (collection_names.length === 0) {
    return new Set<string>();
  }
  const collections_records = await db.collections.where('name').anyOf(collection_names).toArray();
  return new Set<string>(collections_records.map((record) => record.name));
}

export async function async_removeGameFromCollection(args: { collection_name: string; game_id: string }): Promise<void> {
  await db.transaction('rw', db.games, db.collectionGames, async () => {
    await db.collectionGames.delete([args.collection_name, args.game_id]);
    if ((await db.collectionGames.where('gameId').equals(args.game_id).count()) === 0) {
      await db.games.delete(args.game_id);
    }
  });
}
