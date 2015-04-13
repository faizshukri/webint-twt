Twit project
============

Installation
------------
1. Copy `app/config/app.sample.json` to `app/config/app.json` and `./database.sample.json` to `./database.json`. Update configuration details to those files accordingly.
    
    In **Google API Developers Console**, make sure you have enabled these services
    * **Google Maps Embed API**
    * **Places API**

2. Install dependencies

    ```bash
    # run only if you don't have bower yet
    npm install -g bower
    
    # run only if you don't have db-migrate yet
    npm install -g db-migrate
    
    bower install
    npm install
    ```

3. Migrate database structure. Before you can do this, make sure you have install db-migrate package.
        
        db-migrate up

4. Start the server

        npm start
    

Open `http://localhost:3000` in the browser

Authors
-------
- Faiz
- Ain
- Ishita
