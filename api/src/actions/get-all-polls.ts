import { Request, Response, NextFunction } from 'express';
import { Polls } from '../models/poll';

export const getAllPollsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allPolls = await Polls.find({}).select({ options: 0 });

    res.json(allPolls);
  } catch (e) {
    next(e);
  }
};
