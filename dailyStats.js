const Stats = require("./stats");

const servers = [
    { schema: Stats.EU, name: "eu" },
    { schema: Stats.RU, name: "ru" },
    { schema: Stats.NA, name: "na" },
    { schema: Stats.ASIA, name: "asia" }
  ];

const findDay = async () => {
    const find = await servers[0].schema.find().sort({date: -1}).limit(1);
    let date = find[0].date;
    return date.setDate(date.getDate()-1);   
}

const getAvg = (data) => {
    let sum = 0;
    for (const stats of data) {
        for (const server of stats.servers) {
            sum += server.players;
        }
    }
    return Math.round(sum / data.length);
} 

const dayAvg = async () => {
    const day = await findDay();
    const start = new Date(day)
    start.setHours(1, 0, 0, 0);
    const stop = new Date(start);
    stop.setHours(start.getHours()+24);
    let dataset = [];
    for(const server of servers) {
        try {
            const data = await server.schema.find({date: {$gte: start.toISOString(), $lt: stop.toISOString()}}).exec();
            dataset.push({ name: server.name, players: getAvg(data)});
        } catch (e) {
            return{ status: 'error', msg: 'finding error' };
        }
    }
    const toPush = new Stats.DAY({servers: dataset, date: start});
    const errs = toPush.validateSync();
    if (errs)
        console.log(errs);
    try {
        const push = await toPush.save();
        console.log(push);
    } catch (e) {
        return{ status: 'error', msg: e };
    }
    return dataset;
}

module.exports = dayAvg;