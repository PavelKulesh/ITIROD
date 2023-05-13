function isPasswordValid(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

  return passwordRegex.test(password);
}

const form = document.querySelector('#registration-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const login = document.querySelector('#login').value;
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#confirm-password').value;
  if (!isPasswordValid(password)) {
    alert('Your password must contain at least 8 characters and can’t be entirely numeric.');
    return;
  }


  if (password === confirmPassword) {

    const response = await fetch('http://127.0.0.1:8000/api/adduser/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        username: login,
        password: password
      })
    });

    if (response.status === 201) {
      const loginResponse = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: login,
          password: password
        })
      });

      const loginData = await loginResponse.json();
      console.log(loginData)
      localStorage.setItem('token-access', loginData.access);
      localStorage.setItem('token-refresh', loginData.refresh);

      window.location.href = '../index.html';
    } else {
      const responseData = await response.json();
      alert(responseData.detail);
    }
  } else {
    alert('Passwords do not match');
  }
});
