import Server from "./config/server.js";
const server = new Server();
export default (req, res) => {
    server.app(req, res);
};
