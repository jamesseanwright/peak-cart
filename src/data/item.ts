import createInMemoryDataStore from './dataStore';

interface Price {
  currencyCode: string;
  amount: string;
}

export interface Item {
  title: string;
  price: Price;
}

/* Note we populate the store
 * with hard-coded for
 * deterministic e2e tests. */
const stubItems: [string, Item][] = [
  [
    'a9e9c933-eda2-4f45-92c0-33d6c1b495d8',
    {
      title: 'The Testaments',
      price: {
        currencyCode: 'GBP',
        amount: '10.00',
      },
    },
  ],

  [
    'c1e435ad-f32b-4b6d-a3d4-bb6897eaa9ce',
    {
      title: 'Half a World Away',
      price: {
        currencyCode: 'GBP',
        amount: '9.35',
      },
    },
  ],

  [
    '48d17256-b109-4129-9274-0bff8b2db2d2',
    {
      title: 'Echo Burning',
      price: {
        currencyCode: 'GBP',
        amount: '29.84',
      },
    },
  ],

  [
    'df2555ad-7dc2-4b1f-b422-766184b5c925',
    {
      title: ' The Institute',
      price: {
        currencyCode: 'GBP',
        amount: '10.99',
      },
    },
  ],
];

export const createItemStore = () => {
  const store = createInMemoryDataStore<Item>();

  stubItems.forEach(([id, data]) => store.save(data, id));

  return store;
};
