import {genTableRow} from "./Utils/Utils.js"
import {db} from "./composition_root.js"
import {Clan} from "./db.js";

let topTable = document.getElementById("top-table")

/** @type {HTMLSelectElement} */
let topSortingType = document.getElementById("top-sort-select")

const selectToType = {
    "Чанкам": "CHUNKS",
    "Убийствам": "KILLS",
    "Валюте": "MONEY",
}

for (let optionName of Object.keys(selectToType)){
    let opt = document.createElement('option');
    opt.value = optionName;
    opt.innerHTML = optionName;
    topSortingType.appendChild(opt);
}

async function genTopTableContent() {
    let result = ""
    result += genTableRow(["Название", "Деньги", "Чанки", "Убийства"], true)
    for (let clanInfo of await db.getTopClans(10, selectToType[topSortingType.value])) {
        result += genTableRow([clanInfo.name, clanInfo.money, clanInfo.chunks, clanInfo.kills])
    }
    return result
}

async function updateTopTable() {
    topTable.innerHTML = await genTopTableContent()
}

await updateTopTable()
topSortingType.addEventListener("change", async (e)=>{
    await updateTopTable()
})
