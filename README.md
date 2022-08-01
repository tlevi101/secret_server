<style>
  .orange{
    color:DarkOrange;
  }
  .blue{
    color:DarkBlue;
  }
</style>
#<div class="orange">Secret_server</div>
Server url:
https://octagonal-chip-click.glitch.me

This server has a front-end
https://github.com/tlevi101/secrets
which available at
https://tlevi101secrets.web.app/

Routs:
#### /register (POST)
    - request body:
      - username:
        - required, unique
      - email:
        - required, unique, email format
      - password:
        - required
      - passwordAgain:
        - required, must match with password
    - resbond:
      - jwt webtoken:
        - includes every data from user except password
    - errors:
      - code 400:
        - email, username, password, passwordAgain is missing 
        - password and passwordAgain does not match
        - Bad email format
      - code 409:
        - Email or username is already registered

####   /login (POST)
    - request body:
      - email:
        - required, email format
      - password:
        - required
    - resbond:
      - jwt webtoken:
        - includes every data from user except password
    - errors:
      - code 400:
        - email or password is missing
      - code 404:
        - email has not been registered yet
      - code 401:
        - wrong password

#### /my-secrets (GET)
    - Authorization header required
      - Header-type: Authorization
      - Value: Bearer ${yourWebToken}
    - resbond:
      - every secret that is belongs to the authorized user
        - A secret includes:
          - id, USerId,title,text,ttl,viewLimit,viewCounter,createdAt,UpdatedAt,url
            - url is a uuid which is used in /secrets/:secretuuid rout
            - ttl is Date, when the secret is going to expire
    - errors:
      - code 401:
        - Unauthorized error
        
####   /my-secrets/add (POST)
    - request body:
      - Authorization header required
        - Header-type: Authorization
        - Value: Bearer $yourWebToken
      - title, text
      - You can't send viewLimit and expiration date (TTL) here!
    - respond:
      - With the created secret's id, title, and text
    - errors:
      - code 401:
        - Unauthorized error
      - code 400:
        - title or text is missing
  
####  /my-secrets/share/:secretid (PUT)
    - request params:
      - secretid
    - request body:
      - viewLimit
        - required, number
      - TTL (expiration date)
        - NOT required, Date
    - respond:
      - A uuid for the secret.
    - errors:
      - code 400:
        - secretid is missing or not a number
        - viewLimit is missing or equals to zero
      - code 401:
        - Unauthorized error
      - code 403:
        - The secret does not belongs to the authorized user
      - code 404:
        - No such secret      
####  /secrets/:secretuuid (GET)
    - request params:
      - secretuuid
    - respond:
      - The shared secret with the given uuid
    - errors:
      - code 400:
        - secretuuid is missing
      - code 404:
        - Secret not found with the given uuid
      - code 410:
        - Secret has expired
 
 Recomended chrome extension for testing:
 
 https://chrome.google.com/webstore/detail/firecamp-a-multi-protocol/eajaahbjpnhghjcdaclbkeamlkepinbl


