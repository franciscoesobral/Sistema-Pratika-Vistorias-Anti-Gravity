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
exports.peritosRoutes = peritosRoutes;
const PeritosController_1 = require("../controllers/PeritosController");
function peritosRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post('/peritos', PeritosController_1.createPerito);
        app.get('/peritos', PeritosController_1.listPeritos);
        app.get('/peritos/:id', PeritosController_1.getPerito);
        app.put('/peritos/:id', PeritosController_1.updatePerito);
        app.delete('/peritos/:id', PeritosController_1.deletePerito);
    });
}
