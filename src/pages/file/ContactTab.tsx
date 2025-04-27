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
import { ContactData, ContactTableData } from '../../interface/contact';
import { useLazyGetContactsByFileQuery } from '../../store/Services/contactService';
import {
  setSelectedContactsSort,
  toggleSelectedContact,
} from '../../store/Reducers/selectContactReducer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  convertToMMDDYYYY,
  formatDateToMonthDayYear,
} from '../../utils/GeneralUtil';
import { TFunction } from 'i18next';
import { QueryParams, TableColumns } from '../../interface/common';
import NewTable from '../../component/Table';
import Checkbox from '@mui/material/Checkbox';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import DOMPurify from 'dompurify';

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

  const [getContactsByFile, { data: contactList, isLoading, isFetching }] =
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
        isSelected: false,
      });
      return data;
    });
    const mainContact = contactsArray.find(contact => contact.main === true);
    if (mainContact) {
      setMainContactId(mainContact.contactId);
    } else {
      setMainContactId(null);
    }

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
  }, [contactList]);

  const getData = ({ sortBy, sortOrder }: QueryParams) => {
    void getContactsByFile({
      fileid: Number(fileId),
      sortBy: sortBy,
      sortOrder: sortOrder,
    })
      .then(() => {
        dispatch(
          setSelectedContactsSort({ sortBy: sortBy, sortOrder: sortOrder })
        );
      })
      .catch(err => err);
  };

  const getVisitValue = (row: any): string => {
    const visit = row['visit'];
    const notInterested = row['dNC'];
    const ticklerDt = row['ticklered'] as string;
    if (ticklerDt) {
      return 'Ticklered for ' + ticklerDt;
    } else if (visit && !notInterested) {
      return 'Visit';
    } else if (notInterested) {
      return 'Not Interested';
    } else {
      return '';
    }
  };

  // const selectedContacts = useAppSelector(
  //   state => state.selectedContacts.selectedContacts
  // );

  const handleCheckboxChange = (contactId: number) => {
    dispatch(toggleSelectedContact(contactId));
    setContactTableData(prev =>
      prev.map(contact =>
        contact.contactId === contactId
          ? { ...contact, isSelected: !contact.isSelected }
          : contact
      )
    );
  };

  const handleMainCheckboxChange = (contactId: number) => {
    setMainContactId(prevMainId => {
      const newMainId = prevMainId === contactId ? null : contactId;

      // Update table data to reflect only one main
      const updatedContacts = contactTableData.map(contact => ({
        ...contact,
        main: contact.contactId === newMainId,
      }));

      setContactTableData(updatedContacts);
      return newMainId;
    });
  };

  const localizeColumns = (t: TFunction): TableColumns[] => {
    const commonColumns: TableColumns[] = [
      {
        headerName: t('select'),
        field: 'select',
        sortable: false,
        cellRenderer: ({ data }) => {
          if (!data.deceased) {
            return (
              <Checkbox
                checked={data.isSelected}
                onChange={() => handleCheckboxChange(data.contactId)}
                size="small"
                color="info"
                sx={{ color: 'white' }}
              />
            );
          }
          return null;
        },
      },
      {
        headerName: t('dec'),
        field: 'deceased',
        sortable: true,
      },
      {
        headerName: t('lastName'),
        field: 'lastName',
        sortable: true,
      },
      {
        headerName: t('firstName'),
        field: 'firstName',
        sortable: true,
        cellRenderer: ({ data }) => (
          <Link
            to={`/editcontact/${data.contactId}`}
            className="hover-link text-decoration-none"
          >
            {data.firstName}
          </Link>
        ),
      },
      {
        headerName: t('main'),
        field: 'main',
        sortable: false,
        cellRenderer: ({ data }) => (
          <Checkbox
            checked={mainContactId === data.contactId}
            onChange={() => handleMainCheckboxChange(data.contactId)}
            disabled={
              mainContactId !== null && mainContactId !== data.contactId
            }
            size="small"
            color="info"
            sx={{
              color: 'white',
              '&.Mui-disabled': {
                color: 'gray',
              },
            }}
          />
        ),
      },
      {
        headerName: t('relation'),
        field: 'relationship',
        sortable: true,
        cellRenderer: ({ data }) => (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.relationship || ''),
            }}
          />
        ),
      },
      {
        headerName: t('owner-ship'),
        field: 'ownership',
        sortable: true,
      },
      {
        headerName: t('offerDate'),
        field: 'offerDate',
        sortable: true,
      },
      {
        headerName: t('offerAmount'),
        field: 'draftAmount2',
        sortable: true,
      },
      {
        headerName: t('deedReturned'),
        field: 'returnDate',
        sortable: true,
        cellRenderer: ({ data }) => {
          if (data.deedId) {
            return (
              <Link
                to={`/editdeed/${data.deedId}`}
                className="hover-link-red text-decoration-none"
              >
                {data.returnDate || '-'}
              </Link>
            );
          }
          return <span></span>;
        },
      },
      {
        headerName: t('visit/NI'),
        field: 'visit',
        sortable: true,
        cellRenderer: ({ data }) => {
          return (
            <span style={{ color: '#FF0000' }}>{getVisitValue(data)}</span>
          );
        },
      },
      {
        headerName: t('fastTrack'),
        field: 'fastTrack',
        sortable: true,
      },
      {
        headerName: t('address'),
        field: 'address',
        sortable: true,
        cellRenderer: ({ data }) => (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.address || ''),
            }}
          />
        ),
      },
      {
        headerName: t('city'),
        field: 'city',
        sortable: true,
      },
      {
        headerName: t('state'),
        field: 'state',
        sortable: true,
      },
      {
        headerName: t('zip'),
        field: 'zip',
        sortable: true,
      },
      {
        headerName: t('ssn'),
        field: 'sSN',
        sortable: true,
      },
      {
        headerName: t('decDt'),
        field: 'decDt',
        sortable: true,
      },
      {
        headerName: t('dob'),
        field: 'dOB',
        sortable: true,
      },
    ];

    return commonColumns;
  };

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
                {t('showFamilyTree')}
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
        <NewTable
          tableId="ContactTable"
          data={contactTableData}
          columns={columns}
          count={contactCount || 0}
          getData={getData}
          initialLoading={isLoading}
          loading={isFetching}
          initialSortBy="deceased,lastName,firstName"
          initialSortOrder="asc,asc,asc"
          isWithoutPagination={true}
        />
      </Box>
    </Stack>
  );
};

export default ContactTab;
