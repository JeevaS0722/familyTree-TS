import React, { useEffect, useState } from 'react';
import {
  NovuProvider,
  PopoverNotificationCenter,
} from '@novu/notification-center';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../../store/hooks';
import Badge from '@mui/material/Badge';
import './notification.css';
import NoticationIcon from '@mui/icons-material/Notifications';
import Grid from '@mui/material/Grid';
import { useGetUserQuery } from '../../store/Services/userService';
import { useNavigate } from 'react-router-dom';
import { useGetSubscriberHMACHashQuery } from '../../store/Services/notificationService';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

const CustomNotificationCenter: React.FC<{
  unseenCount?: number;
  title: string;
}> = ({ unseenCount, title }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTab = useMediaQuery(theme.breakpoints.down('xl'));
  const isMediumScreenTwo = useMediaQuery('(min-width:1300px)');
  return (
    <Tooltip title="Notifications">
      <Box
        className="hover-menu"
        sx={
          isMobile
            ? { cursor: 'pointer', padding: '0px', justifyContent: 'flex-end' }
            : {
                flexGrow: 1,
                display: 'flex',
                cursor: 'pointer',
              }
        }
        // component={!isMobile ? Button : undefined}
        id="notification-layout"
      >
        <Grid
          container
          id="notification"
          sx={
            isMobile
              ? {
                  width: 'fit-content',
                }
              : isTab
                ? {
                    flexGrow: 1,
                    display: 'flex',
                    cursor: 'pointer',
                  }
                : {
                    padding: '0px',
                  }
          }
        >
          <Badge
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#0081F1',
              },
              // width: isTab && !isMobile ? '25%' : undefined,
            }}
            componentsProps={{
              badge: { id: 'notification-count' },
            }}
            badgeContent={unseenCount}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <NoticationIcon
              sx={{
                color: '#cfd2da',
                fontSize: isMobile ? '1.6rem' : '1rem',
              }}
            />
          </Badge>
          {!isMobile && isMediumScreenTwo && (
            <Typography
              noWrap
              sx={{
                color: '#cfd2da',
                fontSize: '0.9rem',
                // width: isTab && !isMobile ? '65%' : undefined,
                cursor: 'pointer',
                paddingLeft: '5px',
              }}
              id="notification-title"
            >
              {title}
            </Typography>
          )}
        </Grid>
      </Box>
    </Tooltip>
  );
};

const Notification: React.FC = () => {
  const theme = useTheme();
  const isTab = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const styles = {
    header: {
      title: {
        color: 'black',
      },
      markAsRead: {
        color: 'black',
        opacity: 1,
      },
    },
    bellButton: {
      dot: {
        rect: {
          fill: '#0081F1',
        },
      },
    },
    unseenBadge: {
      root: { background: '#0081F1' },
    },
    layout: {
      root: isMobile
        ? {
            left: '5%',
            top: '10%',
            width: '90%',
            position: 'fixed',
            marginTop: '50px',
          }
        : isTab
          ? { marginTop: '50px' }
          : {},
    },
    loader: {
      root: {
        stroke: '#0081F1',
      },
    },
    notifications: {
      listItem: {
        dotsButton: {
          path: {
            fill: 'oklch(from #0081F1 l c h)',
          },
        },
        unread: {
          '::before': { background: '#0081F1' },
          fontWeight: 600,
          color: 'black',
        },
        read: {
          color: 'black',
        },
        timestamp: {
          color: 'black',
          opacity: 0.8,
        },
      },
    },
  };
  const user = useAppSelector(state => state.user);
  const notification = useAppSelector(state => state.notification);
  useGetUserQuery('');
  useGetSubscriberHMACHashQuery();
  const navigate = useNavigate();
  const [state, setState] = useState<boolean>(false);
  useEffect(() => {
    if (state) {
      setState(false);
    }
  }, [state]);

  return (
    <>
      {!state && user.userId && notification.subscriberHash ? (
        <NovuProvider
          subscriberId={user.userId}
          applicationIdentifier={process.env.REACT_APP_NOVU_APP_ID || ''}
          subscriberHash={notification.subscriberHash}
          styles={styles}
        >
          <PopoverNotificationCenter
            colorScheme="light"
            showUserPreferences={false}
            position="bottom"
            footer={() => <></>}
            onNotificationClick={row => {
              setState(true);
              navigate('/document/report', {
                state: {
                  docId: row?.payload?.id,
                },
              });
            }}
            allowedNotificationActions={false}
          >
            {({ unseenCount }) => (
              <CustomNotificationCenter
                unseenCount={Number(unseenCount)}
                title="Notifications"
              />
            )}
          </PopoverNotificationCenter>
        </NovuProvider>
      ) : (
        <Typography component={'span'}></Typography>
      )}
    </>
  );
};

export default Notification;
