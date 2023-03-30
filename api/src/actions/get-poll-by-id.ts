import { Request, Response, NextFunction } from 'express';
import HttpError from '../exceptions/http-error';
import { Polls } from '../models/poll';

export const getPollById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pollId = req.params.pollId;
    const { isAlreadyAnswered } = req.query;

    const poll = await Polls.findById(pollId)
      .select({
        ...(!isAlreadyAnswered
          ? {
              'options.votes': 0,
            }
          : {}),
      })
      .orFail(new HttpError('Not found', 404));

    res.json(poll);
  } catch (e) {
    next(e);
  }
};
