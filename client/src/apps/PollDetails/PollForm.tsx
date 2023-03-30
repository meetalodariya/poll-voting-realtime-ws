import React, { FC, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { Poll } from '../../types';

interface Props {
  data: Partial<Poll>;
  handleUserVote: (optionId: string) => void;
}

const PollForm: FC<Props> = ({ data, handleUserVote }) => {
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedOptionId) {
      return;
    }

    setIsSubmitting(true);

    await handleUserVote(selectedOptionId);

    setIsSubmitting(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptionId(event.target.value);
  };

  return (
    <>
      <div
        style={{
          marginTop: '20px',
          marginBottom: '24px',
          height: '300px',
          overflow: 'auto',
        }}
      >
        <FormControl>
          <RadioGroup
            name='options-radio-buttons-group'
            onChange={handleChange}
          >
            {data.options.map((option, index) => (
              <FormControlLabel
                key={option._id}
                value={option._id}
                control={<Radio />}
                sx={{
                  marginTop: '14px',
                  marginBottom: '14px',
                }}
                label={<Typography variant='h6'>{option.title}</Typography>}
                data-testid={`poll-form-option-${index}`}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
      <Button
        onClick={handleSubmit}
        variant='contained'
        data-testid='poll-form-submit-button'
      >
        {isSubmitting ? (
          <CircularProgress size={18} color='secondary' />
        ) : (
          <>Submit</>
        )}
      </Button>
    </>
  );
};

export default PollForm;
