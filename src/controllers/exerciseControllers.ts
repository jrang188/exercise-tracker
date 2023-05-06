import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const addUser = async (req: Request, res: Response) => {
  const { username } = req.body;

  const user = await prisma.user.upsert({
    where: { username: username },
    create: { username: username },
    update: {}, // if user exists, do not update
  });
  res.json({ _id: user.id.toString(), username: user.username });
};

const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  const response = users.map((user) => {
    return {
      _id: user.id.toString(),
      username: user.username,
    };
  });

  res.json(response);
};

const addExercise = async (req: Request, res: Response) => {
  const { description, duration, date } = req.body;
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
};

const getUserLogs = async (req: Request, res: Response) => {
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

  const filteredLogs = logs?.sessions
    .map((session) => {
      return {
        description: session.desc,
        duration: session.duration,
        date: session.date.toDateString(),
      };
    })
    .slice(0, limit);

  const response = {
    username: logs?.username,
    _id: logs?.id.toString(),
    count: filteredLogs?.length,
    log: filteredLogs,
  };

  console.log(response);
  console.log(filteredLogs);

  res.json(response);
};

export { addUser, getUsers, addExercise, getUserLogs };
