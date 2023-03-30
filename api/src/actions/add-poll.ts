import { Request, Response, NextFunction } from 'express';
import lodash from 'lodash';
import HttpError from '../exceptions/http-error';
import { PollInput, Polls } from '../models/poll';

export const addPollController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body as PollInput;

    if (!data.author || !data.prompt || data.options?.length < 1) {
      throw new HttpError('Bad request', 400);
    }

    const newPoll = await Polls.create(data);

    res.json({ id: newPoll._id });

    req.webSocketServerClient.broadcast(
      'polls/insert',
      lodash.omit(newPoll, ['options']),
    );
  } catch (e) {
    next(e);
  }
};
