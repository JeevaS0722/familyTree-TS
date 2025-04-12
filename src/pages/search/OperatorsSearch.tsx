/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Link, useNavigate } from 'react-router-dom';
import { QueryParams, TableColumns } from '../../interface/common';
import { severity } from '../../interface/snackbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { useLazyGetOperatorsQuery } from '../../store/Services/searchService';
import {
  SearchOperatorFormValues,
  SearchOperatorParams,
} from '../../interface/searchOperator';
import { searchOperatorsSchema } from '../../schemas/searchOperator';
import { phoneFormat, nl2br } from '../../utils/GeneralUtil';
import { setName } from '../../store/Reducers/searchOperatorReducer';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
} from '../../component/common/CommonStyle';
import NewTable from '../../component/Table';

const OperatorSearch: React.FC = () => {
  const { t } = useTranslation('searchOperator');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const { name, order, orderBy, pageNo, size } = useAppSelector(
    state => state.searchOperator
  );

  const [page, setPage] = React.useState(pageNo);

  const initialValues: SearchOperatorParams = {
    name: name || '',
  };

  const initialFormValues: SearchOperatorFormValues = {
    name: name || '',
  };
  const [getOperators, { data: operatorsData, isFetching, isLoading }] =
    useLazyGetOperatorsQuery();

  const [formValues, setFormValues] = useState<SearchOperatorParams>(
    initialFormValues as SearchOperatorParams
  );
  useEffect(() => {
    async function fetchData() {
      if (name) {
        setFormValues({
          name: name,
        });

        setPage(Number(pageNo) === 1 ? 0 : Number(pageNo) - 1);
        await getData({
          page: Number(page),
          rowsPerPage: Number(size),
          sortBy: orderBy,
          sortOrder: order,
        });
      }
    }
    void fetchData();
  }, []);

  const localizeColumns = (t: TFunction): TableColumns[] => {
    const columns: TableColumns[] = [
      {
        headerName: t('companyName'),
        field: 'companyName',
        width: 300,
        cellRenderer: params => (
          <Link
            key={String(params.data.operatorID)}
            to={`/editoperator/${params.data.operatorID}`}
            className="hover-link"
          >
            {params.data.companyName}
          </Link>
        ),
        sortable: true,
      },
      {
        headerName: t('contactName'),
        field: 'contactName',
        sortable: true,
        width: 300,
      },
      {
        headerName: t('phoneNumber'),
        field: 'phoneNumber',
        sortable: true,
        cellRenderer: params =>
          params.data.phoneNumber &&
          typeof params.data.phoneNumber.toString() === 'string' &&
          params.data.phoneNumber.toString() !== ''
            ? phoneFormat(params.data.phoneNumber.toString() ?? '')
            : '',
      },
      {
        headerName: t('fax'),
        field: 'fax',
        sortable: true,
        cellRenderer: params =>
          params.data.fax &&
          typeof params.data.fax.toString() === 'string' &&
          params.data.fax.toString() !== ''
            ? phoneFormat(params.data.fax.toString() ?? '')
            : '',
      },
      {
        headerName: t('email'),
        field: 'email',
        sortable: true,
        cellRenderer: params => (
          <Link
            to={params.data.email ? `mailto:${params.data.email}` : ''}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-link"
          >
            {params.data.email?.toString()}
          </Link>
        ),
      },
      {
        headerName: t('address'),
        field: 'address',
        sortable: true,
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
        headerName: t('notes'),
        field: 'notes',
        cellRenderer: params => {
          return params.data.notes
            ? parse(
                DOMPurify.sanitize(nl2br(String(params.data.notes)), {
                  USE_PROFILES: { html: true },
                })
              )
            : '';
        },
        width: 300,
        sortable: true,
      },
    ];

    return columns;
  };

  const onSubmit = async (values: SearchOperatorParams) => {
    try {
      setShowErrorMessage(false);
      setFormValues({
        name: values.name,
        pageNo: 1,
        size: 5,
        orderBy: 'companyName,contactName',
        order: 'asc,asc',
      });

      if (values.name !== undefined) {
        dispatch(setName({ name: values.name.toString() }));
      }

      void getOperators({
        name: values.name,
        pageNo: 1,
        size: 100,
        orderBy: 'companyName,contactName',
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
    void getOperators({
      name: formValues.name,
      pageNo: page,
      size: rowsPerPage,
      orderBy: sortBy,
      order: sortOrder,
    });
    if (formValues.name !== undefined) {
      dispatch(
        setName({
          name: formValues.name.toString(),
          order: sortOrder ? sortOrder.toString() : '',
          orderBy: sortBy ? sortBy.toString() : '',
          pageNo: page ? page.toString() : '1',
          size: rowsPerPage ? rowsPerPage.toString() : '5',
        })
      );
    }
  };

  const columns = localizeColumns(t);
  const handleCreateOperator = () => {
    navigate('/newoperator');
  };
  return (
    <Container component="main" fixed>
      <Typography component="h6" className="header-title-h6">
        {t('searchOperators')}
      </Typography>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={searchOperatorsSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container alignItems="center">
              <Grid item xs={12} sm={2} mt={1} xl={1}>
                <CustomInputLabel>{t('operatorName')}:</CustomInputLabel>
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
                  disabled={isSubmitting || isFetching}
                  type="submit"
                  id="find-button"
                  variant="outlined"
                  sx={{
                    '&:disabled': {
                      opacity: 0.2,
                      cursor: 'not-allowed',
                      color: '#fff',
                    },
                  }}
                >
                  {t('findOperator')}
                </Button>
              </Grid>
              <Grid item sx={{ mt: 1 }}>
                <Typography component="h1">{t('or')}</Typography>
              </Grid>
              <Grid item sx={{ mt: 1 }}>
                <Button
                  disabled={isSubmitting || isFetching}
                  id="create-operator-button"
                  variant="outlined"
                  onClick={handleCreateOperator}
                  sx={{
                    '&:disabled': {
                      opacity: 0.2,
                      cursor: 'not-allowed',
                      color: '#fff',
                    },
                  }}
                >
                  {t('createOperator')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      {operatorsData?.operators.length === 0 && !isFetching && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          id="error-search-operators"
          sx={{ mt: 2 }}
        >
          <Typography component="h3" id="error-text">
            {t('noOperatorMsg')} {formValues.name}
          </Typography>
        </Box>
      )}

      {(isLoading || (operatorsData && operatorsData?.count > 0)) && (
        <>
          <Typography component="h1" sx={{ mt: 2 }}>
            {t('result')}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <NewTable
              tableId="searchOperatorsTable"
              data={operatorsData?.operators || []}
              count={operatorsData?.count || 0}
              columns={columns}
              getData={getData}
              initialLoading={isLoading}
              initialSortBy={formValues.orderBy || 'companyName,contactName'}
              initialSortOrder={formValues.order || 'asc,asc'}
              loading={isFetching}
            />
          </Box>
        </>
      )}
      {showErrorMessage && (
        <Typography id="address-not-found" component="h2" sx={{ mt: 2 }}>
          {t('noOperatorMsg')} {formValues.name}
        </Typography>
      )}
    </Container>
  );
};

export default OperatorSearch;
