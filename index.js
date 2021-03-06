const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const harvester = require('./harvester');
const daily = require('./dailyStats').avg;
const delUseless = require('./delete');
const cors = require('cors')

dotenv.config()

app.use(express.static("public"));
app.use(cors())
app.use(express.json());

mongoose.connect(process.env.DB_LINK, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

const handleError = (res, e) => {
  res.status(500)
  res.json({msg: e})
}

app.get("/wake",async (req, res) => {
  try {
    let msg = await harvester()
    res.json({status: "done!", msg: msg})
  } catch (e) {
    handleError(res, e)
  }
})

app.get('/embed', (req, res) => {
  res.sendFile(__dirname + '/views/embed.html');
})

app.get('/daily', async (req, res) => {
  try {
    const pushed = await daily();
    res.json({meta: pushed});
  } catch (e) {
    handleError(res, e);
  }
})

app.get('/delete', async (req, res) => {
  try {
    const deleted = await delUseless();
    res.json({meta: deleted});
  } catch (e) {
    handleError(res, e)
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
