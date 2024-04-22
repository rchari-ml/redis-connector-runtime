"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorScanner = exports.WorkerConnectorRuntime = void 0;
const zeebe_node_1 = require("zeebe-node");
const ConnectorRuntime_1 = require("./lib/ConnectorRuntime");
const ConnectorScanner_1 = require("./lib/ConnectorScanner");
const log_1 = require("./lib/log");
var ConnectorRuntime_2 = require("./lib/ConnectorRuntime");
Object.defineProperty(exports, "WorkerConnectorRuntime", { enumerable: true, get: function () { return ConnectorRuntime_2.WorkerConnectorRuntime; } });
var ConnectorScanner_2 = require("./lib/ConnectorScanner");
Object.defineProperty(exports, "ConnectorScanner", { enumerable: true, get: function () { return ConnectorScanner_2.ConnectorScanner; } });
if (process.env.CONNECTOR_RUNTIME_AUTOSTART === "TRUE") {
    const dir = process.env.CONNECTOR_RUNTIME_SCANDIR || "/opt/connectors";
    (0, log_1.log)(`Running with scan directory: ${dir}`);
    (0, log_1.log)("Process environment:");
    (0, log_1.log)(process.env);
    const zbc = new zeebe_node_1.ZBClient();
    const runtime = new ConnectorRuntime_1.WorkerConnectorRuntime(zbc);
    const scanner = new ConnectorScanner_1.ConnectorScanner({
        dir,
        runtime,
    });
    scanner.scan();
}
