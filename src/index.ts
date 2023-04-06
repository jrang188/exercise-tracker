import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();
const app = express();

// Basic Configuration
const port: number =
  process.env.PORT != null ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});