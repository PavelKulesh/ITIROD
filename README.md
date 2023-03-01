## Blog
# Sign In Page
![image](https://user-images.githubusercontent.com/79360817/222148754-2dc42629-40ad-46bb-a12e-14a5f1f23e3f.png)

# Main Page
![image](https://user-images.githubusercontent.com/79360817/222148784-c56046a3-773d-42d8-82ac-8c10dd5cb8ff.png)

# Main Page (Opened dropdowns)
![image](https://user-images.githubusercontent.com/79360817/222148799-be1c779b-81cb-45cf-b433-9dd9d3cb466a.png)

# New Post Page
![image](https://user-images.githubusercontent.com/79360817/222148819-cc4377e4-18a8-4b86-82d5-b590209011c9.png)

# Detailed Post Page
![image](https://user-images.githubusercontent.com/79360817/222148830-d0a896fc-0a68-468f-a2dd-1846e4ca466e.png)

## Main-functions
- Sign in  
  Method — "POST"  
  Params — username ___string___, password ___string___  
  Returns a response to a login request  

- Get posts  
  Method — "GET"    
  Returns a list of posts.
  
- Get posts by id's of users (subscribe)
  Method — "GET"    
  Returns a list of posts.

- Get posts by id
  Method — "GET"  
  Params — userId ___number___  
  Returns a list of user's posts.  

- Add post  
  Method — "POST"  
  Params — userId ___number___, title __string__, category __string__, text __string__, image __img__  
  Returns the result of the request  

- Update post  
  Method — "PUT"  
  Params — userId ___number___, postId __number__, title __string__, category __string__, text __string__, image __img__   
  Returns the result of the request 

- Delete post  
  Method — "DELETE"  
  Params — serId ___number___, postId __number__
  Returns the result of the request
  
- Edit user info  
  Method — "POST"  
  Params — userId ___number___, username __string__ 
  Returns the result of the request. 


## Data-models


### Data to login  
Data required for authorization
- username ___string___
- password ___string___


### Full user info
Full info about user
- id ___number___
- username ___string___
- email ___string___


### Post data
Info about post
- id: ___number___
- title: ___string___
- category: ___string___
- text: ___string___
- image: ___img___
- userId __number__
