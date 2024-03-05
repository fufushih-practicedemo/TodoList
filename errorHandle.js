function errorHandle(res) {
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE, PATCH",
        "Content-Type": "application/json"
    }
    
    res.writeHead(400, headers);
    res.write(JSON.stringify(
        { 
            "status": "error",
            "message": "Todo is not found or invalid request."
        }
    ));
    res.end();
}

module.exports = errorHandle;