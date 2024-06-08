/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
const Home = {
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
    searchInput.addEventListener('input', searchRestaurants);
    searchInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        searchRestaurants();
      }
    });
    searchInput.addEventListener('keyup', (event) => {
      if (event.key === 'Backspace' && searchInput.value.trim() === '') {
        displayRestaurants();
      }
    });

    loading.style.display = 'block';
    await displayRestaurants();
    loading.style.display = 'none';
  },
};

async function displayRestaurants() {
  const loading = document.getElementById('loading');
  loading.style.display = 'block';
  try {
    const response = await fetch('https://restaurant-api.dicoding.dev/list');
    const data = await response.json();
    const restaurantList = document.querySelector('.restaurant-list');
    restaurantList.innerHTML = '';

    data.restaurants.forEach((restaurant) => {
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
  } catch (error) {
    console.error('Error fetching and displaying restaurant data:', error);
    const restaurantList = document.querySelector('.restaurant-list');
    restaurantList.innerHTML = '<p class="error-message">Failed to load restaurants. Please try again later.</p>';
  } finally {
    loading.style.display = 'none';
  }
}

async function searchRestaurants() {
  const loading = document.getElementById('loading');
  loading.style.display = 'block';
  try {
    const input = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!input) {
      await displayRestaurants();
      return;
    }

    const response = await fetch(`https://restaurant-api.dicoding.dev/search?q=${input}`);
    const data = await response.json();
    const restaurantList = document.querySelector('.restaurant-list');
    restaurantList.innerHTML = '';

    if (data.restaurants.length === 0) {
      restaurantList.innerHTML = '<p class="error-message" tabindex="0">No restaurants found....</p>';
    } else {
      data.restaurants.forEach((restaurant) => {
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
    console.error('Error fetching and displaying search results:', error);
    const restaurantList = document.querySelector('.restaurant-list');
    restaurantList.innerHTML = '<p class="error-message">Failed to search restaurants. Please try again later.</p>';
  } finally {
    loading.style.display = 'none';
  }
}

export default Home;
