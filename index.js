// require your server and launch it

const server = require("./api/server.js");
const port = 5000;
server.listen(port, () => {
    console.log(`${port} dinleniyor`);
    // console.log("listening on" , port)
});