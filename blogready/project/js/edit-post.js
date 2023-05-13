import { refreshTokenIfNeeded } from './token.js';

refreshTokenIfNeeded()
const token = localStorage.getItem('token-access');

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

const url = `http://127.0.0.1:8000/api/postlist/${postId}/`;
const form = document.querySelector('.main__addform__form');
const titleInput = document.querySelector('.main__addform__form__field[placeholder="Title"]');
const categoryInput = document.querySelector('.main__addform__form__field[placeholder="Category"]');
const textArea = document.querySelector('.main__addform__form__textfield');
const fileInput = document.getElementById("main__addform__form__file__input");
const chooseText = document.querySelector(".main__addform__form__file__choose__text");

fileInput.addEventListener("change", function(event) {
  const filename = event.target.files[0].name;
  chooseText.textContent = "Image chosen";
  chooseText.title = filename;
});


fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    const id = parseInt(JSON.parse(atob(token.split('.')[1])).user_id);
    const user = data.users.find(user => user.id === id);
    console.log(user)
    const headerUserName = document.querySelector('.header__line__user__name');
    headerUserName.textContent = user.username;
    titleInput.value = data.posts.title;
    categoryInput.value = data.posts.category;
    textArea.value = data.posts.content;
  })
  .catch(error => console.error(error));

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const title = document.querySelector('.main__addform__form__field[placeholder="Title"]').value;
    formData.append('title', title);
    const category = document.querySelector('.main__addform__form__field[placeholder="Category"]').value;
    formData.append('category', category);
    const content = document.querySelector('.main__addform__form__textfield').value;
    formData.append('content', content);
    const fileInput = document.querySelector('#main__addform__form__file__input');
    formData.append('img', fileInput.files[0]);
    formData.delete('text');

    console.log(formData)

    fetch(url, {
        method: 'PUT',
        headers: {
        Authorization: `Bearer ${token}`,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.location.href = '../pages/my-posts.html';
    })
    .catch(error => console.error(error));
});



const arrowImg = document.querySelector('.header__line__user__drop');
const menuDiv = document.querySelector('.menu');

arrowImg.addEventListener('click', function() {
  menuDiv.style.display = 'block';
});

document.addEventListener('click', function(event) {
  if (!menuDiv.contains(event.target) && event.target !== arrowImg) {
    menuDiv.style.display = 'none';
  }
});

const logoutLink = document.getElementById('logout-link');

logoutLink.addEventListener('click', () => {
  localStorage.removeItem('token-access');
  localStorage.removeItem('token-refresh');
});