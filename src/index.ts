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
  res.json({ _id: user.id.toString, username: user.username });
});

app.get('/api/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/api/users/:id/exercises', async (req: Request, res: Response) => {
  const { description, duration, date } = req.body;
  console.log(req.body);
  console.log(req.params);
  const exerciseSession = await prisma.exerciseSession.create({
    data: {
      desc: description,
      duration: parseInt(duration),
      date: date ? new Date(date) : new Date(),
      User: {
        connect: {
          id: parseInt(req.params.id),
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  res.json({
    username: user?.username,
    _id: exerciseSession.userId.toString(),
    description: exerciseSession.desc,
    duration: exerciseSession.duration,
    date: exerciseSession.date.toDateString(),
  });
});

app.get('/api/users/:id/logs', async (req: Request, res: Response) => {
  const from = req.query.from ? new Date(req.query.from as string) : undefined;
  const to = req.query.to ? new Date(req.query.to as string) : undefined;
  const limit = req.query.limit
    ? parseInt(req.query.limit as string)
    : undefined;

  const logs = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      sessions: {
        where: {
          date: {
            gte: from,
            lt: to,
          },
        },
      },
    },
  });

  const filteredLogs = logs?.sessions.filter((session) => {
    return {
      description: session.desc,
      duration: session.duration,
      date: session.date.toDateString(),
    }
  }).slice(0, limit);


  const response = {
    username: logs?.username,
    _id: logs?.id.toString(),
    count: filteredLogs?.length,
    log: filteredLogs,
  };

  res.json(response);
});

app.listen(port);
