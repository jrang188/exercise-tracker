"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Basic Configuration
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static("public"));
app.get("/", (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map
