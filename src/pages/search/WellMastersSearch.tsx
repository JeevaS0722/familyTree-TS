import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { useLazyGetWellMastersQuery } from '../../store/Services/searchService';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';
import { QueryParams, TableColumns } from '../../interface/common';
import { severity } from '../../interface/snackbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { setSearchFilter } from '../../store/Reducers/searchReducer';
import {
  WellMastersFormValues,
  WellMastersParams,
} from '../../interface/searchWellMasters';
import { searchWellMastersType } from '../../utils/constants';
import { searchWellMastersSchema } from '../../schemas/searchWellMaster';
import Tooltip from '@mui/material/Tooltip';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
} from '../../component/common/CommonStyle';
import { CustomSelectField } from '../../component/CustomizedSelectComponent';
import NewTable from '../../component/Table';

const WwellMastersSearch: React.FC = () => {
  const { t } = useTranslation('searchWellMasters');
  const searchFilter = useAppSelector(state => state.searchFilters);
  const filter = searchFilter['searchWellMastersTable'] as WellMastersParams;
  const initialFormValues: WellMastersFormValues = {
    searchBy: filter?.searchBy || '',
    textSearch: filter?.textSearch || '',
  };

  const [formValues, setFormValues] = useState<WellMastersParams>(
    initialFormValues as WellMastersParams
  );
  const dispatch = useAppDispatch();
  const [getWellMasters, { data: wellMastersData, isLoading, isFetching }] =
    useLazyGetWellMastersQuery();

  const [showErrorMessage, setShowErrorMessage] = React.useState(false);

  const localizeColumns = (t: TFunction): TableColumns[] => {
    const handleWellName = (
      wellName: string | undefined | null,
      to: string,
      payorName: string,
      operatorName: string
    ) => {
      const grantorName = wellName?.toString();
      const showTooltip = grantorName && grantorName.length > 20;

      const linkContent = (
        <Link
          to={to}
          state={{
            payorName: payorName,
            operatorName: operatorName,
          }}
          className="hover-link"
        >
          {grantorName}
        </Link>
      );

      return showTooltip ? (
        <Tooltip title={grantorName} arrow>
          {linkContent}
        </Tooltip>
      ) : (
        linkContent
      );
    };

    const columns: TableColumns[] = [
      {
        headerName: t('fileName'),
        field: 'fileName',
        sortable: true,
        cellRenderer: params => (
          <Link
            key={String(params.data.fileID)}
            to={`/editfile/${params.data.fileID}`}
            className="hover-link"
          >
            {params.data.fileName}
          </Link>
        ),
        width: 300,
      },
      {
        headerName: t('wellName'),
        field: 'wellName',
        width: 300,
        cellRenderer: params => {
          return handleWellName(
            params.data.wellName?.toString(),
            `/editWellMaster/${params.data.wellID}`,
            params.data.payorName as string,
            params.data.operatorName as string
          );
        },
        sortable: true,
      },
      {
        headerName: t('county'),
        field: 'county',
        sortable: true,
      },
      {
        headerName: t('state'),
        field: 'state',
        sortable: true,
      },
      {
        headerName: t('api'),
        field: 'api',
        sortable: true,
      },
      {
        headerName: t('section/AB'),
        field: 'sectionAB',
        sortable: true,
      },
      {
        headerName: t('townshipBlock'),
        field: 'townshipBlock',
        sortable: true,
      },
      {
        headerName: t('rangeSurvey'),
        field: 'rangeSurvey',
        sortable: true,
      },
      {
        headerName: t('quarters'),
        field: 'quarters',
        sortable: true,
      },
      {
        headerName: t('acres'),
        field: 'acres',
        sortable: true,
      },
      {
        headerName: t('nma'),
        field: 'nma',
        sortable: true,
      },
      {
        headerName: t('interest'),
        field: 'interest',
        sortable: true,
      },
      {
        headerName: t('type'),
        field: 'type',
        sortable: true,
      },
      {
        headerName: t('operator'),
        field: 'operatorName',
        sortable: true,
      },
      {
        headerName: t('payor'),
        field: 'payorName',
        sortable: true,
      },
    ];

    return columns;
  };

  useEffect(() => {
    if (filter) {
      try {
        setShowErrorMessage(false);
        void getWellMasters({
          searchBy: filter?.searchBy,
          textSearch: filter?.textSearch,
          pageNo: filter?.pageNo,
          size: filter?.rowsPerPage,
          orderBy: filter?.sortBy,
          order: filter?.sortOrder,
        })
          .then(({ data }) => {
            if (data?.wellMasters.length === 0) {
              setShowErrorMessage(true);
            } else {
              setShowErrorMessage(false);
            }
          })
          .catch(() => {
            dispatch(
              open({
                severity: severity.error,
                message: 'An Unexpected Error Occurred',
              })
            );
          });
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: 'An Unexpected Error Occurred',
          })
        );
      }
    }
  }, [filter?.searchBy, filter?.textSearch]);

  const onSubmit = async (values: WellMastersParams) => {
    try {
      setFormValues({
        searchBy: values?.searchBy,
        textSearch: values?.textSearch,
        pageNo: 1,
        size: 100,
        orderBy: 'fileName,wellName',
        order: 'asc,asc',
      });
      dispatch(
        setSearchFilter({
          tableId: 'searchWellMastersTable',
          filters: {
            searchBy: values?.searchBy,
            textSearch: values?.textSearch,
            pageNo: 1,
            rowsPerPage: 100,
            orderBy: 'fileName,wellName',
            order: 'asc,asc',
          },
        })
      );
      await getWellMasters({
        searchBy: values?.searchBy,
        textSearch: values?.textSearch,
        pageNo: 1,
        size: 100,
        orderBy: 'fileName,wellName',
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

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getWellMasters({
      searchBy: formValues?.searchBy,
      textSearch: formValues?.textSearch,
      pageNo: page,
      size: rowsPerPage,
      orderBy: sortBy,
      order: sortOrder,
    })
      .then(({ data }) => {
        if (data?.wellMasters.length === 0) {
          setShowErrorMessage(true);
        }
      })
      .catch(err => err);
  };

  const columns = localizeColumns(t);

  return (
    <Container component="main" fixed>
      <Typography component="h6" className="header-title-h6">
        {t('searchWellMaster')}
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={searchWellMastersSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container alignItems="center">
              <Grid item xs={12} sm={2} mt={2} xl={1}>
                <CustomInputLabel>{t('searchBy')}:</CustomInputLabel>
              </Grid>
              <StyledGrid
                item
                xs={12}
                sm={10}
                xl={11}
                sx={{ position: 'relative' }}
              >
                <Field
                  name="searchBy"
                  inputProps={{ id: 'searchBy' }}
                  component={CustomSelectField}
                  options={searchWellMastersType}
                  hasEmptyValue={true}
                  labelKey="operator"
                  valueKey="value"
                />
                <ErrorMessage
                  id="searchBy-error"
                  name="searchBy"
                  component={ErrorText}
                />
              </StyledGrid>
              <Grid item xs={12} sm={2} mt={1} xl={1}>
                <CustomInputLabel>{t('textSearch')}:</CustomInputLabel>
              </Grid>
              <StyledGrid
                item
                xs={12}
                sm={10}
                xl={11}
                sx={{ position: 'relative' }}
              >
                <Field
                  name="textSearch"
                  inputProps={{
                    id: 'textSearch',
                  }}
                  as={StyledInputField}
                  type="text"
                  fullWidth
                />
                <ErrorMessage
                  id="textSearch-error"
                  name="textSearch"
                  component={ErrorText}
                />
              </StyledGrid>
            </Grid>
            <Grid container justifyContent="center">
              <Grid item>
                <Button
                  disabled={isSubmitting || isFetching}
                  type="submit"
                  id="find-button"
                  variant="outlined"
                  sx={{
                    my: '2rem',
                    '&:disabled': {
                      opacity: 0.2,
                      cursor: 'not-allowed',
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
      {wellMastersData?.count === 0 && !isFetching && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          id="error-search-well-masters"
        >
          <Typography component="h3" id="error-text">
            {t('noWellMasterMsg')}
            {formValues?.searchBy && ` ${formValues.searchBy},`}
            {formValues?.textSearch && ` ${formValues.textSearch}`}
          </Typography>
        </Box>
      )}

      {(isLoading ||
        (wellMastersData &&
          wellMastersData.wellMasters &&
          wellMastersData.count > 0)) && (
        <Box>
          <Typography component="h3" sx={{ mb: 1 }}>
            # of Wells: {wellMastersData?.count || 0}
          </Typography>
          <NewTable
            tableId="searchWellMastersTable"
            data={wellMastersData?.wellMasters || []}
            count={wellMastersData?.count || 0}
            columns={columns}
            getData={getData}
            initialLoading={isLoading}
            initialSortBy={formValues.orderBy || 'wellName'}
            initialSortOrder={formValues.order || 'asc'}
            loading={isFetching}
          />
        </Box>
      )}
      {showErrorMessage && (
        <Typography id="wellMaster-not-found" component="h2">
          {t('noWellMasterMsg')} {formValues.searchBy},{formValues.textSearch}
        </Typography>
      )}
    </Container>
  );
};

export default WwellMastersSearch;
