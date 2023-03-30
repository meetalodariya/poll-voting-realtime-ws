import React, { FC, useMemo } from 'react';
import Card from '@mui/material/Card';
import { useNavigate } from 'react-router-dom';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Poll } from '../../types';
import PollIcon from '@mui/icons-material/BarChart';
import ClockIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styled from '@emotion/styled';
import { useApp } from 'src/providers/app';
import { getTimeSinceString } from '@utils/time';

interface Props {
  data: Partial<Poll>;
}

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  font-family: 'Roboto';
  display: flex;
  direction: column;

  :hover {
    color: #2e8b57;
    cursor: pointer;
    border: 1px solid #2e8b57;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px,
      rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px;
  }
`;

const StyledCardContent = styled(CardContent)`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 0px;
`;

const IconTextContainer = styled.div`
  display: flex;
  gap: 3px;
`;

const PollFooterContainer = styled.div`
  margin-top: 8px;
  color: rgba(109, 109, 100);
`;

const PollCard: FC<Props> = ({ data }) => {
  const { _id, author, createdAt, prompt, totalVoteCount } = data;
  const navigate = useNavigate();
  const { answeredPolls } = useApp();
  const answeredPoll = answeredPolls[_id];
  const answeredDate = answeredPoll
    ? new Date(answeredPoll.answeredAt).toLocaleDateString()
    : null;

  const truncatedPrompt = useMemo(
    () => (prompt.length > 40 ? prompt.slice(0, 40) + '...' : prompt),
    [prompt],
  );

  const formattedCreatedTimestamp = useMemo(
    () => getTimeSinceString(createdAt),
    [createdAt],
  );

  return (
    <>
      <StyledCard
        onClick={() => {
          navigate(`/poll/${_id}`);
        }}
      >
        <StyledCardContent>
          <Typography
            variant='h5'
            fontWeight='600'
            component={'div'}
            sx={{
              maxHeight: '140px',
            }}
            title={prompt}
          >
            {truncatedPrompt}
          </Typography>
          <div>
            {answeredPoll && (
              <IconTextContainer>
                <CheckCircleIcon sx={{ color: '#008000' }} />
                <Typography component='span' sx={{ paddingTop: '2px' }}>
                  Answered on {answeredDate}
                </Typography>
              </IconTextContainer>
            )}
            <IconTextContainer title='Total Votes'>
              <PollIcon />
              <Typography component='span'>{totalVoteCount}</Typography>
            </IconTextContainer>
            <PollFooterContainer>
              <IconTextContainer>
                <ClockIcon />
                <Typography component='span' sx={{ paddingTop: '2px' }}>
                  {formattedCreatedTimestamp}
                </Typography>
              </IconTextContainer>
              <IconTextContainer>
                <PersonIcon />
                <Typography component='span' sx={{ paddingTop: '2px' }}>
                  {author}
                </Typography>
              </IconTextContainer>
            </PollFooterContainer>
          </div>
        </StyledCardContent>
      </StyledCard>
    </>
  );
};

export default PollCard;
