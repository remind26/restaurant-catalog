/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const LikeButtonPresenter = {
  async init({ likeButtonContainer, favoriteResto, restaurant }) {
    this._likeButtonContainer = likeButtonContainer;
    this._restaurant = restaurant;
    this._favoriteResto = favoriteResto;

    await this._renderButton();
  },

  async _renderButton() {
    const { id } = this._restaurant;

    if (await this._isRestaurantExist(id)) {
      this._renderLiked();
    } else {
      this._renderLike();
    }
  },

  async _isRestaurantExist(id) {
    const restaurant = await this._favoriteResto.getResto(id);
    return !!restaurant;
  },

  _renderLike() {
    this._likeButtonContainer.innerHTML = `
      <button aria-label="Like this restaurant" id="likeButton">
        <i class="ri-heart-line heart-icon"></i>
      </button>
    `;

    const likeButton = document.querySelector('#likeButton');
    likeButton.addEventListener('click', async () => {
      await this._favoriteResto.putResto(this._restaurant);
      this._renderButton();
    });
  },

  _renderLiked() {
    this._likeButtonContainer.innerHTML = `
      <button aria-label="Unlike this restaurant" id="likeButton">
        <i class="ri-heart-fill heart-icon"></i>
      </button>
    `;

    const likeButton = document.querySelector('#likeButton');
    likeButton.addEventListener('click', async () => {
      await this._favoriteResto.deleteResto(this._restaurant.id);
      this._renderButton();
    });
  },
};

export default LikeButtonPresenter;
