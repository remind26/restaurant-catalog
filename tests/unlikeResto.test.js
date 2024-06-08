/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
import { createLikeButtonPresenterWithResto } from './helpers/testFactories';
import FavRestoIdb from '../src/scripts/data/resto-idb';

describe('Unliking A Restaurant', () => {
  const addLikeButtonContainer = () => {
    document.body.innerHTML = '<div id="likeButtonContainer"></div>';
  };

  beforeEach(async () => {
    addLikeButtonContainer();
    await FavRestoIdb.putResto({ id: 1 });
  });

  afterEach(async () => {
    await FavRestoIdb.deleteResto(1);
  });

  it('should display unlike widget when the restaurant has been liked', async () => {
    await createLikeButtonPresenterWithResto({ id: 1 });

    expect(document.querySelector('[aria-label="Unlike this restaurant"]'))
      .toBeTruthy();
  });

  it('should be able to remove liked restaurant from the list', async () => {
    await createLikeButtonPresenterWithResto({ id: 1 });

    document.querySelector('[aria-label="Unlike this restaurant"]').dispatchEvent(new Event('click'));

    expect(await FavRestoIdb.getResto(1)).toBeUndefined();
  });
});
