/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
import { itActsAsFavoriteRestoModel } from './contract/favRestoContract';
import FavRestoIdb from '../src/scripts/data/resto-idb';

describe('Favorite Resto Idb Contract Test Implementation', () => {
  afterEach(async () => {
    (await FavRestoIdb.getAllResto()).forEach(async (restaurant) => {
      await FavRestoIdb.deleteResto(restaurant.id);
    });
  });

  itActsAsFavoriteRestoModel(FavRestoIdb);
});
