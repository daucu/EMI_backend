function getColor(method){
    switch(method){
        case "GET":
            return "\u001b[1;32m";
        case "POST":
            return "\u001b[1;33m";
        case "PUT":
            return "\u001b[1;34m";
        case "DELETE":
            return "\u001b[1;35m";
        default:
            return "\u001b[1;36m";
    }
}
function logger(req, res, next) {
    console.log(getColor(req.method)+" "+req.method+" \u001b[1;36m"+req.url);
    next();
}

module.exports = logger;