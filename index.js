const server = require("./server");

server.get("*", (req, res) => {
  res.send("<h1>NODEJS / EXPRESS SPRINT CHALLENGE</h1>");
});

server.listen(5000, () => console.log("Listening on port 5000..."));
