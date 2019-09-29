import { Item } from "./item";
import createInMemoryDataStore from "./dataStore";

export interface Cart {
  items: Item[];
}

export const cartStore = createInMemoryDataStore<Cart>();
