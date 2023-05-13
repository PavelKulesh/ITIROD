import { refreshTokenIfNeeded } from './token.js';

refreshTokenIfNeeded()
const token = localStorage.getItem('token-access');

const categoryList = document.querySelector('.main__cat__list');
const postsContainer = document.querySelector('.main__post');

const id = parseInt(JSON.parse(atob(token.split('.')[1])).user_id);
console.log(id)


fetch(`http://127.0.0.1:8000/api/postlist/?user=${id}&sub='True'`, {
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
    data.posts.forEach(post => {
      const container = document.querySelector('.main__post');
      const postElement = document.createElement('div');
      postElement.classList.add('main__post__single');
      postElement.innerHTML = `
        <div class="main__post__single__header">
            <p class="main__post__single__header__cat-name">Category: ${post.category}</p>
            <p class="main__post__single__header__title">Title: ${post.title}</p>
            <p class="main__post__single__header__user">
            <img class="main__post__single__header__user__avatar" src="/assets/avatar2.png" alt="avatar">${post.user}
            </p>
        </div>
        <hr>
        <div class="main__post__single__content">
            <img class="main__post__single__content__image" src="${'http://127.0.0.1:8000/' + post.img}" alt="post-image">
            <p class="main__post__single__content__text">${post.content.slice(0, 400)}...</p>
        </div>
        <hr>
        <div class="main__post__single__info">
            <p class="main__post__single__info__date">${post.date}</p>
            <a class="main__post__single__info__read-more" href="/pages/post-detail.html?id=${post.id}">Read More...</a>
        </div>
        `;
      container.appendChild(postElement);

      const deleteLinks = document.querySelectorAll('.main__post__single__header__edit__delete a[data-post-id]');
      deleteLinks.forEach(link => {
        link.addEventListener('click', event => {
          event.preventDefault();
          const postId = event.target.dataset.postId;
          fetch(`http://127.0.0.1:8000/api/postlist/${postId}/`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              location.reload();
            })
            .catch(error => {
              console.error(`Error: ${error}`);
            });
        });
      });
    });

    data.categories.forEach(category => {
      const listItem = document.createElement('p');
      listItem.classList.add('main__cat__list__option');
      listItem.innerHTML = `<img class="main__cat__list__check" src="/assets/false_box.png" alt="" data-category-id="${category.id}">${category.name} (${category.sub_post_count})`;

      categoryList.appendChild(listItem);
    });



    const checkboxes = categoryList.querySelectorAll('.main__cat__list__check');

    function sendCategories() {
      const trueBoxes = Array.from(checkboxes).filter(checkbox => checkbox.src.includes('true_box.png'));
      const categoryIds = trueBoxes.map(checkbox => checkbox.dataset.categoryId).join(',');
      const url = `http://127.0.0.1:8000/api/postlist/?categories=${categoryIds}&user=${id}&sub='True'`;  
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const container = document.querySelector('.main__post');
          container.innerHTML = '';
          data.posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('main__post__single');
            postElement.innerHTML = `
              <div class="main__post__single__header">
                <p class="main__post__single__header__cat-name">Category: ${post.category}</p>
                <p class="main__post__single__header__title">Title: ${post.title}</p>
                <p class="main__post__single__header__user">
                  <img class="main__post__single__header__user__avatar" src="assets/avatar2.png" alt="avatar">${post.user}
                </p>
              </div>
              <hr>
              <div class="main__post__single__content">
                <img class="main__post__single__content__image" src="${'http://127.0.0.1:8000/' + post.img}" alt="post-image">
                <p class="main__post__single__content__text">${post.content.slice(0, 400)}...</p>
              </div>
              <hr>
              <div class="main__post__single__info">
                <p class="main__post__single__info__date">${post.date}</p>
                <a class="main__post__single__info__read-more" href="post-detail.html?id=${post.id}">Read More...</a>
              </div>
            `;
            container.appendChild(postElement);
          });
        })
        .catch(error => console.error(error));
    }
    
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].onclick = function() {
        const currentSrc = checkboxes[i].getAttribute('src');
        const newSrc = currentSrc.includes('true_box.png')
          ? '/assets/false_box.png'
          : '/assets/true_box.png';
        checkboxes[i].setAttribute('src', newSrc);
        sendCategories();
      };
    }
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