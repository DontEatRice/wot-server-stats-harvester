const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const harvester = require('./harvester');
const fetch = require('node-fetch')
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

app.get("/wake",async (req, res) => {
  let msg = await harvester()
  res.json({status: "done!", msg: msg})
})

app.get('/embed', (req, res) => {
  res.sendFile(__dirname + '/views/embed.html');
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
