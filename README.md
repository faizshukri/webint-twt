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
    bower install
    npm install

    # run only if you don't have db-migrate yet
    npm install -g db-migrate
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
- Ishitap