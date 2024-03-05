const http = require('http');
const { v4: uuidv4 } = require("uuid");
const errHandle = require('./errorHandle');

const todos = [
    {
        title: "test",
        id: uuidv4(),
    }
];

const sendSuccessRes = (res, data) => {
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE, PATCH",
        "Content-Type": "application/json"
    };

    res.writeHead(200, headers);
    res.write(JSON.stringify({ status: "success", data }));
    res.end();
};

const requestListener = (req, res) => {
    let body = "";
    req.on("data", chunk => {
        body += chunk;
    });

    if (req.method === "OPTIONS") {
        res.end();
        return;
    }

    // Get all todos
    if (req.url === "/todos" && req.method === "GET") {
        sendSuccessRes(res, todos);
        return;
    }

    // Create a new todo
    if (req.url === "/todos" && req.method === "POST") {
        req.on("end", () => {
            try {
                const { title } = JSON.parse(body);
                if (title) {
                    const todo = {
                        title,
                        id: uuidv4(),
                    };
                    todos.push(todo);
        
                    sendSuccessRes(res, todos);
                } else {
                    errHandle(res);
                }
            } catch (err) {
                errHandle(res);
            }
        });
        return;
    }

    // Delete all todos
    if (req.url === "/todos" && req.method === "DELETE") {
        todos.length = 0;
        sendSuccessRes(res, todos);
        return;
    }

    // Delete todo with id
    if (req.url.startsWith("/todos/") && req.method === "DELETE") {
        const id = req.url.split("/").pop();
        const index = todos.findIndex(element => element.id === id);
        if (index !== -1) {
            todos.splice(index, 1);
            
            sendSuccessRes(res, todos);
            res.end();
        } else {
            errHandle(res);
        }
        return;
    }

    // Update todo with id
    if (req.url.startsWith("/todos/") && req.method === "PATCH") {
        req.on("end", () => {
            try {
                const { title } = JSON.parse(body);
                const id = req.url.split("/").pop();
                const index = todos.findIndex(element => element.id === id);
                
                if(title && index !== -1) {
                    todos[index].title = title;
                    
                    sendSuccessRes(res, todos);
                } else {
                    errHandle(res);
                }
            } catch {
                errHandle(res);
            }
        });
        return;
    }

    res.writeHead(404);
    res.write(JSON.stringify({ 
        "status": "failed", "message": "Resource not found" 
    }));
    res.end();
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);