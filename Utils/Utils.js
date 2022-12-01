export function genTableRow(values, isHeader=false) {
    let result = ""
    result += "<tr>"

    let cellTag = isHeader ? "th" : "td"
    for (const val of values) {
        result += `<${cellTag}> ${val} </${cellTag}>`
    }

    result += "</tr>"
    return result
}

export function makeID(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 *
 * @param {File} file
 * @return {Promise<Image>}
 */
export async function getImageFromFile(file) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = window.URL.createObjectURL( file )
        img.onload = () => {
            resolve(img)
        }
    })
}