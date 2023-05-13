export function refreshTokenIfNeeded() {
    const tokenAccess = localStorage.getItem('token-access');
    const tokenRefresh = localStorage.getItem('token-refresh');
  
    if (tokenAccess) {
      const tokenData = JSON.parse(atob(tokenAccess.split('.')[1]));
      const tokenExpiration = tokenData.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpirationTime = tokenExpiration - currentTime;
      console.log(tokenExpiration)
      console.log(tokenExpirationTime)
  
      if (tokenExpirationTime < 300) {
        fetch('http://127.0.0.1:8000/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({refresh: tokenRefresh})
        })
        .then(response => response.json())
        .then(data => {
          localStorage.setItem('token-access', data.access);
        })
        .catch(error => console.error(error));
      }
    }
  }
  