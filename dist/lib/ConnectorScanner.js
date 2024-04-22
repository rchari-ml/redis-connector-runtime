"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorScanner = void 0;
const fs_1 = __importDefault(require("fs"));
const log_1 = require("./log");
class ConnectorScanner {
    constructor(config) {
        this.seenConnectors = new Set();
        this.dir = config.dir;
        this.runtime = config.runtime;
        module.paths.push(this.dir);
    }
    scan() {
        // scan a directory to find connectors
        const pkgFile = `${this.dir}/package.json`;
        (0, log_1.log)(`Scanning for: ${pkgFile}`);
        const exists = fs_1.default.existsSync(pkgFile);
        if (!exists) {
            (0, log_1.log)(`File not found.`);
        }
        (0, log_1.log)(`Found package.json`);
        const pkg = JSON.parse(fs_1.default.readFileSync(pkgFile).toString());
        const deps = pkg.dependencies;
        Object.keys(deps).forEach(key => {
            const packagePath = `${this.dir}/node_modules/${key}`;
            (0, log_1.log)(`Loading ${key} from ${packagePath}`);
            const code = require(packagePath);
            const connector = code.Connector;
            this.runtime.addOutboundConnector(connector);
            this.seenConnectors.add(key);
        });
    }
}
exports.ConnectorScanner = ConnectorScanner;
