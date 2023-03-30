import React, { FC, useMemo } from 'react';
import styled from '@emotion/styled';
import { LinearProgress, Typography } from '@mui/material';

import { answeredPollData } from 'src/providers/app';
import { Poll } from '../../types';
import ResultsPieChart from './ResultsPieChart';

interface Props {
  data: Partial<Poll>;
  answeredPoll: answeredPollData | null;
}

const PollResults: FC<Props> = ({ data, answeredPoll }) => {
  const totalVotes = data.totalVoteCount;
  const answeredDate = answeredPoll
    ? new Date(answeredPoll.answeredAt).toLocaleDateString()
    : null;

  return (
    <>
      <div
        style={{
          marginTop: '20px',
          marginBottom: '24px',
          display: 'flex',
          height: '400px',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: '40%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'auto',
          }}
        >
          {data.options.map((option) => {
            const votePercentage = Math.round(
              (option.votes * 100) / totalVotes,
            );

            return (
              <div
                style={{
                  marginBottom: '18px',
                  opacity:
                    option._id === answeredPoll.selectedOptionId
                      ? 'unset'
                      : '0.6',
                }}
                key={option._id}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    title={option.title}
                    sx={{
                      maxWidth: '60%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {option.title}
                  </Typography>
                  <Typography>{`${votePercentage}% (${option.votes} vote(s))`}</Typography>
                </div>
                <LinearProgress variant='determinate' value={votePercentage} />
              </div>
            );
          })}
        </div>
        <div
          style={{
            width: '40%',
          }}
          data-testid='poll-results-pie-chart'
        >
          <ResultsPieChart data={data.options} />
        </div>
      </div>
      <div>Total Votes: {totalVotes}</div>
      {answeredDate && (
        <Typography
          variant='h6'
          sx={{
            color: 'rgba(109, 109, 100)',
          }}
        >
          You answered this poll on {answeredDate}
        </Typography>
      )}
    </>
  );
};

export default PollResults;
