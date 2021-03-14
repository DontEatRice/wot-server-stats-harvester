const Stats = require("./stats");

const servers = [
    { schema: Stats.EU, name: "eu" },
    { schema: Stats.RU, name: "ru" },
    { schema: Stats.NA, name: "na" },
    { schema: Stats.ASIA, name: "asia" }
  ];

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
    const today = new Date();
    today.setHours(0, 1, 0, 0);
    const yester = new Date(today);
    yester.setHours(yester.getHours()-24)
    let dataset = [];
    for(const server of servers) {
        try {
            const data = await server.schema.find({date: {$gt: yester.toISOString(), $lt: today.toISOString()}}).exec();
            dataset.push({ name: server.name, players: getAvg(data)});
        } catch (e) {
            return{ status: 'error', msg: 'finding error' };
        }
    }
    const toPush = new Stats.DAY({servers: dataset, date: yester});
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