import React from 'react';
import { useLazyGetAllDeedsQuery } from '../../store/Services/deedService';
import {
  formatDateToMonthDayYear,
  handleEmptyDateValue,
} from '../../utils/GeneralUtil';
import { DeedStatusProps, ListOfDeeds } from '../../interface/deed';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from '../../store/hooks';
import { setTabName } from '../../store/Reducers/tabReducer';

const DeedStatus: React.FC<DeedStatusProps> = ({ contactId }) => {
  const { t } = useTranslation('editContact');
  const dispatch = useAppDispatch();
  const [getAllDeeds, { data: allDeedDetails, isLoading: getAllDeedLoading }] =
    useLazyGetAllDeedsQuery();
  const [listOfDeeds, setListOfDeeds] = React.useState<ListOfDeeds[] | null>(
    null
  );
  React.useEffect(() => {
    if (contactId) {
      void getAllDeeds({ contactId: Number(contactId) });
    }
  }, [getAllDeeds, contactId]);

  React.useEffect(() => {
    if (allDeedDetails && allDeedDetails?.deeds) {
      const formattedDeeds = allDeedDetails.deeds.map(deed => ({
        ...deed,
        returnDate: handleEmptyDateValue(
          formatDateToMonthDayYear(deed.returnDate).toString()
        ),
      }));
      setListOfDeeds(formattedDeeds);
    }
  }, [allDeedDetails]);
  return (
    <>
      {!getAllDeedLoading && listOfDeeds?.length === 1 && (
        <Grid item xs={12} md={4}>
          <Box
            component={Link}
            justifyContent={{ xs: 'flex-start', md: 'center' }}
            id="goToDeedView"
            className="hover-link"
            sx={{
              color: '#1997c6',
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              gap: '10px',
              cursor: 'pointer',
              my: { xs: 2, md: 0 },
            }}
            to={`/editdeed/${Number(listOfDeeds[0].deedId)}`}
            onClick={() => {
              dispatch(setTabName({ tabName: 'contact' }));
            }}
          >
            <KeyboardBackspaceIcon
              sx={{
                fontSize: '20px',
              }}
            />
            {t('goToDeedView')}
          </Box>
        </Grid>
      )}
      {!getAllDeedLoading && listOfDeeds !== null && listOfDeeds.length > 1 && (
        <Grid item xs={12} md={12} my={2}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Box
              component={'span'}
              id="multipleDeeds"
              sx={{
                color: 'red',
                justifyContent: 'center',
                alignContent: 'center',
                padding: '5px',
              }}
            >
              {t('multipleDeeds')}:
            </Box>
            {listOfDeeds.map(deed => (
              <Link
                to={`/editdeed/${deed.deedId}`}
                key={deed.deedId}
                id={`deed-${deed.deedId}`}
                className="hover-link-red"
                onClick={() => dispatch(setTabName({ tabName: 'contact' }))}
              >
                <Card
                  variant="outlined"
                  sx={{ minWidth: 120, cursor: 'pointer' }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      sx={{ color: 'red' }}
                      id={`deed-${deed.deedId}-returnDate-${deed.returnDate}`}
                    >
                      {`${deed.returnDate} - ${deed.county}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Box>
        </Grid>
      )}
      {!getAllDeedLoading && listOfDeeds?.length === 0 && (
        <Grid item xs={12} md={4}>
          <Box
            component={'span'}
            id="noDeedsReturnedMsg"
            sx={{
              display: 'block',
              color: 'white',
              fontWeight: 'normal',
              letterSpacing: '1px',
              textAlign: 'center',
              my: { xs: 2, md: 0 },
            }}
          >
            {t('noDeedsReturned')}
          </Box>
        </Grid>
      )}
    </>
  );
};

export default DeedStatus;
