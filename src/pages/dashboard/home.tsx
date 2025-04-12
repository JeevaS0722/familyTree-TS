import React, { Suspense, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useGetUserQuery } from '../../store/Services/userService';
import CustomDatePicker from '../../component/CustomDatePicker';
import moment, { Moment } from 'moment';
import { clearSearchFilters } from '../../store/Reducers/searchReducer';
import OverlayLoader from '../../component/common/OverlayLoader';

const LayoutsPage = React.lazy(
  () => import(/* webpackChunkName: "dashboardLayout" */ './layout')
);

const HomePage: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const [date, setDate] = useState<Moment | null>(moment());
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(clearSearchFilters());
  }, [dispatch]);
  const { isLoading } = useGetUserQuery('');
  return (
    <Container fixed>
      <Grid container alignItems="center">
        <Grid item xs={12} md={4} sm={6}>
          <Typography className="header-title-h6" variant="h6" id="title">
            {t('dashboard')}
          </Typography>
          <Typography sx={{ color: '#fff' }} variant="h6">
            {t('overview')}{' '}
            {isLoading ? (
              <CircularProgress size={15} sx={{ color: 'white' }} />
            ) : (
              <Box component="span" id="name">
                {user.fullName}
              </Box>
            )}
          </Typography>
        </Grid>
        <Grid item container justifyContent="flex-end" xs={12} md={8} sm={6}>
          <Grid item pt={1} md={4} sm={10} xs={12}>
            <CustomDatePicker
              name="datepicker"
              value={date}
              onChange={(date: Moment | null) => {
                setDate(date);
              }}
              style={{ inputProps: { xs: '100%', sm: '100%' } }}
              type="date"
              id="filter"
            />
          </Grid>
        </Grid>
      </Grid>
      <Suspense fallback={<OverlayLoader open />}>
        <LayoutsPage />
      </Suspense>
    </Container>
  );
};

export default HomePage;
