/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-alert */
import FavRestoIdb from '../../data/resto-idb';

const Detail = {
  async render() {
    const url = window.location.hash;
    const id = url.split('/')[2];
    const restaurantDetail = await this.getRestaurantDetail(id);
    return restaurantDetail.detailHtml;
  },

  async afterRender() {
    const url = window.location.hash;
    const id = url.split('/')[2];

    const likeButton = document.getElementById('likeButton');
    const heartIcon = likeButton.querySelector('.heart-icon');

    const restaurant = await FavRestoIdb.getResto(id);
    if (restaurant) {
      heartIcon.classList.remove('ri-heart-line');
      heartIcon.classList.add('ri-heart-fill');
    }

    likeButton.addEventListener('click', async () => {
      const restaurantDetail = await this.getRestaurantDetail(id);
      if (!restaurant) {
        await FavRestoIdb.putResto(restaurantDetail);
        heartIcon.classList.remove('ri-heart-line');
        heartIcon.classList.add('ri-heart-fill');
      } else {
        await FavRestoIdb.deleteResto(id);
        heartIcon.classList.remove('ri-heart-fill');
        heartIcon.classList.add('ri-heart-line');
      }
    });

    this.initReviewForm(id);
  },

  initReviewForm(id) {
    const form = document.getElementById('addReviewForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('reviewerName').value;
      const review = document.getElementById('reviewContent').value;

      if (name && review) {
        try {
          const response = await fetch('https://restaurant-api.dicoding.dev/review', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id,
              name,
              review,
            }),
          });

          if (response.ok) {
            form.reset();
            this.updateReviews(id);
          } else {
            console.error('Failed to submit review:', response.statusText);
          }
        } catch (error) {
          console.error('Failed to submit review:', error);
        }
      }
    });
  },

  async updateReviews(id) {
    try {
      const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${id}`);
      const data = await response.json();
      const { customerReviews } = data.restaurant;
      const reviewList = document.querySelector('.review-list');
      reviewList.innerHTML = customerReviews.map((review) => `<li class="review-item"><strong>${review.name}</strong>: ${review.review}</li>`).join('');
    } catch (error) {
      console.error('Failed to update reviews:', error);
    }
  },

  async getRestaurantDetail(restaurantId) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';

    try {
      const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${restaurantId}`);
      const data = await response.json();
      const { restaurant } = data;
      const imageUrl = restaurant.pictureId ? `https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}` : 'https://via.placeholder.com/600x400?text=No+Image+Available';

      return {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        city: restaurant.city,
        address: restaurant.address,
        pictureId: restaurant.pictureId,
        rating: restaurant.rating,
        categories: restaurant.categories,
        menus: restaurant.menus,
        customerReviews: restaurant.customerReviews,
        detailHtml: `
          <div class="restaurant-detail">
            <div class="detail-box">
              <h2>${restaurant.name}</h2>
              <div class="rating">
                <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
                </svg>
                <p>${restaurant.rating}</p>
              </div>
              <img class="lazyload" id="restaurant-image" data-src="${imageUrl}" alt="${restaurant.name}">
              <p class="description">${restaurant.description}</p>
              <p class="city">City: ${restaurant.city}</p>
              <p class="address">Address: ${restaurant.address}</p>
              ${restaurant.categories ? `<div class="categories">${restaurant.categories.map((category) => `<span>${category.name}</span>`).join(' ')}</div>` : ''}
              <button id="likeButton" class="like-button" tabindex="0" aria-label="Like this restaurant">
                <i class="ri-heart-line heart-icon"></i>
              </button>
            </div>
            <div class="menu-box">
              <h3>Menu Makanan:</h3>
              <ul class="menu-list">
                ${restaurant.menus.foods.map((food) => `<li class="menu-item">${food.name}</li>`).join('')}
              </ul>
              <h3>Menu Minuman:</h3>
              <ul class="menu-list">
                ${restaurant.menus.drinks.map((drink) => `<li class="menu-item">${drink.name}</li>`).join('')}
              </ul>
            </div>
            <div class="review-box">
              <h3>Customer Reviews:</h3>
              <ul class="review-list">
                ${restaurant.customerReviews.map((review) => `<li class="review-item"><strong>${review.name}</strong>: ${review.review}</li>`).join('')}
              </ul>
            </div>
            <div class="add-review-box">
              <h3>Add a Review:</h3>
              <form id="addReviewForm">
                <input type="text" id="reviewerName" tabindex="0" placeholder="Your Name" required>
                <textarea id="reviewContent" tabindex="0" placeholder="Your Review" required></textarea>
                <button type="submit" tabindex="0">Submit Review</button>
              </form>
            </div>
          </div>
        `,
      };
    } catch (error) {
      console.error('Failed to fetch restaurant details:', error);
      return {
        detailHtml: '<p class="error-message">Failed to load restaurant details. Please try again later.</p>',
      };
    } finally {
      loadingElement.style.display = 'none';
    }
  },
};

export default Detail;
