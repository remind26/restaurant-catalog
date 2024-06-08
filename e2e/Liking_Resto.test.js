/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
const assert = require('assert');

Feature('Liking Resto');

Before(({ I }) => {
  I.amOnPage('/#/favorite');
});

Scenario('showing empty favorite restaurants', ({ I }) => {
  I.see('No favorite restaurants found.', '.error-message');
});

Scenario('adding and removing one restaurant to favorite', async ({ I }) => {
  I.see('No favorite restaurants found.', '.error-message');
  
  I.amOnPage('/');
  I.seeElement('restaurant-item');
  const firstRestaurant = locate('restaurant-item').first();
  const firstRestaurantTitle = await I.grabTextFrom('restaurant-item h2');
  I.click(firstRestaurant);

  I.seeElement('#likeButton');
  I.click('#likeButton');

  I.amOnPage('/#/favorite');
  I.refreshPage();
  I.seeElement('restaurant-item');
  const likedRestaurantTitle = await I.grabTextFrom('restaurant-item h2');
  I.click(firstRestaurant);

  I.seeElement('#likeButton');
  I.click('#likeButton');
    
  I.amOnPage('/#/favorite');

  I.see('No favorite restaurants found.', '.error-message');
  assert.equal(firstRestaurantTitle, likedRestaurantTitle);
});
