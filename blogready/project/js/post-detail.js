import { refreshTokenIfNeeded } from './token.js';

refreshTokenIfNeeded()
const token = localStorage.getItem('token-access');

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

const url = `http://127.0.0.1:8000/api/postlist/${postId}/`;

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

    const creator = data.users.find(user => user.username === data.posts.user);
    const creatorId = creator.id;
    console.log(id)
    console.log(creatorId)
    let is_subscribed = "/assets/false_box.png";
    fetch('http://127.0.0.1:8000/api/addsub/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            creator: creatorId,
            subscriber: id,
        }),
    })
    .then(response => response.json())
    .then(data2 => {
        console.log(data2);
        if (data2.Subscribed === "True") {
            is_subscribed = "/assets/true_box.png";
        }

        const container = document.querySelector('.main__post');
        container.innerHTML = `
            <div class="main__post__post-description">
                <p class="main__post__post-description__title">${data.posts.title}</p>
                <p class="main__post__post-description__category">${data.posts.category}</p>
            </div>
            <div class="main__post__post-content">
                <div class="main__post__post-content__info">
                    <img src="${'http://127.0.0.1:8000/' + data.posts.img}" alt="post-image">
                    <div class="main__post__post-content__info__user-image">
                        <img src="/assets/avatar2.png" alt="avatar">
                        <p class="main__post__post-content__info__user-image__username">${data.posts.user}</p>
                        <div class="sub__menu">
                            <img class="sub__check" src="${is_subscribed}" alt="" data-category-id="${data.posts.id}">
                            <a class="sub" href="#">Subscribe</a>
                        </div>
                    </div>
                    <p class="main__post__post-content__info__date">${data.posts.date}</p>
                </div>
                <div class="main__post__post-content__text">
                    ${data.posts.content}
                </div>
            </div>
        `;

        const subCheck = document.querySelector('.sub__check');
        const subLink = document.querySelector('.sub');

        subCheck.addEventListener('click', () => {
          let isSubscribed = subCheck.getAttribute('src').includes('true_box.png');
          const op = isSubscribed ? 'unsub' : 'sub';

          fetch(`http://127.0.0.1:8000/api/addsub/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              creator: creatorId,
              subscriber: id,
              op: op,
            }),
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if (data.Added === 'True') {
              subCheck.setAttribute('src', '/assets/true_box.png');
              subLink.textContent = 'Subscribe';
            } else if (data.Deleted === 'True') {
              subCheck.setAttribute('src', '/assets/false_box.png');
              subLink.textContent = 'Subscribe';
            } else {
              console.error('Invalid response from server');
            }
          })
          .catch(error => {
            console.error(error);
          });
        });


        document.addEventListener('click', function(event) {
          if (event.target.closest('.main__post__post-content__info__user-image')) {
            if(id != creatorId){
              event.target.closest('.main__post__post-content__info__user-image').querySelector('.sub__menu').style.display = 'flex';
            }
          } else {
            document.querySelectorAll('.sub__menu').forEach(function(menu) {
              menu.style.display = 'none';
            });
          }
      });

    });
  })
  .catch(error => console.error(error));


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

const backBtn = document.getElementById('back-btn');
backBtn.addEventListener('click', () => {
  history.back();
});