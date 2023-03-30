import { PollDocument } from '../models/poll';

export const formatPollStatusResponse = (pollDoc: PollDocument) => {
  const { options, totalVoteCount } = pollDoc;

  const updatedOptions = options.reduce((acc, opt) => {
    acc[opt._id] = opt.votes;

    return acc;
  }, {});

  return { totalVoteCount, 'options/votes': { ...updatedOptions } };
};
