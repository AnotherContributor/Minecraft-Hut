import {WebSQL} from "./db.js"

console.log("imported")
export let db = new WebSQL(openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024));