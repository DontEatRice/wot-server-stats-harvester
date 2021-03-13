const Stats = require("./stats");

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
    let date = new Date();
    date.setHours(date.getHours()-25);
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