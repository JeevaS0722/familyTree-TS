import { useSelector } from 'react-redux';
import moment, { Moment } from 'moment-timezone'; // Import the Moment type
import { RootState } from '../store';
import { useEffect, useState } from 'react';

const useDateTime = (): {
  // formatDate: (date: string, format?: string) => string;
  formatDateTime: (
    date: string | null | undefined,
    format?: string,
    applyTimezoneConversion?: boolean
  ) => string;
  formatDateByMonth(date?: string | Date | Moment | null | undefined): string;
} => {
  // Retrieve the server timezone from Redux state
  const serverTimezone = useSelector(
    (state: RootState) => state.serverTimezone.serverTimezone
  );
  const [clientTimezone, setClientTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (currentTimezone !== clientTimezone) {
      setClientTimezone(currentTimezone);
    }
  }, [clientTimezone]);

  const formatDateTimeMoment = (
    date: string,
    format: string = 'YYYY-MM-DD hh:mm A',
    applyTimezoneConversion: boolean = false
  ): string => {
    if (!date) {
      return '';
    }
    if (applyTimezoneConversion) {
      return moment.tz(date, serverTimezone).tz(clientTimezone).format(format);
    }
    return moment(date).format(format);
  };

  const formatDateTime = (
    date: string | null | undefined,
    format: string = 'MM/DD/YYYY hh:mm A'
  ): string => {
    if (!date) {
      return '';
    }
    return moment.tz(date, serverTimezone).tz(clientTimezone).format(format);
  };

  const formatDateByMonth = (
    date?: string | Date | Moment | null | undefined
  ): string => {
    if (date && moment.isMoment(date)) {
      return formatDateTimeMoment(
        date.format('YYYY-MM-DD'),
        'MM/DD/YYYY',
        true
      );
    }
    if (date && typeof date === 'string' && moment(date).isValid()) {
      return formatDateTimeMoment(date, 'MM/DD/YYYY', true);
    }
    return '';
  };

  return {
    formatDateTime,
    formatDateByMonth,
  };
};

export default useDateTime;
