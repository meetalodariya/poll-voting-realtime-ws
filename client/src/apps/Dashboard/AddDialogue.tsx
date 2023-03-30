import React, { FC, useCallback, useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { httpPost } from '@utils/axiosRequests';

import { useApp } from '../../providers/app';
import { Poll } from '../../types';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const formInitialData = {
  prompt: '',
  options: [{ title: '' }, { title: '' }],
  author: '',
};

const AddDialogue: FC<Props> = ({ open, handleClose }) => {
  const app = useApp();
  const [formData, setFormData] = useState<Partial<Poll>>(formInitialData);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: Partial<Poll>) => httpPost({ url: '/poll', data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getAllPolls');
      },
    },
  );

  const submitUpdateForm = useCallback(() => {
    mutation.mutate(formData);
    handleClose();
    setFormData(formInitialData);
  }, [formData, handleClose, mutation]);

  const handleChange = ({ name, value }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const addOptionRow = () => {
    const lastOption = formData.options[formData.options.length - 1];
    if (formData.options.length === 0 || lastOption.title) {
      const rowsInput = {
        title: '',
      };
      setFormData({
        ...formData,
        options: [...formData.options, rowsInput],
      });
    }
  };

  const deleteOptionTitle = (index) => {
    if (formData.options.length > 2) {
      const rows = [...formData.options];
      rows.splice(index, 1);
      setFormData({
        ...formData,
        options: rows,
      });
    }
  };

  const handleOptionTitleChange = (index, event) => {
    const { value } = event.target;
    const rowsInput = [...formData.options];
    rowsInput[index].title = value;
    setFormData({
      ...formData,
      options: rowsInput,
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        data-testid='add-poll-dialog'
      >
        <DialogTitle>Add Poll</DialogTitle>
        <DialogContent sx={{ paddingRight: '20px', paddingLeft: '20px' }}>
          <TextField
            data-testid={'add-poll-prompt-field'}
            autoFocus
            margin='dense'
            label='Prompt'
            name='prompt'
            placeholder='What is the best destination for upcoming summer trip ?'
            type='text'
            fullWidth
            variant='outlined'
            value={formData.prompt}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
            style={{ marginBottom: '12px' }}
          />
          <TextField
            data-testid={'add-poll-author-field'}
            margin='dense'
            label='Name of Author'
            name='author'
            type='text'
            fullWidth
            variant='outlined'
            value={formData.author}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
            style={{ marginBottom: '12px' }}
          />
          {formData.options.map((option, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <TextField
                type='text'
                value={option.title}
                onChange={(evnt) => handleOptionTitleChange(index, evnt)}
                name='title'
                className='form-control'
                id='outlined-basic'
                label={`Option ${index + 1}`}
                placeholder={`Option ${index + 1}`}
                variant='outlined'
                fullWidth
                data-testid={`option-title-input-${index}`}
              />
              <IconButton
                onClick={() => deleteOptionTitle(index)}
                data-testid={`delete-option-button-${index}`}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
          <IconButton
            onClick={addOptionRow}
            data-testid={'append-option-button'}
          >
            <AddIcon />
          </IconButton>
        </DialogContent>
        <DialogActions>
          <Button color='warning' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color='success'
            onClick={submitUpdateForm}
            data-testid={'add-poll-submit-button'}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddDialogue;
