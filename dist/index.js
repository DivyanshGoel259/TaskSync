"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routers/user.routes"));
const db_1 = require("./lib/db");
const manager_routes_1 = __importDefault(require("./routers/manager.routes"));
const employee_routes_1 = __importDefault(require("./routers/employee.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.DbConnect)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/auth", user_routes_1.default);
app.use("/api/v1/manager", manager_routes_1.default);
app.use("/api/v1/employee", employee_routes_1.default);
app.use((err, req, res, next) => {
    res.status(400).json({
        error: {
            message: err.message || "something went wrong",
        },
    });
});
app.get("/", (req, res) => {
    res.json("Connection Established");
});
app.listen(PORT, () => {
    console.log("Server running on port" + PORT);
});
