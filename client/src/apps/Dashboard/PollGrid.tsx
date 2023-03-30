import React, { FC } from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

import { Poll } from '../../types';
import PollCard from './PollCard';

interface Props {
  isLoading: boolean;
  data: Array<Partial<Poll>> | null;
}

const PollGrid: FC<Props> = ({ isLoading, data }) => {
  return (
    <>
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
        <Grid
          container
          spacing={2}
          paddingBottom={3}
          sx={{ overflow: 'auto', height: '80vh' }}
        >
          {!!data.length &&
            data.map((item) => (
              <Grid item xs={3} key={item._id}>
                <PollCard data={item} />
              </Grid>
            ))}
        </Grid>
      )}
    </>
  );
};

export default PollGrid;
