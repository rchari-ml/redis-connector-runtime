"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerConnectorRuntime = void 0;
const zeebe_node_1 = require("zeebe-node");
const camunda_connector_sdk_1 = require("camunda-connector-sdk");
const log_1 = require("./log");
class WorkerConnectorRuntime {
    constructor(zbClient) {
        this.outboundConnectors = new Set();
        this.outboundWorkers = {};
        this.zbc = zbClient || new zeebe_node_1.ZBClient();
    }
    addOutboundConnector(connectorConstructor) {
        return __awaiter(this, void 0, void 0, function* () {
            const md = (0, camunda_connector_sdk_1.getOutboundConnectorDescription)(connectorConstructor);
            (0, log_1.log)("Adding Connector:");
            (0, log_1.log)(md);
            const handler = new connectorConstructor();
            const w = this.zbc.createWorker({
                taskType: md.type,
                fetchVariable: md.inputVariables,
                taskHandler: (job) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const ctx = new camunda_connector_sdk_1.OutboundConnectorContext({ job });
                    try {
                        (0, log_1.log)(`Executing handler for ${md.type}`);
                        const res = (_a = (yield handler.execute(ctx))) !== null && _a !== void 0 ? _a : {};
                        (0, log_1.log)(`Completing job with variables`);
                        (0, log_1.log)(res);
                        return job.complete(res);
                    }
                    catch (e) {
                        if (e instanceof camunda_connector_sdk_1.BPMNError) {
                            (0, log_1.log)(`Business error thrown in connector handler ${md.type}`);
                            (0, log_1.log)(e.message);
                            return job.error(e.message);
                        }
                        (0, log_1.log)(`Exception thrown in connector handler ${md.type}`);
                        (0, log_1.log)(e);
                        return job.fail(e.message);
                    }
                })
            });
            this.outboundWorkers[md.name] = w;
            this.outboundConnectors.add(md.name);
        });
    }
    removeOutboundConnector(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.outboundConnectors.has(name)) {
                return this.outboundWorkers[name].close().then(() => {
                    this.outboundConnectors.delete(name);
                    delete this.outboundWorkers[name];
                });
            }
        });
    }
    stop() {
        return Object.values(this.outboundWorkers).map(w => w.close());
    }
}
exports.WorkerConnectorRuntime = WorkerConnectorRuntime;
