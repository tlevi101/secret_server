# secret_server

https://mercury-silver-advantage.glitch.me/
Routs:
  - /register 
  - /login
  - /my-secrets (authrequired)
  - /my-secrets/add (authrequired)
    - You can't send viewLimit and expiration date (TTL) here!
  - /my-secrets/share/:secretid (authrequired)
    - You must give a viewLimit(number), and an expiration date (TTL) if you want.
    - The server will give you the unique url for the secret.
  - /secrets/:secretuuid (uuid)
 
 Recomended chrome extension for testing:
 
 https://chrome.google.com/webstore/detail/firecamp-a-multi-protocol/eajaahbjpnhghjcdaclbkeamlkepinbl
