import React, { useState } from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAppSelector } from '../../store/hooks';
import { Link } from 'react-router-dom';

const links: { [key: string]: string } = {
  'Ready for Offer': '/actionItem/readyForOffer',
  'File Review': '/actionItem/fileReview',
  'My Tasks': '/actionItem/myTasks',
  'Urgent Tasks': '/actionItem/urgentTasks',
  'Research Tasks': '/actionItem/researchTasks',
  'Requests 21+ days': '/actionItem/requestBefore21Days',
  'Checked Out': '/actionItem/checkedOut',
  'Unreceived Requests': '/actionItem/unreceivedRequests',
  'Requests to Send': '/actionItem/requestsToSend',
  'Offers to Send': '/actionItem/offersToSend',
  'Deeds Pending': '/actionItem/deedsPending',
};

const LayoutsPage: React.FC = () => {
  const actions = useAppSelector(state => state.dashboard.actions);
  const [active, setActive] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleChange = (index: number) => {
    setActive(index);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ marginTop: '0px' }}
      justifyContent={'center'}
    >
      {isMobile &&
        actions.map((action, index) => (
          <Grid
            key={action.actionName}
            item
            container
            sx={{ justifyContent: 'center' }}
            md={1}
            sm={3}
            xs={6}
          >
            <Chip
              onClick={() => handleChange(index)}
              id={action.actionName?.split(' ')?.join('-') + '-chip'}
              sx={
                active === index
                  ? {
                      background: 'white',
                      ':focus': { background: 'white' },
                      color: 'black',
                    }
                  : {}
              }
              label={
                <Typography
                  sx={active === index ? { color: 'black' } : {}}
                  id={action.actionName?.split(' ')?.join('-') + '-chip-label'}
                >
                  {action.actionName}
                </Typography>
              }
            />
          </Grid>
        ))}
      {actions.map((action, index) => {
        const color = ['#1BC98E', '#E64759', '#E4D836', '#1997c6'];
        if (isMobile) {
          if (active !== index) {
            return <></>;
          }
        }
        return (
          <Grid
            key={action.actionName}
            sx={!isMobile ? {} : { paddingTop: '0px' }}
            item
            xs={12}
            md={3}
            sm={6}
          >
            {!isMobile && (
              <Typography
                sx={{
                  textAlign: 'center',
                  borderBottom: '1px solid #fff',
                  lineHeight: '0.1em',
                }}
              >
                <Box
                  component="span"
                  id={action.actionName?.split(' ')?.join('-')}
                  sx={{
                    padding: '0 10px',
                    lineHeight: '0px',
                    backgroundColor: '#10141F',
                  }}
                >
                  {action.actionName}
                </Box>
              </Typography>
            )}
            {action.data.map(actionItem => (
              <Grid
                container
                alignItems={'center'}
                mt={2}
                sx={{
                  height: '100px',
                  placeContent: 'center',
                  width: '100%',
                  background: color[index % 4],
                }}
                key={actionItem.label}
              >
                <Grid
                  item
                  xs={12}
                  id={actionItem.label?.split(' ')?.join('-') + '-count'}
                  sx={{ textAlign: 'center' }}
                >
                  {actionItem.count}
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  {action.actionName === 'DONE' ? (
                    <Typography
                      id={actionItem.label?.split(' ')?.join('-')}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.65)',
                        fontWeight: 'normal',
                      }}
                    >
                      {actionItem.label}
                    </Typography>
                  ) : (
                    <Button
                      id={actionItem.label?.split(' ')?.join('-')}
                      sx={{
                        color: 'black',
                        background: 'white',
                        textDecoration: 'none',
                        '&:hover': {
                          backgroundColor: '#fff',
                          color: '#3c52b2',
                          opacity: '1 !important',
                          textDecoration: 'none !important',
                        },
                      }}
                      variant={'contained'}
                      component={Link}
                      to={
                        links[actionItem.label] ??
                        (actionItem.label.includes('Tasks')
                          ? '/actionItem/teamMateTasks'
                          : undefined)
                      }
                    >
                      {actionItem.label}
                    </Button>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default LayoutsPage;
