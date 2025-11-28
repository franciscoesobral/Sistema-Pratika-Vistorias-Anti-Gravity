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
exports.financeiroRoutes = financeiroRoutes;
const FinanceiroController_1 = require("../controllers/FinanceiroController");
function financeiroRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        // Contas a Receber
        app.post('/financeiro/receber', FinanceiroController_1.createContaReceber);
        app.get('/financeiro/receber', FinanceiroController_1.listContasReceber);
        app.put('/financeiro/receber/:id', FinanceiroController_1.updateContaReceber);
        // Contas a Pagar
        app.post('/financeiro/pagar', FinanceiroController_1.createContaPagar);
        app.get('/financeiro/pagar', FinanceiroController_1.listContasPagar);
        app.put('/financeiro/pagar/:id', FinanceiroController_1.updateContaPagar);
    });
}
