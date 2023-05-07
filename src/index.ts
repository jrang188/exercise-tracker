import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import cors from "cors";
import exerciseRoutes from "./routes/exerciseRoutes";

dotenv.config();
const app = express();

// Basic Configuration
const port: number =
  process.env.PORT != null ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

app.use("/api/users", exerciseRoutes);

app.listen(port);
