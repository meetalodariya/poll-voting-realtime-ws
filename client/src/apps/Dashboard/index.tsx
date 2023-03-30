import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useQuery, useQueryClient } from 'react-query';
import styled from '@emotion/styled';
import AddIcon from '@mui/icons-material/Add';
import TrendingUp from '@mui/icons-material/TrendingUp';

import WebSocketClient from '@utils/websocketClient';
import { httpGet } from '@utils/axiosRequests';

import { Poll } from '../../types';
import PollGrid from './PollGrid';
import AddDialogue from './AddDialogue';

type onlineUsersEventData = {
  event: 'online/users';
  data: { value: number };
};

type pollInsertEventData = {
  event: 'polls/insert';
  data: Partial<Poll>;
};

type pollVoteCountUpdateEventData = {
  event: 'polls/voteCountUpdate';
  data: {
    pollId: string;
    totalVoteCount: number;
  };
};

type webSocketEvent =
  | onlineUsersEventData
  | pollInsertEventData
  | pollVoteCountUpdateEventData;

const DashboardContainer = styled.div`
  margin-left: 150px;
  margin-right: 150px;
  margin-top: 80px;
  flex-direction: column;
  justify-content: center;
  display: flex;
  gap: 24px;
`;

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [totalOnlineUsers, setTotalOnlineUsers] = useState<number>(null);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data, isFetching } = useQuery(
    'getAllPolls',
    () =>
      httpGet<Array<Partial<Poll>>>({
        url: '/polls',
      }),
    { refetchOnWindowFocus: false },
  );

  useEffect(() => {
    // Subscribing to websocket events.
    const websocketClient = new WebSocketClient(
      'ws://localhost:3000?subscribe=online/users,polls/insert,polls/voteCountUpdate',
    );
    const websocketClientInstance = websocketClient.getInstance();

    const handleSocketMessage = (ev: MessageEvent<string>) => {
      const { event, data: eventData } = JSON.parse(ev.data) as webSocketEvent;

      switch (event) {
        case 'online/users':
          setTotalOnlineUsers(eventData.value);
          break;
        case 'polls/insert': {
          const { _id } = eventData;
          const isFetchingPolls = queryClient.isFetching('getAllPolls');

          if (!isFetchingPolls) {
            queryClient.setQueryData(
              'getAllPolls',
              (oldQueryData: Partial<Poll>[]) => {
                const exists = oldQueryData.some((poll) => poll._id === _id);

                if (!exists) {
                  return [...oldQueryData, eventData];
                }

                return oldQueryData;
              },
            );
          }
          break;
        }
        case 'polls/voteCountUpdate': {
          const { pollId, totalVoteCount } = eventData;
          const isFetchingPolls = queryClient.isFetching('getAllPolls');

          if (!isFetchingPolls) {
            queryClient.setQueryData(
              'getAllPolls',
              (oldQueryData: Partial<Poll>[]) => {
                if (oldQueryData.length) {
                  return oldQueryData.map((poll) =>
                    poll._id === pollId
                      ? {
                          ...poll,
                          totalVoteCount,
                        }
                      : poll,
                  );
                }

                return oldQueryData;
              },
            );
          }
          break;
        }
        default:
          console.log('should not reach here');
      }
    };

    websocketClientInstance.addEventListener('message', handleSocketMessage);

    return () => {
      websocketClient.terminate();
    };
  }, [queryClient]);

  return (
    <>
      <Box>
        <Box
          component='main'
          sx={{
            flexGrow: 1,
          }}
        >
          <DashboardContainer data-testid={'dashboard-container'}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant='h4'>
                <TrendingUp fontSize='large' /> Online Users:{' '}
                {totalOnlineUsers ? totalOnlineUsers : '--'}
              </Typography>
              <Button
                color='secondary'
                variant='contained'
                size='medium'
                onClick={handleOpen}
                data-testid='add-poll-button'
                disabled={isFetching}
                startIcon={<AddIcon />}
              >
                Add Poll
              </Button>
            </div>
            <PollGrid data={data} isLoading={isFetching} />
          </DashboardContainer>
          <AddDialogue handleClose={handleClose} open={open} />
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
