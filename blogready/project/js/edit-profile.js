import { refreshTokenIfNeeded } from './token.js';

refreshTokenIfNeeded()
const token = localStorage.getItem('token-access');

const id = parseInt(JSON.parse(atob(token.split('.')[1])).user_id);
console.log(id)

fetch(`http://127.0.0.1:8000/api/postlist/?user=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    const user = data.users.find(user => user.id === id);
    console.log(user)
    const headerUserName = document.querySelector('.header__line__user__name');
    headerUserName.textContent = user.username;

    const form = document.querySelector('.main__editform__form');
    form.addEventListener('submit', (event) => {
    event.preventDefault();
    const passwordInput = document.querySelector('.main__editform__form__field[placeholder="Password"]');
    const newPasswordInput = document.querySelector('.main__editform__form__field[placeholder="New Password"]');
    const confirmPasswordInput = document.querySelector('.main__editform__form__field[placeholder="Confirm Password"]');
    const url = `http://127.0.0.1:8000/api/adduser/?user=${id}`;

    if (newPasswordInput.value !== confirmPasswordInput.value) {
        alert("New Password and Confirm Password fields should match");
        return;
    }

    const data = {
        username: user.username,
        password: passwordInput.value,
        new_password: newPasswordInput.value,
    };

    console.log(data)

    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            alert("Incorrect password")
            throw new Error("Failed to update user password");
        }
        alert("Password updated successfully");
        passwordInput.value = "";
        newPasswordInput.value = "";
        confirmPasswordInput.value = "";
        window.location.href = '../index.html';
    })
    .catch(error => console.error(error));
    });
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