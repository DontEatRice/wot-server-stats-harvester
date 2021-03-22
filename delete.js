const Stats = require("./stats");
const findDay = require('./dailyStats').findDay;

const servers = [
    { schema: Stats.EU, name: "eu" },
    { schema: Stats.RU, name: "ru" },
    { schema: Stats.NA, name: "na" },
    { schema: Stats.ASIA, name: "asia" }
  ];

const remover = async (data, schema) => {
    let deleted = [];
    for (const stats of data) {
        try {
            const toDel = await schema.findByIdAndDelete(stats.id).exec();
            deleted.push(toDel._id);
        } catch (e) {
            return 'e' + e;
        }
    }
    return deleted;
}

const deleteMoreThan24hOld = async () => {
    const day = await findDay(servers[0].schema, 3);
    let date = new Date(day);
    date.setHours(1, 1, 0, 0);
    date.setHours(date.getHours()+23);
    let toReturn = [];
    for (const server of servers) {
        const data = await server.schema.find({date: {$lt: date.toISOString()}}).exec();
        const removed = await remover(data, server.schema);
        if (removed[0] === 'e')
            return {msg: 'error', body: removed}
        toReturn = toReturn.concat(removed);
    }
    return toReturn;
}

module.exports = deleteMoreThan24hOld;