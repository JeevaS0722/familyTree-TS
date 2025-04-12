import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { open } from '../store/Reducers/modalReducer';
import { errorMessage } from '../utils/constants';

export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator?.onLine || true);
  const error = useAppSelector(state => state.error);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error.error) {
      try {
        void fetch('/assets/favicon.png', {
          method: 'HEAD',
          cache: 'no-store',
        })
          .then(res => {
            if (!res.ok) {
              setIsOnline(false);
            } else {
              dispatch(
                open({
                  title: 'Service Unavailable',
                  message: errorMessage.serviceUnavailable,
                })
              );
            }
          })
          .catch(() => setIsOnline(false));
      } catch (error) {
        setIsOnline(false);
      }
    }
  }, [error.error]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
