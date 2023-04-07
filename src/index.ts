import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Basic Configuration
const port: number =
  process.env.PORT != null ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

app.post('/api/users', async (req: Request, res: Response) => {
  const { username } = req.body;

  const user = await prisma.user.upsert({
    where: { username: username },
    create: { username: username },
    update: {}, // if user exists, do not update
  });
  res.json({ _id: user.id, username: user.username });
});

app.get('/api/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
