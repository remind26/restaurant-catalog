/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const assert = require('assert');

Feature('Review Resto');

Before(({ I }) => {
  I.amOnPage('/');
});

Scenario('Post resto review', async ({ I }) => {
  const reviewText = 'Delicious';

  I.seeElement('restaurant-item');
  I.click(locate('restaurant-item').first());

  I.seeElement('.add-review-box form');
  I.fillField('#reviewerName', 'E2E Testing');
  I.fillField('#reviewContent', reviewText);
  I.click('button[type=submit]');

  const lastReview = locate('.review-item').last();
  const lastReviewText = await I.grabTextFrom(lastReview);
  assert.strictEqual(`E2E Testing: ${reviewText}`, lastReviewText.trim());
});
