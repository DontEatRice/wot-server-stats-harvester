const fetch = require("node-fetch");
const dotenv = require("dotenv");
const Stats = require("./stats");

const servers = [
  { schema: Stats.EU, name: "eu" },
  { schema: Stats.RU, name: "ru" },
  { schema: Stats.NA, name: "com" },
  { schema: Stats.ASIA, name: "asia" }
];
dotenv.config();

const hourlyHarvest = async () => {
    let returns = []
    for(const server of servers) {
        const apiLink = `https://api.worldoftanks.${server.name}/wgn/servers/info/?application_id=${process.env.APP_ID}`;
        const data = await fetch(apiLink)
        if (!data.ok) {
          returns.push(data.status)
        } else {
          const load = await data.json()
          const stats = load.data.wot
          let arr = [];
          stats.forEach(values => {
              arr.push({ name: values.server, players: values.players_online });
          });
          const dataToPush = new server.schema({ servers: arr });
          const errors = dataToPush.validateSync();
          if (errors) console.log(errors);
          try {
              const back = await dataToPush.save()
              returns.push(back)
          } catch(e) {
              returns.push(e)
          }
        }
    }
    return returns
};


module.exports = hourlyHarvest;
