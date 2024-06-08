/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
class RestaurantItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .restaurant {
          width: 400px;
          margin: 10px;
          height: 335px;
          background-color: #135D66; 
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease;
          position: relative;
        }

        .restaurant:hover {
          transform: translateY(-5px);
        }
        
        .restaurant img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px 8px 0 0;
        }
        
        .restaurant h2 {
          padding: 10px;
          font-size: 20px;
          color: #FFF;
          margin-top: 1em; 
        }
        
        .restaurant .rating-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, 50%);
          background-color: #125C13;
          border-radius: 25px;
          padding: 0 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 35px;
          width: 50px;
        }
        
        .restaurant .rating {
          font-size: 16px;
          color: #FFF;
          margin-left: 5px;
        }

        .restaurant .description {
          font-size: 16px;
          color: #FFF;
          padding: 0 10px 10px;
          max-width: 400px; 
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .restaurant .star-icon {
          fill: #FFF;
          width: 15px;
          height: 15px;
          margin-right: 2px;
        }
        
        @media only screen and (max-width: 470px) {
          .restaurant {
              width: 340px;
          }
        }

        @media only screen and (max-width: 470px) {
          .restaurant {
              width: 280px;
          }
        }
      </style>
      <div class="restaurant" tabindex="0">
      <img loading="lazy" alt="Restaurant Image">
        <h2></h2>
        <div class="rating-container">
          <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
          </svg>
          <p class="rating"></p>
        </div>
        <p class="description"></p>
      </div>
    `;
  }

  set restaurant(data) {
    const {
      pictureId, name, city, rating, description, id } = data;
    const imgElement = this.shadowRoot.querySelector('img');
    imgElement.src = `https://restaurant-api.dicoding.dev/images/medium/${pictureId}`;
    imgElement.alt = name;

    const h2Element = this.shadowRoot.querySelector('h2');
    h2Element.textContent = name;
    const citySpan = document.createElement('span');
    citySpan.textContent = ` - ${city}`;
    h2Element.appendChild(citySpan);

    this.shadowRoot.querySelector('.rating').textContent = rating;
    this.shadowRoot.querySelector('.description').textContent = description;
    this.setAttribute('data-id', id);
  }
}

if (!customElements.get('restaurant-item')) {
  customElements.define('restaurant-item', RestaurantItem);
}

export default RestaurantItem;
