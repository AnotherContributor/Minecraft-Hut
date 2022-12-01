import {makeID} from "./Utils/Utils.js"

export class Clan {
    /**
     * @param {string} name
     * @param {string} description
     * @param {string} color
     * @param {boolean} isPrivate
     * @param {string} subServer
     * @param {string} avatar
     * @param {string} clanPage
     * @param {number} [kills=0]
     * @param {number} [chunks=0]
     * @param {number} [money=0]
     */
    constructor(name, description, color, isPrivate, subServer, avatar, clanPage, kills, chunks, money) {
        if (!kills) {kills = 0}
        if (!chunks) {chunks = 0}
        if (!money) {money = 0}

        this._kills = kills;
        this._chunks = chunks;
        this._money = money;
        this._name = name;
        this._description = description;
        this._color = color;
        this._isPrivate = isPrivate;
        this._subServer = subServer;
        this._avatar = avatar;
        this._page = clanPage;
    }

    static fromRow(row) {
        return new Clan(row.name, row.description, row.color, row.isPrivate, row.subServer, row.avatar, row.clanPage, row.kills, row.chunks, row.money)
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get color() {
        return this._color;
    }

    get isPrivate() {
        return this._isPrivate;
    }

    get subServer() {
        return this._subServer;
    }

    get avatar() {
        return this._avatar;
    }

    get page() {
        return this._page;
    }

    get kills() {
        return this._kills
    }
    get chunks() {
        return this._chunks
    }
    get money() {
        return this._money
    }
    get name() {
        return this._name
    }
}

export class DB {
    constructor() {
        this.criteries = {}
    }

    /**
     * Возвращает топ n кланов, по критерию criteria
     * @param {number} n
     * @param {"KILLS" || "CHUNKS" || "MONEY"} criteria
     * @returns {Clan[]}
     */
    async getTopClans(n, criteria) {
        throw new Error("Not implemented")
    }

    /**
     * Возвращает статистику клана
     * @param {string} name
     * @returns {Clan}
     */
    async getClan(name) {
        throw new Error("Not implemented")
    }

    /** @param {Clan} clan
     *  @returns {void}
     * */
    addClan(clan) {
        throw new Error("Not implemented")
    }
}

export class WebSQL extends DB{
    /** @param {Database} db */
    constructor(db) {
        super();
        this._db = db;
        this._db.transaction((t)=>{
            t.executeSql("CREATE TABLE IF NOT EXISTS CLANS (name unique, description, color, isPrivate, subServer, avatar, clanPage, money, kills, chunks)")
        },  console.error)

    }

    /**
     * @param {string} sqlStatement
     * @param {object[]=} args
     * @param { ((transaction: SQLTransaction, resultSet: SQLResultSet) => T)=} callback
     * @return {Promise<T> | SQLResultSet}
     * @template T
     */
    async executeSQL(sqlStatement, args, callback) {
        return new Promise((resolve, reject)=>{
            this._db.transaction((t)=> {
                t.executeSql(sqlStatement, args, (tx, results) => {
                    if (callback) {
                        resolve(callback(tx, results))
                    } else {
                        resolve(results)
                    }

                }, (t, e) => {reject(e)});
            }, reject)
        });
    }

    /** @return {Clan[]} */
    async getTopClans(n, criteria) {
        let rows = await this.executeSQL(`SELECT * FROM clans ORDER BY ${criteria} DESC LIMIT ${n}`, [], (tx, results) => results.rows)

        let clanInfos = []
        for (let row of rows) {

            clanInfos.push(Clan.fromRow(row))
        }

        return clanInfos
    }

    /** @return Clan */
    async getClan(name) {
        const row = (await this.executeSQL("SELECT * FROM clans WHERE name=?", [name])).rows[0]
        return Clan.fromRow(row)
    }

    async addClan(clan) {
        await this.executeSQL("INSERT INTO CLANS VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [clan.name, clan.description, clan.color, clan.isPrivate, clan.subServer, clan.avatar, clan.clanPage, clan.money, clan.kills, clan.chunks])
    }
    // async setClanStats(clanInfo) {
    //     await this.executeSQL("INSERT INTO CLANS VALUES (?,?,?,?)", [clanInfo.name, clanInfo.money, clanInfo.kills, clanInfo.chunks])
    // }
}

/**
 *
 * @param {string=} name
 * @returns {Clan}
 */
export function genRandomClanInfo(name) {
    return new Clan(
        name ? name : "Clan" + makeID(3),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 100)
    )
}

export class StubDB extends DB {
    constructor() {
        super();

        /** @type {Object.<string, ClanInfo>} */
        this._clansInfos = {}
        /** @type {Object.<string, Clan>} */
        this._clansStats = {}

        //some sample claninfos
        const sampleInfos = [new ClanInfo("test1", "Описание бла-бла", "rgb(256,256,256)", false, "EW-1", "28129381", ""),
            new ClanInfo("test2", "О", "rgb(256,256,0)", true, "EW-1", "28129381", ""),
            new ClanInfo("test2", "de", "rgb(256,256,0)", true, "EW-3", "28129381", "")
        ]
        for (let info of sampleInfos) {
            this._clansInfos[info.name] = info
        }

        for (let name in this._clansInfos) {
            let clanInfo = genRandomClanInfo(name)
            this._clansStats[clanInfo.name] = clanInfo
        }
    }

    /** @returns {Clan[]} */
    async getTopClans(n, criteria) {
        return Object.values(this._clansStats).sort((a, b) => {
            switch(criteria) {
                case "CHUNKS":
                    return b.chunks - a.chunks
                case "KILLS":
                    return b.kills - a.kills
                case "MONEY":
                    return b.money - a.money
                default:
                    throw new Error("Not supported criteria")
            }
        })
    }

    async createClan(info) {
        this._clansInfos[info.name] = info
    }

    async getAllClans() {
        return Object.values(this._clansInfos)
    }

    /** @return Clan */
    async getClan(name) {
        return this._clansStats[name]
    }
}