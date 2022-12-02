import {makeID} from "./Utils/Utils.js"

export class Clan {
    /**
     * @param {string} name
     * @param {string} description
     * @param {string} color
     * @param {boolean} isPrivate
     * @param {string} subServer
     * @param {string} clanPage
     * @param {number} [kills=0]
     * @param {number} [chunks=0]
     * @param {number} [money=0]
     */
    constructor(name, description, color, isPrivate, subServer, clanPage, kills, chunks, money) {
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
        this._page = clanPage;
    }

    static fromRow(row) {
        return new Clan(row.name, row.description, row.color, row.isPrivate, row.subServer, row.clanPage, row.kills, row.chunks, row.money)
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
}

export class DB {
    constructor() {
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
            t.executeSql("CREATE TABLE IF NOT EXISTS CLANS (name unique, description, color, isPrivate, subServer, clanPage, money, kills, chunks)")
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
        await this.executeSQL("INSERT INTO CLANS VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [clan.name, clan.description, clan.color, clan.isPrivate, clan.subServer, clan.page, clan.money, clan.kills, clan.chunks])
    }
}