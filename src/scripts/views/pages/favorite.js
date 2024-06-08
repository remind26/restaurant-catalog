/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-useless-path-segments */
import FavRestoIdb from '../../data/resto-idb';
import '../../views/components/restaurant-item';

const Favorite = {
  async render() {
    return `
      <div class="search-container">
        <input type="text" id="searchInput" placeholder="Search restaurant..." tabindex="0"></div>
      <div class="restaurant-list" id="restaurant-list" tabindex="-1"></div>
    `;
  },

  async afterRender() {
    const skipLink = document.querySelector('.skip-link');
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.getElementById(skipLink.getAttribute('href').slice(1));
      if (target) {
        target.focus();
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth',
        });
      }
    });
    const searchInput = document.getElementById('searchInput');
    const loading = document.getElementById('loading');

    searchInput.addEventListener('input', searchFavoriteRestaurants);
    searchInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        searchFavoriteRestaurants();
      }
    });
    searchInput.addEventListener('keyup', (event) => {
      if (event.key === 'Backspace' && searchInput.value.trim() === '') {
        displayFavoriteRestaurants();
      }
    });

    loading.style.display = 'block';
    await displayFavoriteRestaurants();
    loading.style.display = 'none';
  },
};

async function displayFavoriteRestaurants() {
  const loading = document.getElementById('loading');
  loading.style.display = 'block';
  try {
    const favoriteRestaurants = await FavRestoIdb.getAllResto();
    const restaurantList = document.querySelector('.restaurant-list');
    restaurantList.innerHTML = '';

    if (favoriteRestaurants.length === 0) {
      restaurantList.innerHTML = '<p class="error-message">No favorite restaurants found.</p>';
    } else {
      favoriteRestaurants.forEach((restaurant) => {
        const restaurantElement = document.createElement('restaurant-item');
        restaurantElement.restaurant = restaurant;
        restaurantElement.addEventListener('click', () => {
          window.location.hash = `#/detail/${restaurant.id}`;
        });

        restaurantElement.addEventListener('keyup', (event) => {
          if (event.key === 'Enter') {
            window.location.hash = `#/detail/${restaurant.id}`;
          }
        });

        restaurantList.appendChild(restaurantElement);
      });
    }
  } catch (error) {
    console.error('Error fetching and displaying favorite restaurants:', error);
    const restaurantList = document.querySelector('.restaurant-list');
    restaurantList.innerHTML = '<p class="error-message">Failed to load favorite restaurants. Please try again later.</p>';
  } finally {
    loading.style.display = 'none';
  }
}

async function searchFavoriteRestaurants() {
  const loading = document.getElementById('loading');
  loading.style.display = 'block';
  try {
    const input = document.getElementById('searchInput').value.trim().toLowerCase();
    const favoriteRestaurants = await FavRestoIdb.getAllResto();
    const filteredRestaurants = favoriteRestaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(input));
    const restaurantList = document.querySelector('.restaurant-list');
    restaurantList.innerHTML = '';

    if (filteredRestaurants.length === 0) {
      restaurantList.innerHTML = '<p class="error-message" tabindex="0">No favorite restaurants found...</p>';
    } else {
      filteredRestaurants.forEach((restaurant) => {
        const restaurantElement = document.createElement('restaurant-item');
        restaurantElement.restaurant = restaurant;
        restaurantElement.addEventListener('click', () => {
          window.location.hash = `#/detail/${restaurant.id}`;
        });

        restaurantElement.addEventListener('keyup', (event) => {
          if (event.key === 'Enter') {
            window.location.hash = `#/detail/${restaurant.id}`;
          }
        });

        restaurantList.appendChild(restaurantElement);
      });
    }
  } catch (error) {
    console.error('Error searching favorite restaurants:', error);
    const restaurantList = document.querySelector('.restaurant-list');
    restaurantList.innerHTML = '<p class="error-message">Failed to search favorite restaurants. Please try again later.</p>';
  } finally {
    loading.style.display = 'none';
  }
}

export default Favorite;
