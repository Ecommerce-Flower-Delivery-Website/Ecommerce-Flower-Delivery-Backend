"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("UNCAUGHT EXECPTION! Shutting down...");
    process.exit(1);
});
dotenv_1.default.config({ path: "./config.env" });
const app_1 = __importDefault(require("./app"));
mongoose_1.default.connect(process.env.DATABASE).then(() => {
    console.log("DB connection successful");
});
const port = process.env.PORT || 8000;
const server = app_1.default.listen(port, () => {
    console.log(`App running on port ${port}`);
});
process.on("unhandledRejection", (err) => {
    console.log(err);
    console.log("UNHANDLED REJECTION! Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});
