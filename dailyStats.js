const Stats = require("./stats");

const servers = [
    { schema: Stats.EU, name: "eu" },
    { schema: Stats.RU, name: "ru" },
    { schema: Stats.NA, name: "na" },
    { schema: Stats.ASIA, name: "asia" }
  ];

const valid = (data, expectedDate) => { // expected value = today
    for (const stats of data) {
        if (expectedDate.getUTCDate() !== stats.date.getUTCDate()) {
            console.error('Invalid date fetched');
            return false;
        }
    }
    return true;
} 

const getAvg = data => {
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
            const data = await server.schema.find({date: {$gt: yester.toISOString(), $lt: today.toISOString()}}).select("servers date").exec();
            if (valid(data, today)) {
                dataset.push({ name: server.name, players: getAvg(data) });
            }
            else
                return {status: 'error', msg: 'Invalid date, expcted: ' + today.getUTCDate()};
        } catch (e) {
            return{ status: 'error', msg: e };
        }
    }
    console.log(today);
    const toPush = new Stats.DAY({servers: dataset, date: today});
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