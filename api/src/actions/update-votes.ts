import { Request, Response, NextFunction } from 'express';

import { Polls } from '../models/poll';
import HttpError from '../exceptions/http-error';
import { formatPollStatusResponse } from '../utils/poll-status';

export const updatePollVotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { optionId, pollId } = req.body;

    if (!optionId || !pollId) {
      throw new HttpError('OptionId and PollId not provided', 400);
    }

    const updatedPoll = await Polls.findOneAndUpdate(
      { _id: pollId, 'options._id': optionId },
      {
        $inc: { 'options.$.votes': 1, totalVoteCount: 1 },
      },
      { new: true },
    ).orFail(new HttpError('Not found', 404));

    res.json(updatedPoll).end();

    Promise.all([
      req.webSocketServerClient.broadcast('polls/voteCountUpdate', {
        pollId,
        totalVoteCount: updatedPoll.totalVoteCount,
      }),
      req.webSocketServerClient.broadcast(
        `polls/update/${updatedPoll._id}`,
        formatPollStatusResponse(updatedPoll),
      ),
    ]);
  } catch (e) {
    next(e);
  }
};
