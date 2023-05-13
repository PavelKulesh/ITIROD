const loginForm = document.querySelector('.main__inform__form');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const login = loginForm.querySelector('[name=login]').value;
  const password = loginForm.querySelector('[name=password]').value;

  try {
    const response = await fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: login,
        password: password
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token-access', data.access);
      localStorage.setItem('token-refresh', data.refresh);
      window.location.href = '../index.html';
    } else {
      alert('Incorrect Login or Password');
      console.error('Auth Error');
    }
  } catch (error) {
    console.error(error);
  }
});
