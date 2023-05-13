import { refreshTokenIfNeeded } from './token.js';

refreshTokenIfNeeded()
const token = localStorage.getItem('token-access');

const fileInput = document.getElementById("main__addform__form__file__input");
const chooseText = document.querySelector(".main__addform__form__file__choose__text");

fileInput.addEventListener("change", function(event) {
  const filename = event.target.files[0].name;
  chooseText.textContent = "Image chosen";
  chooseText.title = filename;
});

const form = document.querySelector('.main__addform__form');
const formData = new FormData();

fetch('http://127.0.0.1:8000/api/postlist/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(response => response.json())
  .then(data => {
        console.log(data);
        const id = parseInt(JSON.parse(atob(token.split('.')[1])).user_id);
        const user = data.users.find(user => user.id === id);
        formData.append('user', user.username)
        const headerUserName = document.querySelector('.header__line__user__name');
        headerUserName.textContent = user.username;
    });

form.addEventListener('submit', async function(event) {
  event.preventDefault();

  const title = form.querySelector('[placeholder="Title"]').value;
  const category = form.querySelector('[placeholder="Category"]').value;
  const text = form.querySelector('.main__addform__form__textfield').value;
  console.log(form.querySelector('#main__addform__form__file__input').files[0])
  const file = form.querySelector('#main__addform__form__file__input').files[0];

  formData.append('title', title);
  formData.append('category', category);
  formData.append('content', text);
  formData.append('img', file);
  console.log(formData);

  try {
    const response = await fetch('http://127.0.0.1:8000/api/postlist/', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (response.ok) {
      window.location.href = '../pages/my-posts.html';
    } else {
      console.log('Request error');
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }  
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
