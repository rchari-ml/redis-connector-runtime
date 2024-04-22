"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
function log(msg) {
    if (process.env.LOG_LEVEL == "INFO") {
        console.log(msg);
    }
}
exports.log = log;
