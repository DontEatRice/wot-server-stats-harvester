# :repeat: Data Harvester for [Server Stats WOT](https://github.com/DontEatRice/Server-Stats-WOT)

## How does it work:interrobang:
There are 3 api endpoints hosted on [repl](https://replit.com/), making a GET request will trigger this actions
* __Harvester__ - fetching data from WG API and saving it in mongoDB database
* __Daily Stats__ - fetching data from last 24 hours and returning average players online during this time period
* __Delete__ - deleting unnecessary data from mongoDB (only every-hour stats) older than 2 days

I'm using https://cron-job.org/ for setting up the requests; they are set up like this
* __Harvester__ - every hour
* __Daily Stats__ - every 24 hours at 1:00 AM UTC+1
* __Delete__ - mondays and fridays at 2:00 AM UTC+1

## Run code!
1. Create `.env` file that looks like this :heavy_check_mark:
    ```Text
    DB_LINK=<mongoDB connection string>
    APP_ID=<your WG API ID>
    ``` 
    [WG API](https://developers.wargaming.net/#)
2. Install modules using npm :heavy_check_mark:
    ```Bash
    npm install
    ```
3. Run script! :heavy_check_mark:
    ```Bash
    node index
    ```
    
## Visit the [project page](https://server-stats-wot.herokuapp.com/)!
