import React, { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Typography } from '@mui/material';

import { httpGet, httpPatch } from '@utils/axiosRequests';
import WebSocketClient from '@utils/websocketClient';

import { Poll } from '../../types';
import { useApp } from '../../providers/app';
import PollDetailsContainer from './PollDetailsContainer';

const PollDetailsWrapper = styled.div`
  margin-left: 150px;
  margin-right: 150px;
  margin-top: 80px;
  flex-direction: column;
  justify-content: center;
  display: flex;
  gap: 24px;
`;

type pollUpdateEventData = {
  event: 'polls/update';
  data: {
    totalVoteCount: number;
    'options/votes': {
      [optionId: string]: number;
    };
  };
};

type webSocketEvent = pollUpdateEventData;

const PollDetails = () => {
  const app = useApp();
  const queryClient = useQueryClient();
  const { pollId } = useParams();
  const navigate = useNavigate();
  const queryKey = useMemo(() => ['getPollById', pollId], [pollId]);

  const answeredPoll = app.answeredPolls[pollId];
  const isPollAlreadyAnswered = !!answeredPoll;

  const { data, isFetching } = useQuery(
    queryKey,
    () =>
      httpGet<Partial<Poll>>({
        url: `/poll/${pollId}`,
        params: {
          // only send poll results if it's already answered
          // Could've used GraphQL to solve (under/over)fetching
          isAlreadyAnswered: isPollAlreadyAnswered,
        },
      }),
    {
      refetchOnWindowFocus: false,
      onError: () => {
        // Error handling
      },
    },
  );

  useEffect(() => {
    // Don't enable live vote updates until user answers/votes on the poll.
    if (!isPollAlreadyAnswered) {
      return;
    }

    const websocketClient = new WebSocketClient(
      // Subscribe to the updates on particular poll
      `ws://localhost:3000?subscribe=polls/update/${pollId}`,
    );
    const websocketClientInstance = websocketClient.getInstance();

    const handleSocketMessage = (ev: MessageEvent<string>) => {
      const { event, data: eventData } = JSON.parse(ev.data) as webSocketEvent;

      switch (event) {
        case `polls/update/${pollId}`:
          {
            const isFetchingPolls = queryClient.isFetching(queryKey);

            if (!isFetchingPolls) {
              queryClient.setQueryData(
                queryKey,
                (existingPoll: Partial<Poll>) => {
                  const updatedOptions = existingPoll.options.map((option) => {
                    const updatedOptionVotes =
                      eventData['options/votes'][option._id];
                    return typeof updatedOptionVotes === 'number'
                      ? {
                          ...option,
                          votes: updatedOptionVotes,
                        }
                      : option;
                  });

                  return {
                    ...existingPoll,
                    options: updatedOptions,
                    totalVoteCount: eventData.totalVoteCount,
                  };
                },
              );
            }
          }
          break;
        default:
          console.log('should not reach here');
      }
    };

    websocketClientInstance.addEventListener('message', handleSocketMessage);

    return () => {
      websocketClient.terminate();
    };
  }, [isPollAlreadyAnswered, queryClient, queryKey, pollId]);

  const handleUserVote = async (optionId: string) => {
    try {
      if (isPollAlreadyAnswered) {
        return;
      }

      const data = await httpPatch<Poll>({
        url: '/poll/vote',
        data: { optionId, pollId },
      });

      app.handleAnswerSelection(pollId, optionId, new Date());

      queryClient.setQueriesData(queryKey, data);
    } catch (err) {
      // Error handling
    }
  };

  return (
    <>
      <PollDetailsWrapper data-testid='poll-details-wrapper'>
        <div>
          <Button
            onClick={() => {
              navigate('/');
            }}
            variant='text'
            startIcon={<ArrowBackIcon />}
          >
            <Typography
              variant='h6'
              sx={{
                marginTop: '4px',
              }}
            >
              Dashboard
            </Typography>
          </Button>
        </div>
        <PollDetailsContainer
          data={data}
          isLoading={isFetching}
          answeredPoll={answeredPoll}
          handleUserVote={handleUserVote}
        />
      </PollDetailsWrapper>
    </>
  );
};

export default PollDetails;
