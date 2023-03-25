const qrcode = require("qrcode");
const path = require("path");


async function getQRCode(req, data) {
    let name = "qr_" + Math.floor(Math.random() * 1000).toString() + "_" + Date.now().toString() + ".png";
    let file_url = process.env.API_URL + "/" + name;
    let file_path = path.join(__dirname, `/../qrcodes/${name}`);
    let qr_data = {
        ...data,
        file_name: name,
        file_path: file_path,
        file_url: file_url
    }
    console.log(qr_data);
    return await qrcode.toFile(file_path, JSON.stringify(qr_data), {
        color: {
            dark: "#000",
            light: "#fff"
        }
    }).then(() => {
        return qr_data;
    }).catch(err => {
            console.log(err);
            return err;
        });
}

module.exports = {
    getQRCode
}