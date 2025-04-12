/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { searchFileSchema } from '../../schemas/searchFile';
import { useLazyGetFilesQuery } from '../../store/Services/searchService';
import { useTranslation } from 'react-i18next';
import { FormValues, SearchValues } from '../../interface/searchFile';
import { TFunction } from 'i18next';
import { QueryParams, TableColumns } from '../../interface/common';
import { formatDateToMonthDayYear } from '../../utils/GeneralUtil';
import { Link } from 'react-router-dom';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import { setSearchFilter } from '../../store/Reducers/searchReducer';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import FileStatusDropdown from '../../component/common/fields/FileStatusDropdown';
import StateDropdown from '../../component/common/fields/StateDropdown';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
} from '../../component/common/CommonStyle';
import NewTable from '../../component/Table';

const localizeColumns = (t: TFunction, status: string): TableColumns[] => {
  const commonColumns: TableColumns[] = [
    {
      headerName: t('fileName'),
      field: 'fileName',
      cellRenderer: params => (
        <Link
          key={String(params.data.fileID)}
          to={`/editfile/${params.data.fileID}`}
          className="hover-link"
        >
          {params.data.fileName}
        </Link>
      ),
      sortable: true,
      width: 400,
    },
    {
      headerName:
        status === 'County/Field Research' ? t('county') : t('legalsCounty'),
      field: 'legalsCounty',
      sortable: true,
      width: 400,
    },
    {
      headerName:
        status === 'County/Field Research' ? t('state') : t('legalsState'),
      field: 'legalsState',
      sortable: true,
      width: 400,
    },
    {
      headerName: t('appraisedValue'),
      field: 'apprValue',
      sortable: true,
    },
    {
      headerName: t('mmSuspense'),
      field: 'mMSuspAmt',
      sortable: true,
    },
    {
      headerName: t('mmDesc'),
      field: 'mMComment',
      sortable: true,
    },
  ];
  const additionalColumns: TableColumns[] = [
    {
      headerName: t('noteDate'),
      field: 'noteDate',
      sortable: true,
    },
    {
      headerName: t('researchNote'),
      field: 'researchNote',
      sortable: true,
    },
  ];

  return status === 'County/Field Research'
    ? [...commonColumns, ...additionalColumns]
    : commonColumns;
};

const FileSearch: React.FC = () => {
  const { t } = useTranslation('searchFile');
  const dispatch = useAppDispatch();
  const searchFilter = useAppSelector(state => state.searchFilters);

  const filter = searchFilter['fileSearchTable'] as FormValues;
  const initialValues: SearchValues = {
    fileStatus: filter?.status || '',
    legalsState: filter?.state || '',
    legalsCounty: filter?.county || '',
  };

  const initialFormValues: FormValues = {
    status: filter?.status || '',
    state: filter?.state || '',
    county: filter?.county || '',
    pageNo: filter?.page || 1,
    size: filter?.rowsPerPage || 100,
    sortBy: filter?.sortBy || 'fileName',
    sortOrder: filter?.sortOrder || 'asc',
  };

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [getFiles, { data: filesData, isLoading, isFetching }] =
    useLazyGetFilesQuery();

  useEffect(() => {
    if (filter) {
      void getFiles({
        status: filter?.status || '',
        state: filter?.state || '',
        county: filter?.county || '',
        pageNo: filter?.page || 1,
        size: filter?.rowsPerPage || 100,
        orderBy: filter?.sortBy || '',
        order: filter?.sortOrder || '',
      });
    }
  }, [filter?.county, filter?.state, filter?.status]);

  const onSubmit = async (values: SearchValues) => {
    try {
      setFormValues({
        status: values?.fileStatus,
        state: values?.legalsState,
        county: values?.legalsCounty,
        pageNo: 1,
        size: 100,
        sortBy: filter?.sortBy || 'fileName',
        sortOrder: filter?.sortOrder || 'asc',
      });
      dispatch(
        setSearchFilter({
          tableId: 'fileSearchTable',
          filters: {
            status: values?.fileStatus,
            state: values?.legalsState,
            county: values?.legalsCounty,
            pageNo: 1,
            size: 100,
            sortBy: 'fileName,legalsCounty',
            sortOrder: 'asc,asc',
          },
        })
      );
      await getFiles({
        status: values?.fileStatus,
        state: values?.legalsState,
        county: values?.legalsCounty,
        pageNo: 1,
        size: 100,
        orderBy: 'fileName,legalsCounty',
        order: 'asc,asc',
      });
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'An Unexpected Error Occurred',
        })
      );
    }
  };
  const columns = localizeColumns(t, formValues.status);
  const formattedData = filesData?.files?.map(file => {
    const isCountyFieldResearch = formValues.status === 'County/Field Research';
    return {
      ...file,
      ...(isCountyFieldResearch && {
        noteDate: file?.noteDate
          ? formatDateToMonthDayYear(file?.noteDate).toString()
          : '',
        researchNote: file?.researchNote ? file?.researchNote : '',
      }),
    };
  });
  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getFiles({
      status: formValues?.status,
      state: formValues?.state,
      county: formValues?.county,
      pageNo: page,
      size: rowsPerPage,
      order: sortOrder,
      orderBy: sortBy,
    });
  };
  return (
    <Container component="main" fixed>
      <Typography component="h6" className="header-title-h6">
        {t('title')}
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={searchFileSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid
              container
              sx={{ my: 2 }}
              display={'flex'}
              justifyContent={'space-between'}
            >
              <Grid item xs={12} sm={3}>
                <CustomInputLabel sx={{ mb: 1 }}>
                  {t('fileStatus')}:
                </CustomInputLabel>
                <FileStatusDropdown
                  type="status"
                  name="fileStatus"
                  inputProps={{
                    id: 'fileStatus',
                  }}
                  fullWidth
                  sx={{
                    background: '#434857',
                    borderRadius: '0.25rem',
                    width: '100%',
                  }}
                />
                <ErrorMessage name="fileStatus" component={ErrorText} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomInputLabel sx={{ mb: 1, whiteSpace: 'nowrap' }}>
                  {t('legalsState')}: ({t('optional')})
                </CustomInputLabel>
                <StateDropdown
                  name="legalsState"
                  inputProps={{ id: 'legalsState' }}
                  fullWidth
                  sx={{
                    background: '#434857',
                    borderRadius: '0.25rem',
                    width: '100%',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomInputLabel sx={{ mb: 1, whiteSpace: 'nowrap' }}>
                  {t('legalsCounty')}: ({t('optional')})
                </CustomInputLabel>
                <Field
                  name="legalsCounty"
                  inputProps={{
                    id: 'legalsCounty',
                    sx: { height: '27px' },
                  }}
                  as={StyledInputField}
                  fullWidth
                  type="text"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={1}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Button
                  disabled={isFetching || isSubmitting}
                  type="submit"
                  id="find-button"
                  variant="outlined"
                  sx={{
                    my: '2rem',
                    '&:disabled': {
                      opacity: 0.2,
                      cursor: 'not-allowed',
                      backgroundColor: '#1997c6',
                      color: '#fff',
                    },
                  }}
                >
                  {t('find')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      {filesData?.files?.length === 0 && !isFetching && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography component="h3">
            {t('fileNotFound', {
              status: formValues?.status,
            })}
            {formValues?.county && ` ${formValues.county},`}
            {formValues?.state && ` ${formValues.state}`}
          </Typography>
        </Box>
      )}

      {(isLoading || (filesData && filesData.count > 0)) && (
        <Box>
          <Typography component="h3" sx={{ mb: 1 }}>
            # of Files: {filesData?.count || 0}
          </Typography>
          <NewTable
            tableId={`fileSearchTable_${formValues?.status}`}
            data={formattedData || []}
            count={filesData && 'count' in filesData ? filesData?.count : 0}
            getData={getData}
            columns={columns}
            initialLoading={isLoading}
            initialSortBy={formValues?.sortBy || 'fileName'}
            initialSortOrder={formValues?.sortOrder || 'asc'}
            loading={isFetching}
            message={filesData && 'files' in filesData ? filesData.message : ''}
          />
        </Box>
      )}
    </Container>
  );
};

export default FileSearch;
