import createInMemoryDataStore, { Entity } from "./dataStore";

export interface Cart {
  items: Entity[];
}

export const cartStore = createInMemoryDataStore<Cart>();
