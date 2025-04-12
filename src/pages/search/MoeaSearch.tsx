/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import CustomizedTable from '../../component/NewCustomizedTable';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { QueryParams, TableData } from '../../interface/common';
import { severity } from '../../interface/snackbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import {
  useLazyGetMOEAByFiltersQuery,
  useLazyGetMOEAByNameQuery,
} from '../../store/Services/searchService';
import {
  SearchMoeaByFilterValues,
  SearchMoeaByNameValues,
} from '../../interface/searchMoea';
import { searchMoeaSchema } from '../../schemas/searchMoea';
import { setMoeaSearch } from '../../store/Reducers/searchMoea';
import Checkbox from '@mui/material/Checkbox';
import parse from 'html-react-parser';
import { nl2br } from '../../utils/GeneralUtil';
import DOMPurify from 'dompurify';
import StateDropdown from '../../component/common/fields/StateDropdown';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
} from '../../component/common/CommonStyle';

const MOEASearch: React.FC = () => {
  const { t } = useTranslation('moea');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    name,
    county,
    state,
    amount,
    nr,
    eliminateDups,
    order,
    orderBy,
    pageNo,
    size,
    filterType,
  } = useAppSelector(state => state.searchMoea);
  const [sortBy, setSortBy] = React.useState<string | null | undefined>(
    orderBy
  );
  const [sortOrder, setSortOrder] = React.useState<string | null | undefined>(
    order
  );
  const [page, setPage] = React.useState(pageNo);
  const [rowsPerPage, setRowsPerPage] = React.useState(size);
  const initialByNameValues: SearchMoeaByNameValues = {
    name: name || '',
  };

  const initialByFilterValues: SearchMoeaByFilterValues = {
    county: county || '',
    state: state || 'OK',
    amount: amount,
    nr: typeof nr === 'undefined' ? true : nr,
    eliminateDups: typeof eliminateDups === 'undefined' ? true : eliminateDups,
  };
  const [
    getMOEAByName,
    {
      data: moeaByNameData,
      isFetching: byNameFetching,
      isLoading: byNameLoading,
    },
  ] = useLazyGetMOEAByNameQuery();
  const [
    getMOEAByFilter,
    {
      data: moeaByFilterData,
      isFetching: byFilterFetching,
      isLoading: byFilterLoading,
    },
  ] = useLazyGetMOEAByFiltersQuery();
  const [byNameFormValues, setByNameFormValues] =
    useState<SearchMoeaByNameValues>(initialByNameValues);

  const [byFilterFormValues, setByFilterFormValues] =
    useState<SearchMoeaByFilterValues>(initialByFilterValues);
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      if (filterType === 'name' && name) {
        setByNameFormValues({
          name: name,
        });

        setPage(Number(pageNo) === 1 ? 0 : Number(pageNo) - 1);
        setRowsPerPage(Number(size));
        await getMOEAByName({
          name,
          pageNo: Number(page),
          size: Number(size),
          orderBy: orderBy,
          order: order,
        });
      }
    }
    void fetchData();
  }, [location.pathname]);

  useEffect(() => {
    async function fetchData() {
      if (filterType === 'filter') {
        setByFilterFormValues({
          county,
          state,
          amount,
          nr,
          eliminateDups,
        });

        setPage(Number(pageNo) === 1 ? 0 : Number(pageNo) - 1);
        setRowsPerPage(Number(size));
        await getMOEAByFilter({
          county,
          state,
          amount,
          nr,
          eliminateDups,
          pageNo: Number(page),
          size: Number(size),
          orderBy: orderBy,
          order: order,
        });
      }
    }
    void fetchData();
  }, [location.pathname]);
  const getColumns = () => {
    if (eliminateDups) {
      return [
        {
          label: t('name'),
          accessor: 'name',
          format: (row: TableData) => (
            <Link
              key={String(row.moeaId)}
              to={`/editmoea/${Number(row.moeaId)}`}
              className="hover-link"
            >
              {row.name}
            </Link>
          ),
          sortable: true,
        },
        {
          label: t('amount'),
          accessor: 'amount',
          sortable: true,
        },
        {
          label: t('orderNo'),
          accessor: 'orderNo',
          sortable: true,
        },
        {
          label: t('calls'),
          accessor: 'calls',
          sortable: true,
        },
        {
          label: t('section'),
          accessor: 'section',
          sortable: true,
        },
        {
          label: t('township'),
          accessor: 'township',
          sortable: true,
        },
        {
          label: t('range'),
          accessor: 'range',
          sortable: true,
        },
        {
          label: t('county'),
          accessor: 'county',
          sortable: true,
        },
      ];
    } else {
      return [
        {
          label: t('name'),
          accessor: 'name',
          format: (row: TableData) => (
            <Link
              key={String(row.moeaId)}
              to={`/editmoea/${Number(row.moeaId)}`}
              className="hover-link"
            >
              {row.name}
            </Link>
          ),
          sortable: true,
        },
        {
          label: t('amount'),
          accessor: 'amount',
          sortable: true,
        },
        {
          label: t('researched'),
          accessor: 'researched',
          sortable: true,
        },
        {
          label: t('onr'),
          accessor: 'onr',
          sortable: true,
        },
        {
          label: t('orderNo'),
          accessor: 'orderNo',
          sortable: true,
        },
        {
          label: t('calls'),
          accessor: 'calls',
          sortable: true,
        },
        {
          label: t('section'),
          accessor: 'section',
          sortable: true,
        },
        {
          label: t('township'),
          accessor: 'township',
          sortable: true,
        },
        {
          label: t('range'),
          accessor: 'range',
          sortable: true,
        },
        {
          label: t('county'),
          accessor: 'county',
          sortable: true,
        },
        {
          label: t('state'),
          accessor: 'state',
          sortable: true,
        },
        {
          label: t('company'),
          accessor: 'company',
          sortable: true,
        },
        {
          label: t('notes'),
          accessor: 'notes',
          format: (row: TableData) => {
            return row.notes
              ? parse(
                  DOMPurify.sanitize(nl2br(String(row.notes)), {
                    USE_PROFILES: { html: true },
                  })
                )
              : '';
          },
          sortable: true,
        },
      ];
    }
  };
  const onNameSubmit = async (values: SearchMoeaByNameValues) => {
    try {
      if (values.name !== undefined) {
        setByNameFormValues({
          name: values.name,
        });
        dispatch(setMoeaSearch({ name: values.name, filterType: 'name' }));
      }
      void getMOEAByName({
        name: values.name,
        pageNo: 1,
        size: 100,
        orderBy: 'name',
        order: 'asc',
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

  const onFilterSubmit = async (values: SearchMoeaByFilterValues) => {
    try {
      setByFilterFormValues({
        county: values.county,
        state: values.state,
        amount: values.amount,
        nr: values.nr,
        eliminateDups: values.eliminateDups,
      });
      dispatch(
        setMoeaSearch({
          county: values.county,
          state: values.state,
          amount: values.amount,
          nr: values.nr,
          eliminateDups: values.eliminateDups,
          filterType: 'filter',
        })
      );
      void getMOEAByFilter({
        county: values.county,
        state: values.state,
        amount: values.amount,
        nr: values.nr,
        eliminateDups: values.eliminateDups,
        pageNo: 1,
        size: 100,
        orderBy: 'name',
        order: 'asc',
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
    if (filterType === 'name') {
      void getMOEAByName({
        name: byNameFormValues.name,
        pageNo: page,
        size: rowsPerPage,
        orderBy: sortBy,
        order: sortOrder,
      });
    } else {
      void getMOEAByFilter({
        county: byFilterFormValues.county,
        state: byFilterFormValues.state,
        amount: byFilterFormValues.amount,
        nr: byFilterFormValues.nr,
        eliminateDups: byFilterFormValues.eliminateDups,
        pageNo: page,
        size: rowsPerPage,
        orderBy: sortBy,
        order: sortOrder,
      });
    }
    if (filterType === 'name') {
      dispatch(
        setMoeaSearch({
          name: byNameFormValues.name.toString() || '',
          order: sortOrder ? sortOrder.toString() : '',
          orderBy: sortBy ? sortBy.toString() : '',
          pageNo: page ? page : 1,
          size: rowsPerPage ? rowsPerPage : 100,
          filterType: 'name',
        })
      );
    } else {
      dispatch(
        setMoeaSearch({
          county: byFilterFormValues.county,
          state: byFilterFormValues.state,
          amount: byFilterFormValues.amount,
          nr: byFilterFormValues.nr,
          eliminateDups: byFilterFormValues.eliminateDups,
          filterType: 'filter',
          order: sortOrder ? sortOrder.toString() : '',
          orderBy: sortBy ? sortBy.toString() : '',
          pageNo: page ? page : 1,
          size: rowsPerPage ? rowsPerPage : 100,
        })
      );
    }
  };

  const columns = getColumns();
  const handleCreateMOEA = () => {
    navigate('/newmoea');
  };
  return (
    <Container component="main" fixed>
      <Typography
        component="h6"
        className="header-title-h6"
        id="searchMoeaTitle"
      >
        {t('searchMOEA')}
      </Typography>
      <Formik
        initialValues={initialByFilterValues}
        // enableReinitialize={true}
        onSubmit={onFilterSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container alignItems="center">
              <Grid item xs={12} sm={2} mt={1} xl={1}>
                <CustomInputLabel>{t('findCounty')}:</CustomInputLabel>
              </Grid>
              <StyledGrid
                item
                xs={12}
                sm={10}
                xl={11}
                sx={{ position: 'relative' }}
              >
                <Field
                  name="county"
                  inputProps={{
                    id: 'county',
                  }}
                  as={StyledInputField}
                  type="text"
                  fullWidth
                />
              </StyledGrid>
              <Grid item xs={12} sm={2} xl={1}>
                <CustomInputLabel>{t('state')}:</CustomInputLabel>
              </Grid>
              <StyledGrid item xs={12} sm={10} xl={11}>
                <StateDropdown
                  name={'state'}
                  sx={{
                    width: { xs: '100%' },
                    background: '#434857',
                    outline: 'none',
                    '& .Mui-disabled': {
                      opacity: 1,
                      background: '#30343e',
                      cursor: 'not-allowed',
                      color: '#fff',
                      '-webkit-text-fill-color': 'unset !important',
                    },
                  }}
                  inputProps={{ id: 'state' }}
                />
              </StyledGrid>
              <Grid item xs={12} sm={2} mt={1} xl={1}>
                <CustomInputLabel>{t('amountGreater')}:</CustomInputLabel>
              </Grid>
              <StyledGrid
                item
                xs={12}
                sm={10}
                xl={11}
                sx={{ position: 'relative' }}
              >
                <Field
                  name="amount"
                  inputProps={{
                    id: 'amount',
                  }}
                  as={StyledInputField}
                  type="number"
                  fullWidth
                />
              </StyledGrid>
              <Grid item xs={5} sm={2} mt={1} xl={1}>
                <CustomInputLabel>{t('nr')}:</CustomInputLabel>
              </Grid>
              <StyledGrid
                item
                xs={6}
                sm={10}
                xl={11}
                sx={{ position: 'relative' }}
              >
                <Field
                  name="nr"
                  inputProps={{
                    id: 'nr',
                  }}
                  type="checkbox"
                  as={Checkbox}
                  sx={{ color: 'white', marginLeft: '-10px' }}
                  size="small"
                  color="info"
                />
              </StyledGrid>
              <Grid item xs={5} sm={2} mt={1} xl={1}>
                <CustomInputLabel>{t('eliminateDups')}:</CustomInputLabel>
              </Grid>
              <StyledGrid
                item
                xs={6}
                sm={10}
                xl={11}
                sx={{ position: 'relative' }}
              >
                <Field
                  name="eliminateDups"
                  inputProps={{
                    id: 'eliminateDups',
                  }}
                  type="checkbox"
                  as={Checkbox}
                  sx={{ color: 'white', marginLeft: '-10px' }}
                  size="small"
                  color="info"
                />
              </StyledGrid>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                sx={{ mt: 2 }}
              >
                <Grid item sx={{ mt: 2 }}>
                  <Button
                    disabled={
                      isSubmitting || byNameFetching || byFilterFetching
                    }
                    type="submit"
                    id="find-filter-button"
                    variant="outlined"
                    onClick={() => {
                      setSortBy('name,amount');
                      setSortOrder('asc,asc');
                      setPage(0);
                      setRowsPerPage(100);
                    }}
                    sx={{
                      '&:disabled': {
                        opacity: 0.2,
                        cursor: 'not-allowed',
                        color: '#fff',
                      },
                    }}
                  >
                    {t('filterMoeaButton')}
                  </Button>
                </Grid>
                <Grid item sx={{ mt: 1 }}>
                  <Typography component="h1">{t('or')}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      <Formik
        initialValues={initialByNameValues}
        enableReinitialize={true}
        validationSchema={searchMoeaSchema(t)}
        onSubmit={onNameSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container alignItems="center">
              <Grid item xs={12} sm={2} mt={1} xl={1}>
                <CustomInputLabel>{t('findName')}:*</CustomInputLabel>
              </Grid>
              <StyledGrid
                item
                xs={12}
                sm={10}
                xl={11}
                sx={{ position: 'relative' }}
              >
                <Field
                  name="name"
                  inputProps={{
                    id: 'name',
                  }}
                  as={StyledInputField}
                  type="text"
                  fullWidth
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    mt: 1,
                    mb: 1,
                  }}
                >
                  <ErrorMessage
                    id="name-error"
                    name="name"
                    component={ErrorText}
                  />
                </Box>
              </StyledGrid>
            </Grid>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              sx={{ mt: 2 }}
            >
              <Grid item sx={{ mt: 2 }}>
                <Button
                  disabled={isSubmitting || byFilterFetching || byNameFetching}
                  type="submit"
                  id="find-name-button"
                  variant="outlined"
                  onClick={() => {
                    setSortBy('name,amount');
                    setSortOrder('asc,asc');
                    setPage(0);
                    setRowsPerPage(100);
                  }}
                  sx={{
                    '&:disabled': {
                      opacity: 0.2,
                      cursor: 'not-allowed',
                      color: '#fff',
                    },
                  }}
                >
                  {t('findName')}
                </Button>
              </Grid>
              <Grid item sx={{ mt: 1 }}>
                <Typography component="h1">{t('or')}</Typography>
              </Grid>
              <Grid item sx={{ mt: 1 }}>
                <Button
                  disabled={byFilterFetching || byNameFetching}
                  id="create-moea-button"
                  variant="outlined"
                  onClick={handleCreateMOEA}
                  sx={{
                    '&:disabled': {
                      opacity: 0.2,
                      cursor: 'not-allowed',
                      color: '#fff',
                    },
                  }}
                >
                  {t('newMoeaButton')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      {filterType === 'name' &&
        !(moeaByNameData?.data?.count || 0 > 0) &&
        !byNameFetching && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            id="error-search-name-MOEA"
            sx={{ mt: 2 }}
          >
            <Typography component="h3" id="error-text">
              {moeaByNameData?.message}
            </Typography>
          </Box>
        )}

      {(byNameLoading ||
        (moeaByNameData &&
          filterType === 'name' &&
          moeaByNameData?.data?.count > 0)) && (
        <>
          <Typography component="h1" sx={{ mt: 2 }}>
            {`${t('searchResultsForMoea')}: ${moeaByNameData?.data?.count || 0}`}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <CustomizedTable
              tableId="searchMOEANameTable"
              data={moeaByNameData?.data?.records || []}
              count={moeaByNameData?.data?.count || 0}
              columns={columns}
              getData={getData}
              initialLoading={byNameLoading}
              loading={byNameFetching}
              page={page}
              sortBy={sortBy}
              sortOrder={sortOrder}
              rowsPerPage={rowsPerPage}
              setSortBy={setSortBy}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
              setSortOrder={setSortOrder}
            />
          </Box>
        </>
      )}
      {filterType === 'filter' &&
        !(moeaByFilterData?.data?.count || 0 > 0) &&
        !byFilterFetching && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            id="error-search-filter-MOEA"
            sx={{ mt: 2 }}
          >
            <Typography component="h3" id="error-text">
              {moeaByFilterData?.message}
            </Typography>
          </Box>
        )}
      {(byFilterLoading ||
        (moeaByFilterData &&
          filterType === 'filter' &&
          moeaByFilterData?.data?.count > 0)) && (
        <>
          <Typography component="h1" sx={{ mt: 2 }}>
            {`${moeaByFilterData?.data?.count || 0} Total MOEA for ${
              county ? `${t('county')} ${county}, ` : ''
            }${state} with ${t('amountGreater')} ${amount || 0}`}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <CustomizedTable
              tableId="searchMOEAFilterTable"
              data={moeaByFilterData?.data?.records || []}
              count={moeaByFilterData?.data?.count || 0}
              columns={columns}
              getData={getData}
              initialLoading={byFilterLoading}
              loading={byFilterFetching}
              page={page}
              sortBy={sortBy}
              sortOrder={sortOrder}
              rowsPerPage={rowsPerPage}
              setSortBy={setSortBy}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
              setSortOrder={setSortOrder}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default MOEASearch;
