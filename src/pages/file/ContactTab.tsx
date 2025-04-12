/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContactsTable from './ContactsTable';
import {
  ContactColumn,
  ContactData,
  ContactTableData,
} from '../../interface/contact';
import { useLazyGetContactsByFileQuery } from '../../store/Services/contactService';
import { setSelectedContactsSort } from '../../store/Reducers/selectContactReducer';
import { useNavigate, useParams } from 'react-router-dom';
import {
  convertToMMDDYYYY,
  formatDateToMonthDayYear,
} from '../../utils/GeneralUtil';
import { TFunction } from 'i18next';
import { useAppDispatch } from '../../store/hooks';

const localizeColumns = (t: TFunction): ContactColumn[] => {
  const commonColumns: ContactColumn[] = [
    {
      label: t('select'),
      accessor: 'select',
      sortable: false,
    },
    {
      label: t('dec'),
      accessor: 'deceased',
      sortable: true,
    },
    {
      label: t('lastName'),
      accessor: 'lastName',
      sortable: true,
    },
    {
      label: t('firstName'),
      accessor: 'firstName',
      sortable: true,
    },
    {
      label: t('main'),
      accessor: 'main',
      sortable: false,
    },
    {
      label: t('relation'),
      accessor: 'relationship',
      sortable: true,
    },
    {
      label: t('owner-ship'),
      accessor: 'ownership',
      sortable: true,
    },
    {
      label: t('offerDate'),
      accessor: 'offerDate',
      sortable: true,
    },
    {
      label: t('offerAmount'),
      accessor: 'draftAmount2',
      sortable: true,
    },
    {
      label: t('deedReturned'),
      accessor: 'returnDate',
      sortable: true,
    },
    {
      label: t('visit/NI'),
      accessor: 'visit',
      sortable: true,
    },
    {
      label: t('fastTrack'),
      accessor: 'fastTrack',
      sortable: true,
    },
    {
      label: t('address'),
      accessor: 'address',
      sortable: true,
    },
    {
      label: t('city'),
      accessor: 'city',
      sortable: true,
    },
    {
      label: t('state'),
      accessor: 'state',
      sortable: true,
    },
    {
      label: t('zip'),
      accessor: 'zip',
      sortable: true,
    },
    {
      label: t('ssn'),
      accessor: 'sSN',
      sortable: true,
    },
    {
      label: t('decDt'),
      accessor: 'decDt',
      sortable: true,
    },
    {
      label: t('dob'),
      accessor: 'dOB',
      sortable: true,
    },
  ];

  return commonColumns;
};

const ContactTab: React.FC<{
  fileName?: string;
  mainContactId: number | null;
  setMainContactId: (id: number | null) => void;
}> = ({ fileName, mainContactId, setMainContactId }) => {
  const { t } = useTranslation('editfile');
  const { fileId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [contactTableData, setContactTableData] = useState<ContactTableData[]>(
    []
  );
  const [contactCount, setContactCount] = useState(0);
  const [ownershipSum, setOwnershipSum] = useState(0);
  const [totalPurchased, setTotalPurchased] = useState(0);
  const [totalUnPurchased, setTotalUnPurchased] = useState(0);
  const [sortBy, setSortBy] = useState<string>('deceased, lastName, firstName');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [sortLoading, setSortLoading] = React.useState(true);

  const [getContactsByFile, { data: contactList }] =
    useLazyGetContactsByFileQuery();

  const handleEmptyDateValue = (value: string | undefined | null) => {
    if (!value || value === '0000/00/00' || value === '0000-00-00') {
      return '';
    }
    return formatDateToMonthDayYear(value).toString();
  };

  const handleEmptyValue = (value: string | undefined | null) => {
    return value ? value : '';
  };

  const handleFormatReturnDate = (deedModel: any): string => {
    if (!deedModel) {
      return '';
    }
    const returnDate = deedModel?.returnDate
      ? handleEmptyDateValue(deedModel.returnDate)
      : '';
    let county = deedModel?.county || '';

    if (county) {
      const countyList = county.split(',').map((c: string) => c.trim());
      county = `${countyList.join(', ')}`;
    }

    if (returnDate && county) {
      return `${returnDate} ${county}`;
    } else if (county) {
      return county;
    }

    return returnDate;
  };

  const handleContactTableData = (contactData: ContactData[]) => {
    const contactsArray: ContactTableData[] = [];

    contactData.map(data => {
      contactsArray.push({
        dec: !!data.deceased,
        deceased: data.deceased ? 'Yes' : '',
        select: '',
        contactId: data.contactID,
        lastName: handleEmptyValue(data.lastName),
        firstName: handleEmptyValue(data.firstName),
        relationship: handleEmptyValue(data.relationship),
        ownership: data.ownership
          ? parseFloat((Number(data.ownership) * 100).toFixed(2)) + '%'
          : '',
        offerDate: data?.OffersModels[0]?.offerDate
          ? formatDateToMonthDayYear(data.OffersModels[0]?.offerDate).toString()
          : '',
        draftAmount2:
          data?.OffersModels?.[0]?.draftAmount2 !== null
            ? Number(data?.OffersModels?.[0]?.draftAmount2 ?? 0).toLocaleString(
                'en-US',
                {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }
              )
            : '',
        returnDate: handleFormatReturnDate(data.DeedsModels[0]),
        visit: !!data.visit,
        fastTrack: data.fastTrack ? 'Yes' : '',
        address: handleEmptyValue(data.address),
        city: handleEmptyValue(data.city),
        state: handleEmptyValue(data.state),
        zip: handleEmptyValue(data.zip),
        sSN: handleEmptyValue(data.sSN),
        decDt: convertToMMDDYYYY(data?.decDt?.toString()),
        dOB: convertToMMDDYYYY(data?.dOB?.toString()),
        deedId: data.DeedsModels[0]?.deedID,
        dNC: data.dNC,
        ticklered: handleEmptyDateValue(data?.ticklered?.toString()),
        main: !!data.main,
      });
      return data;
    });
    setContactTableData(contactsArray);
  };
  useEffect(() => {
    if (contactList && contactList.data.contact) {
      handleContactTableData(contactList.data.contact);
      setContactCount(contactList.data.count);
      setOwnershipSum(contactList.data.ownershipSum);
      setTotalPurchased(contactList.data.totalPurchased);
      setTotalUnPurchased(contactList.data.totalUnpurchased);
    }
  }, [contactList, sortBy, sortOrder]);

  useEffect(() => {
    void getContactsByFile({
      fileid: Number(fileId),
      sortBy: sortBy,
      sortOrder: sortOrder,
    })
      .then(() => {
        setSortLoading(false);
        dispatch(
          setSelectedContactsSort({ sortBy: sortBy, sortOrder: sortOrder })
        );
      })
      .catch(err => err);
  }, [sortOrder]);

  const columns = localizeColumns(t);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={3}
    >
      <Box sx={{ width: '100%' }}>
        {contactCount === 0 ? (
          <Grid container alignItems="center" sx={{ mt: 2 }}>
            <Grid item xs={12} md={12}>
              <Typography component="h5">{t('noContactsListed')}</Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                marginTop: '10px',
              }}
            >
              <Button
                id="add-contact-button"
                variant="outlined"
                onClick={() => {
                  navigate('/newcontact', {
                    state: {
                      fileId: fileId,
                      fileName: fileName,
                    },
                  });
                }}
              >
                {t('addContact')}
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '60px',
              flexWrap: 'wrap',
              rowGap: '20px',
            }}
          >
            <Grid>
              <Typography component="h6">
                {t('ofContacts')}: {contactCount}
              </Typography>
            </Grid>
            <Grid
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <Button
                id="add-new-contact-button"
                variant="outlined"
                onClick={() => {
                  navigate('/newcontact', {
                    state: {
                      fileId: fileId,
                      fileName: fileName,
                    },
                  });
                }}
              >
                {t('addContact')}
              </Button>
              <Button
                id="family-tree-button"
                variant="outlined"
                onClick={() => {
                  navigate(`/family_tree/${fileId}?filename=${fileName}`);
                }}
              >
                {t('familyTree')}
              </Button>
            </Grid>
            <Grid>
              <Typography
                component="h6"
                sx={{
                  fontStyle: 'italic',
                }}
              >
                {t('totalPurchased')}: {totalPurchased}%
              </Typography>
            </Grid>
            <Grid>
              <Typography
                component="h6"
                sx={{
                  fontStyle: 'italic',
                }}
              >
                {t('unpurchased')}: {totalUnPurchased}%
              </Typography>
            </Grid>
            <Grid>
              <Typography
                component="h6"
                sx={{
                  fontStyle: 'italic',
                  color:
                    ownershipSum !== 100 && ownershipSum !== 0
                      ? '#FF0000'
                      : 'white',
                }}
              >
                {t('ownershipTotal')}: {ownershipSum}%
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>

      <Box sx={{ width: '100%' }}>
        <ContactsTable
          data={contactTableData}
          columns={columns}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          setSortLoading={setSortLoading}
          sortLoading={sortLoading}
          mainContactId={mainContactId}
          setMainContactId={setMainContactId}
        />
      </Box>
    </Stack>
  );
};

export default ContactTab;
