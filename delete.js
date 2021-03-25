const Stats = require("./stats");
const findDay = require('./dailyStats').findDay;

const servers = [
    { schema: Stats.EU, name: "eu" },
    { schema: Stats.RU, name: "ru" },
    { schema: Stats.NA, name: "na" },
    { schema: Stats.ASIA, name: "asia" }
  ];

const deleteMoreThan48hOld = async () => {
    const day = await findDay(servers[0].schema, 3);
    let date = new Date(day);
    date.setHours(1, 1, 0, 0);
    date.setHours(date.getHours()+23);
    let toReturn = [];
    for (const server of servers) {
        try {
          const rem = await server.schema.deleteMany({date: {$lt: date.toISOString()}});
          toReturn.push(rem.deletedCount)
        } catch (e) {
          throw e
        }
    }
    return toReturn;
}

module.exports = deleteMoreThan48hOld;