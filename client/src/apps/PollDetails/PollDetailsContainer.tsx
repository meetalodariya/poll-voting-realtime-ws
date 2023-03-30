import React, { FC, useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { getTimeSinceString } from '@utils/time';

import { answeredPollData } from 'src/providers/app';
import { Poll } from '../../types';
import PollForm from './PollForm';
import PollResults from './PollResults';

interface Props {
  data: Partial<Poll> | null;
  isLoading: boolean;
  answeredPoll: answeredPollData | null;
  handleUserVote: (optionId: string) => void;
}

const Container = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`;

const PollInfo = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
  color: rgba(109, 109, 100);
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PollDetailsContainer: FC<Props> = ({
  data,
  isLoading,
  answeredPoll,
  handleUserVote,
}) => {
  const formattedCreatedTimestamp = useMemo(
    () => data?.createdAt && getTimeSinceString(data.createdAt),
    [data],
  );

  return (
    <Container>
      {isLoading && !data ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <CircularProgress color='primary' />
        </div>
      ) : (
        <>
          <Typography variant='h3'>{data.prompt}</Typography>
          <PollInfo>
            <Typography variant='body1'>by {data.author}</Typography>
            {'·'}
            <Typography variant='body1'>{formattedCreatedTimestamp}</Typography>
          </PollInfo>
          {!answeredPoll ? (
            <PollForm data={data} handleUserVote={handleUserVote} />
          ) : (
            <PollResults data={data} answeredPoll={answeredPoll} />
          )}
        </>
      )}
    </Container>
  );
};

export default PollDetailsContainer;
