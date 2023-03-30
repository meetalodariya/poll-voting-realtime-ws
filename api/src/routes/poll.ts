import { Router } from 'express';
import { addPollController } from '../actions/add-poll';
import { getAllPollsController } from '../actions/get-all-polls';
import { getPollById } from '../actions/get-poll-by-id';
import { updatePollVotes } from '../actions/update-votes';

const router = Router();

router.post('/poll', addPollController);
router.get('/polls', getAllPollsController);
router.get('/poll/:pollId', getPollById);
router.patch('/poll/vote', updatePollVotes);

export default router;
