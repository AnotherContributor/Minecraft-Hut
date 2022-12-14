import {db} from "./composition_root.js"
import {genTableRow, getImageFromFile} from "./Utils/Utils.js";
import {Clan} from "./db.js";

const clear = document.getElementById("clear")
const submit = document.getElementById("submit")

const form = document.getElementById("create-clan-form")

const name = form.querySelector(`#name`)
const color = form.querySelector(`input[type="color"]`)
const description = form.querySelector(`#description`)
const isPrivate = form.querySelector(`#is-private`)
const subServer = form.querySelector(`#subserver`)
/** @type HTMLInputElement */
const avatar = form.querySelector("#avatar")
const clanPage = form.querySelector("#clan-page")

// clear.addEventListener("click",(e) => {
//     form.reset()
// })
form.onsubmit = async (e) => {
    e.preventDefault()
    let avatarFile = avatar.files[0]
    let avatarUrl
    if (avatarFile)  {avatarUrl = window.URL.createObjectURL( avatarFile );}
    else {avatarUrl = null}

    try {
        await db.addClan(new Clan(
            name.value,
            description.value,
            color.value,
            isPrivate.checked,
            subServer.value,
            avatarUrl,
            clanPage.value
        ))
    } catch (E) {
        alert("Произошла непредвиденная ошибка")
        e.preventDefault()
        throw E
    }
    alert("Клан успешно зарегистрирован!")
    form.reset()
}
avatar.onchange = async (e) => {
    let img = await getImageFromFile(avatar.files[0])
    console.log(img.height, img.width)

    let avatarFile = avatar.files[0]
    if (avatarFile) {console.log(window.URL.createObjectURL( avatarFile ));}

    if (img.height !== 64 || img.width !== 64) {
        avatar.value = null
        alert("Нужно изображение 64x64 пикселя")
        return false;
    }
}

const clansTable = document.getElementById("clans-info")

let tableInner = ""

let clansRows = (await db.executeSQL("SELECT * FROM CLANS")).rows
let columns = Object.keys(clansRows[0])
tableInner += genTableRow(columns, true)
for (let row of clansRows) {
    tableInner += genTableRow(Object.values(row))
}

clansTable.innerHTML = tableInner









// let reader = new FileReader()
// reader.readAsText(avatarInput.files[0])
// reader.onload = (e) => {
//     console.log(e.target.result)
// }
//
// console.log(avatarInput.files[0])

