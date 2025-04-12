/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable complexity */
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import {
  CustomInputLabel,
  StyledGrid,
  StyledInputField,
  ErrorTextValidation,
} from '../common/CommonStyle';
import {
  Formik,
  Form,
  Field,
  useFormikContext,
  ErrorMessage,
  FormikErrors,
} from 'formik';
import { CustomCheckbox } from '../common/CustomCheckbox';
import StateDropdown from '../common/fields/StateDropdown';
import {
  CustomSelectField,
  ModalCustomDropDown as SelectField,
} from '../CustomizedSelectComponent';
import { CustomInputField } from '../common/CustomInputField';
import InputAdornment from '@mui/material/InputAdornment';
import CustomDatePicker from '../FormikCustomDatePicker';
import { TableColumns } from '../../interface/common';
import { SearchMyTaskQueryParams } from '../../interface/dashboard';
import { dashBoardMyTaskSchema } from '../../schemas/dashboardSearch';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';

import * as Yup from 'yup';
import { CustomTextArea } from '../CommonComponent';
import BuyerDropdown from '../common/fields/BuyerDropdown';
import './CommonModal.css';
import Tooltip from '@mui/material/Tooltip';

interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  columns: TableColumns[];
  onFilterChange: (activeFilterCount: number) => void;
  getFilteredDataTrigger: (filterCriteria: SearchMyTaskQueryParams) => void;
}

const CommonModal: React.FC<ModalProps> = ({
  isOpen,
  handleClose,
  title,
  columns,
  onFilterChange,
  getFilteredDataTrigger,
}) => {
  const { t } = useTranslation('searchMyTask');
  const handleApplyFilter = (filterCriteria: SearchMyTaskQueryParams) => {
    getFilteredDataTrigger(filterCriteria);
  };
  const [activeFilterCount, setActiveFilterCount] = React.useState(0);
  const [formValues, setFormValues] = React.useState<Record<string, string>>(
    {}
  );
  const [skipValidation, setSkipValidation] = React.useState(false);

  const handleFormValuesChange = (values: Record<string, string>) => {
    setFormValues(values);
  };

  const selectOptionsDropDown = [
    { value: 'eq', label: 'Equal to' },
    { value: 'lte', label: 'Less than' },
    { value: 'gte', label: 'Greater than' },
    { value: 'between', label: 'Between' },
  ];
  const initialValues = columns.reduce(
    (values, column) => {
      if (column.filterable) {
        if (column.type === 'date') {
          values[`${column.field}`] = '';
          values[`${column.field}_from`] = '';
          values[`${column.field}_to`] = '';
          values[`${column.field}_condition`] = 'eq';
        } else if (column.type === 'amount' || column.type === 'percentage') {
          values[`${column.field}_min`] = '';
          values[`${column.field}_max`] = '';
          values[`${column.field}`] = '';
          values[`${column.field}_condition`] = 'eq';
        } else {
          values[column.field] = '';
        }
      }
      return values;
    },
    {} as Record<string, string>
  );

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  React.useEffect(() => {
    const uniqueKeys = new Set<string>();

    Object.entries(formValues).forEach(([key, value]) => {
      const isCheckbox = columns.some(
        col => col.field === key && col.type === 'checkbox'
      );

      if (isCheckbox) {
        if (value === true) {
          uniqueKeys.add(key);
        }
        return;
      }
      if (value !== '' && value !== null && !key.endsWith('_condition')) {
        const baseKey = key.replace(/(_min|_max|_to|_from)$/, '');
        const conditionKey = `${baseKey}_condition`;
        const condition = formValues[conditionKey];
        if (condition === 'between') {
          if (key.endsWith('_from') || key.endsWith('_to')) {
            uniqueKeys.add(baseKey);
          }
          if (key.endsWith('_min') || key.endsWith('_max')) {
            uniqueKeys.add(baseKey);
          }
        } else if (
          condition === 'gte' ||
          condition === 'lte' ||
          condition === 'eq'
        ) {
          if (!key.endsWith('_from') && !key.endsWith('_to')) {
            uniqueKeys.add(baseKey);
          }
        } else {
          uniqueKeys.add(baseKey);
        }
      }
    });

    const count = uniqueKeys.size;
    setActiveFilterCount(count);
    onFilterChange(count);
  }, [formValues, onFilterChange]);

  const ClearFieldButton = ({ fieldName }: { fieldName: string }) => {
    const { setFieldValue, submitForm } = useFormikContext();
    const handleClearAndSubmit = () => {
      void setFieldValue(fieldName, '')
        .then(() => {
          if (
            [
              'dueDate',
              'amount',
              'totalFileValue',
              'date',
              'requestedDate',
              'draft1',
              'draft2',
              'returnDate',
              'returnedDate',
              'purchaseAmount',
              'finalPaymentDate',
              'totalPurchased',
              'ownership',
              'orderDate',
              'receivedDate',
              'createDate',
            ].some(name => fieldName.includes(name))
          ) {
            void setFieldValue(`${fieldName.split('_')[0]}_to`, '');
            void setFieldValue(`${fieldName.split('_')[0]}_max`, '');
            void setFieldValue(`${fieldName.split('_')[0]}_from`, '');
            void setFieldValue(`${fieldName.split('_')[0]}_min`, '');
            void setFieldValue(`${fieldName.split('_')[0]}`, '');
            return setFieldValue(`${fieldName.split('_')[0]}_condition`, 'eq');
          }
          setSkipValidation(true);
        })
        .then(() => void submitForm().then(() => setSkipValidation(false)))
        .catch(() => {});
    };
    return (
      <Typography
        component="span"
        variant="body2"
        sx={{
          cursor: 'pointer',
          color: 'white',
          '&:hover': {
            color: 'gray',
          },
          '&:active': {
            color: 'gray',
          },
        }}
        id={`clear-button-for-${fieldName}`}
        onClick={handleClearAndSubmit}
      >
        Clear
      </Typography>
    );
  };

  const renderInput = (
    column: TableColumns,
    values: SearchMyTaskQueryParams,
    errors?: FormikErrors<Record<string, string>>
  ) => {
    if (!column?.filterable) {
      return null;
    }
    const labelWithCondition = column.condition
      ? `${column.condition} ${column.headerName}`
      : column.headerName;

    if (column.type === 'dropdown' && column?.field === 'state') {
      return (
        <>
          <Grid container alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="space-between">
              <CustomInputLabel>{labelWithCondition}:</CustomInputLabel>
              <ClearFieldButton fieldName={column.field} />
            </Grid>
            <StyledGrid item xs={12} sx={{ my: 2 }}>
              <StateDropdown
                name={column.field}
                filterName={`${column.field}_filter`}
                fullWidth
                sx={{
                  width: '100%',
                  background: '#434857',
                  outline: 'none',
                }}
              />
            </StyledGrid>
          </Grid>
          <Divider sx={{ backgroundColor: 'gray', mb: 2 }} />
        </>
      );
    } else if (column.type === 'dropdown' && column?.field === 'buyer') {
      return (
        <>
          <Grid container alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="space-between">
              <CustomInputLabel>{labelWithCondition}:</CustomInputLabel>
              <ClearFieldButton fieldName={column.field} />
            </Grid>
            <StyledGrid item xs={12} sx={{ my: 2 }}>
              <BuyerDropdown
                name={column.field}
                filterName={`${column.field}_filter`}
                fullWidth
                sx={{
                  width: '100%',
                  background: '#434857',
                  outline: 'none',
                }}
              />
            </StyledGrid>
          </Grid>
          <Divider sx={{ backgroundColor: 'gray', mb: 2 }} />
        </>
      );
    } else if (column.type === 'dropdown' && column?.field === 'orderType') {
      return (
        <>
          <Grid container alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="space-between">
              <CustomInputLabel>{labelWithCondition}:</CustomInputLabel>
              <ClearFieldButton fieldName={column.field} />
            </Grid>
            <StyledGrid item xs={12} sx={{ my: 2 }}>
              <Field
                name={column.field}
                inputProps={{ id: `${column.field}_filter` }}
                as={SelectField}
                labelKey="place"
                valueKey="place"
                options={column.options}
                sx={{
                  width: { xs: '100%' },
                  background: '#434857',
                }}
              />
              {errors && errors[column.field] && (
                <ErrorMessage
                  name={column.field}
                  component={ErrorTextValidation}
                />
              )}
            </StyledGrid>
          </Grid>
          <Divider sx={{ backgroundColor: 'gray', mb: 2 }} />
        </>
      );
    } else if (column.type === 'dropdown' && column.options) {
      return (
        <>
          <Grid container alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="space-between">
              <CustomInputLabel>{labelWithCondition}:</CustomInputLabel>
              <ClearFieldButton fieldName={column.field} />
            </Grid>
            <StyledGrid item xs={12} sx={{ my: 2 }}>
              <Field
                name={column.field}
                inputProps={{ id: `${column.field}_filter` }}
                as={SelectField}
                labelKey="label"
                valueKey="value"
                options={column.options}
                sx={{
                  width: { xs: '100%' },
                  background: '#434857',
                }}
              />
              {errors && errors[column.field] && (
                <ErrorMessage
                  name={column.field}
                  component={ErrorTextValidation}
                />
              )}
            </StyledGrid>
          </Grid>
          <Divider sx={{ backgroundColor: 'gray', mb: 2 }} />
        </>
      );
    } else if (column.type === 'checkbox') {
      return (
        <>
          <Grid container alignItems="center" sx={{ my: 2 }}>
            <Grid item xs={12} sx={{ display: 'flex' }}>
              <CustomInputLabel sx={{ marginRight: 2, alignSelf: 'center' }}>
                {labelWithCondition}:
              </CustomInputLabel>
              <FormControlLabel
                control={
                  <Field
                    name={column.field}
                    inputProps={{
                      id: `${column.field}_filter`,
                    }}
                    type="checkbox"
                    as={CustomCheckbox}
                    sx={{ color: 'white' }}
                    size="small"
                    color="info"
                  />
                }
                label=""
                labelPlacement="end"
                sx={{ marginLeft: 0 }}
              />
            </Grid>
            <Divider sx={{ backgroundColor: 'gray', mb: 2 }} />
          </Grid>
        </>
      );
    } else if (column.type === 'date') {
      if (
        values?.[
          `${column.field}_condition` as keyof SearchMyTaskQueryParams
        ] === 'between'
      ) {
        values[column.field] = '';
      }
      return (
        <>
          <Grid
            container
            item
            xs={12}
            marginTop="10px"
            marginBottom="10px"
            alignItems="center"
            display="flex"
            justifyContent="flex-start"
          >
            <Grid
              item
              xs={12}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <CustomInputLabel>{labelWithCondition}:</CustomInputLabel>
              <StyledGrid item sx={{ mb: 2 }}>
                <Field
                  name={`${column.field}_condition`}
                  inputProps={{ id: `${column.field}_condition` }}
                  as={CustomSelectField}
                  labelKey="label"
                  valueKey="value"
                  options={selectOptionsDropDown}
                />
              </StyledGrid>
              <ClearFieldButton
                fieldName={
                  values?.[
                    `${column.field}_condition` as keyof SearchMyTaskQueryParams
                  ] === 'between'
                    ? `${column.field}_from`
                    : `${column.field}`
                }
              />
            </Grid>
            <Grid item xs={12}>
              {values?.[
                `${column.field}_condition` as keyof SearchMyTaskQueryParams
              ] === 'between' ? (
                <>
                  <CustomDatePicker
                    name={`${column.field}_from`}
                    type="date"
                    id={`${column.field}_from`}
                    width="100%"
                    sx={{
                      paddingTop: '0 !important',
                    }}
                  />
                  <Box sx={{ minHeight: '20px' }}>
                    {errors && errors[`${column.field}_from`] && (
                      <ErrorMessage
                        name={`${column.field}_from`}
                        component={ErrorTextValidation}
                      />
                    )}
                  </Box>
                </>
              ) : (
                <>
                  <CustomDatePicker
                    name={`${column.field}`}
                    type="date"
                    id={`${column.field}_filter`}
                    width="100%"
                    sx={{
                      paddingTop: '0 !important',
                    }}
                  />
                  <Box sx={{ minHeight: '20px' }}>
                    {errors && errors[`${column.field}`] && (
                      <ErrorMessage
                        name={`${column.field}`}
                        component={ErrorTextValidation}
                      />
                    )}
                  </Box>
                </>
              )}
            </Grid>

            {values?.[
              `${column.field}_condition` as keyof SearchMyTaskQueryParams
            ] === 'between' && (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  And
                </Typography>
                <CustomDatePicker
                  name={`${column.field}_to`}
                  type="date"
                  id={`${column.field}_to`}
                  width="100%"
                  sx={{
                    paddingTop: '0 !important',
                  }}
                />
                <Box sx={{ minHeight: '20px' }}>
                  {errors && errors[`${column.field}_to`] && (
                    <ErrorMessage
                      name={`${column.field}_to`}
                      component={ErrorTextValidation}
                    />
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
          <Divider sx={{ backgroundColor: 'gray', mb: 2 }} />
        </>
      );
    } else if (column.type === 'amount') {
      if (
        values?.[
          `${column.field}_condition` as keyof SearchMyTaskQueryParams
        ] === 'between'
      ) {
        values[column.field] = '';
      }
      return (
        <>
          <Grid
            container
            item
            xs={12}
            sx={{ my: 2 }}
            alignItems="center"
            display="flex"
            justifyContent="flex-start"
          >
            <Grid
              item
              xs={12}
              display="flex"
              sx={{ my: 2 }}
              alignItems="center"
              justifyContent="space-between"
            >
              <CustomInputLabel>{labelWithCondition}:</CustomInputLabel>
              <ClearFieldButton
                fieldName={
                  values?.[
                    `${column.field}_condition` as keyof SearchMyTaskQueryParams
                  ] === 'between'
                    ? `${column.field}_min`
                    : `${column.field}`
                }
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={7}>
                  {values?.[
                    `${column.field}_condition` as keyof SearchMyTaskQueryParams
                  ] === 'between' ? (
                    <>
                      <Field
                        name={`${column.field}_min`}
                        as={CustomInputField}
                        backgroundColor="#434857"
                        width="100%"
                        height="10%"
                        type="text"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              disableTypography
                              sx={{ color: '#ccc' }}
                            >
                              $
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          maxLength:
                            column.field === 'draft1' ||
                            column.field === 'draft2'
                              ? 19
                              : 20,
                          id: `${column.field}_min`,
                        }}
                      />
                      <Box sx={{ minHeight: '20px' }}>
                        {errors && errors[`${column.field}_min`] && (
                          <ErrorMessage
                            name={`${column.field}_min`}
                            component={ErrorTextValidation}
                          />
                        )}
                      </Box>
                    </>
                  ) : (
                    <>
                      <Field
                        name={`${column.field}`}
                        as={CustomInputField}
                        backgroundColor="#434857"
                        width="100%"
                        height="10%"
                        type="text"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              disableTypography
                              sx={{ color: '#ccc' }}
                            >
                              $
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          maxLength:
                            column.field === 'draft1' ||
                            column.field === 'draft2'
                              ? 19
                              : 20,
                          id: `${column.field}_filter`,
                        }}
                      />
                      <Box sx={{ minHeight: '20px' }}>
                        {errors && errors[`${column.field}`] && (
                          <ErrorMessage
                            name={`${column.field}`}
                            component={ErrorTextValidation}
                          />
                        )}
                      </Box>
                    </>
                  )}
                </Grid>

                <Grid item xs={5} sx={{ marginBottom: '19px' }}>
                  <Field
                    name={`${column.field}_condition`}
                    inputProps={{ id: `${column.field}_condition` }}
                    as={CustomSelectField}
                    labelKey="label"
                    valueKey="value"
                    options={selectOptionsDropDown}
                  />
                </Grid>
              </Grid>
            </Grid>

            {values?.[
              `${column.field}_condition` as keyof SearchMyTaskQueryParams
            ] === 'between' && (
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    textAlign: 'center',
                    marginTop: '2px',
                    marginBottom: '5px',
                  }}
                >
                  And
                </Typography>
                <Field
                  name={`${column.field}_max`}
                  as={CustomInputField}
                  backgroundColor="#434857"
                  width="100%"
                  height="10%"
                  type="text"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        disableTypography
                        sx={{ color: '#ccc' }}
                      >
                        $
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    maxLength:
                      column.field === 'draft1' || column.field === 'draft2'
                        ? 19
                        : 20,
                    id: `${column.headerName}_max`,
                  }}
                />
                <Box sx={{ minHeight: '20px' }}>
                  {errors && errors[`${column.field}_max`] && (
                    <ErrorMessage
                      name={`${column.field}_max`}
                      component={ErrorTextValidation}
                    />
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
          <Divider sx={{ backgroundColor: 'gray', mb: 2 }} />
        </>
      );
    } else if (column.type === 'percentage') {
      if (
        values?.[
          `${column.field}_condition` as keyof SearchMyTaskQueryParams
        ] === 'between'
      ) {
        values[column.field] = '';
      }
      return (
        <>
          <Grid
            container
            item
            xs={12}
            sx={{ my: 2 }}
            alignItems="center"
            display="flex"
            justifyContent="flex-start"
          >
            <Grid
              item
              xs={12}
              display="flex"
              sx={{ my: 2 }}
              alignItems="center"
              justifyContent="space-between"
            >
              <CustomInputLabel>{labelWithCondition}:</CustomInputLabel>
              <ClearFieldButton
                fieldName={
                  values?.[
                    `${column.field}_condition` as keyof SearchMyTaskQueryParams
                  ] === 'between'
                    ? `${column.field}_min`
                    : `${column.field}`
                }
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid
                  item
                  xs={7}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  {values?.[
                    `${column.field}_condition` as keyof SearchMyTaskQueryParams
                  ] === 'between' ? (
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <Field
                          name={`${column.field}_min`}
                          as={CustomInputField}
                          backgroundColor="#434857"
                          width="100%"
                          height="10%"
                          type="text"
                          inputProps={{
                            maxLength: 20,
                            id: `${column.field}_min`,
                          }}
                          sx={{ flexGrow: 1 }}
                        />
                        <Typography display="inline" sx={{ marginLeft: '5px' }}>
                          %
                        </Typography>
                      </Box>
                      <Box sx={{ minHeight: '20px' }}>
                        {errors && errors[`${column.field}_min`] && (
                          <ErrorMessage
                            name={`${column.field}_min`}
                            component={ErrorTextValidation}
                          />
                        )}
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <Field
                          name={`${column.field}`}
                          as={CustomInputField}
                          backgroundColor="#434857"
                          width="100%"
                          height="10%"
                          type="text"
                          inputProps={{
                            maxLength: 20,
                            id: `${column.field}_filter`,
                          }}
                          sx={{ flexGrow: 1 }}
                        />
                        <Typography display="inline" sx={{ marginLeft: '5px' }}>
                          %
                        </Typography>
                      </Box>
                      <Box sx={{ minHeight: '20px' }}>
                        {errors && errors[`${column.field}`] && (
                          <ErrorMessage
                            name={`${column.field}`}
                            component={ErrorTextValidation}
                          />
                        )}
                      </Box>
                    </>
                  )}
                </Grid>

                <Grid item xs={5} sx={{ marginBottom: '19px' }}>
                  <Field
                    name={`${column.field}_condition`}
                    inputProps={{ id: `${column.field}_condition` }}
                    as={CustomSelectField}
                    labelKey="label"
                    valueKey="value"
                    options={selectOptionsDropDown}
                  />
                </Grid>
              </Grid>
            </Grid>

            {values?.[
              `${column.field}_condition` as keyof SearchMyTaskQueryParams
            ] === 'between' && (
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    textAlign: 'center',
                    marginTop: '2px',
                    marginBottom: '5px',
                  }}
                >
                  And
                </Typography>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Field
                      name={`${column.field}_max`}
                      as={CustomInputField}
                      backgroundColor="#434857"
                      width="100%"
                      height="10%"
                      type="text"
                      inputProps={{
                        maxLength: 20,
                        id: `${column.headerName}_max`,
                      }}
                      sx={{ flexGrow: 1 }}
                    />
                    <Typography display="inline" sx={{ marginLeft: '5px' }}>
                      %
                    </Typography>
                  </Box>
                  <Box sx={{ minHeight: '20px' }}>
                    {errors && errors[`${column.field}_min`] && (
                      <ErrorMessage
                        name={`${column.field}_max`}
                        component={ErrorTextValidation}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Divider sx={{ backgroundColor: 'gray', mb: 2 }} />
        </>
      );
    } else if (column.type === 'textArea') {
      return (
        <>
          <Grid container alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="space-between">
              <CustomInputLabel>{labelWithCondition}:</CustomInputLabel>
              <ClearFieldButton fieldName={column.field} />
            </Grid>
            <StyledGrid item xs={12} sx={{ my: 2 }}>
              <Field
                component={CustomTextArea}
                name={column.field}
                fullWidth
                inputProps={{ id: `${column.field}_filter`, rows: 3 }}
              />
              {errors && errors[column.field] && (
                <ErrorMessage
                  name={column.field}
                  component={ErrorTextValidation}
                />
              )}
            </StyledGrid>
          </Grid>
          <Divider sx={{ backgroundColor: 'gray', mb: 2 }} />
        </>
      );
    } else {
      return (
        <>
          <Grid container alignItems="center">
            <Grid item xs={12} display="flex" justifyContent="space-between">
              <CustomInputLabel>{labelWithCondition}:</CustomInputLabel>
              <ClearFieldButton fieldName={column.field} />
            </Grid>
            <StyledGrid item xs={12} sx={{ my: 2 }}>
              <Field
                as={StyledInputField}
                name={column.field}
                fullWidth
                inputProps={{
                  id: `${column.field}_filter`,
                  ...(column.field === 'zip'
                    ? { maxLength: 10 }
                    : column.field === 'filename'
                      ? { maxLength: 255 }
                      : column.field === 'contactName' ||
                          column.field === 'grantors'
                        ? { maxLength: 511 }
                        : { maxLength: 255 }),
                }}
              />
              {errors && errors[column.field] && (
                <ErrorMessage
                  name={column.field}
                  component={ErrorTextValidation}
                />
              )}
            </StyledGrid>
          </Grid>
          <Divider sx={{ backgroundColor: 'gray', mb: 2 }} />
        </>
      );
    }
  };
  const cleanUpFields = (
    acc: Partial<SearchMyTaskQueryParams>,
    baseKey: string,
    validKeys: string[]
  ) => {
    const possibleKeys = [
      `${baseKey}`,
      `${baseKey}_from`,
      `${baseKey}_to`,
      `${baseKey}_min`,
      `${baseKey}_max`,
    ];
    possibleKeys.forEach(key => {
      if (!validKeys.includes(key)) {
        delete acc[key as keyof SearchMyTaskQueryParams];
      }
    });
  };
  const handleSubmit = (values: SearchMyTaskQueryParams) => {
    const hasAtLeastOneValue = Object.values(values).some(
      value =>
        (value !== '' &&
          value !== null &&
          value !== undefined &&
          !['eq', 'gte', 'lte'].includes(value)) ||
        value === true
    );

    // Skip the check if skipValidation is true
    if (!skipValidation && !hasAtLeastOneValue) {
      setErrorMessage(
        'To proceed, please fill in at least one field other than the selection options'
      );
      return;
    }
    setErrorMessage(null);
    const updatedValues = Object.keys(values).reduce(
      (acc: Partial<SearchMyTaskQueryParams>, key) => {
        const value = values[key as keyof SearchMyTaskQueryParams];
        const baseKey = key.split('_')[0]; // Get base key (e.g., dueDate)
        const condition = values[`${baseKey}_condition`]; // Check for condition

        if (columns.find(column => column.field === key)?.type === 'checkbox') {
          if (value === true) {
            acc[key as keyof SearchMyTaskQueryParams] = value;
          }
          return acc; // Skip unchecked checkboxes
        }

        // If field does not have a condition (e.g., priority, fileName), directly add it
        if (!condition) {
          if (value !== '' && value !== null && value !== undefined) {
            acc[key as keyof SearchMyTaskQueryParams] = value;
          }
        } else {
          // Handle fields with conditions (eq, lt, gt, between)
          if (value !== '' && value !== null && value !== undefined) {
            if (
              condition === 'eq' ||
              condition === 'lte' ||
              condition === 'gte'
            ) {
              if (
                values[baseKey] !== '' &&
                values[baseKey] !== null &&
                values[baseKey] !== undefined
              ) {
                cleanUpFields(acc, baseKey, [
                  `${baseKey}`,
                  `${baseKey}_condition`,
                ]); // Cleanup and keep the base key and condition
                acc[baseKey as keyof SearchMyTaskQueryParams] =
                  values[baseKey as keyof SearchMyTaskQueryParams];
                acc[`${baseKey}_condition` as keyof SearchMyTaskQueryParams] =
                  condition; // Ensure condition is sent
              }
            } else if (condition === 'between') {
              const validKeys = [
                `${baseKey}_from`,
                `${baseKey}_to`,
                `${baseKey}_condition`,
                `${baseKey}_min`,
                `${baseKey}_max`,
              ];
              cleanUpFields(acc, baseKey, validKeys); // Cleanup and keep 'from', 'to' and condition keys
              if (
                values[`${baseKey}_from`] !== undefined &&
                values[`${baseKey}_from`] !== '' &&
                values[`${baseKey}_to`] !== undefined &&
                values[`${baseKey}_to`] !== ''
              ) {
                acc[`${baseKey}_from` as keyof SearchMyTaskQueryParams] =
                  values[`${baseKey}_from`];
                acc[`${baseKey}_to` as keyof SearchMyTaskQueryParams] =
                  values[`${baseKey}_to`];
                acc[`${baseKey}_condition` as keyof SearchMyTaskQueryParams] =
                  condition; // Ensure condition is sent
              } else if (
                values[`${baseKey}_min`] !== undefined &&
                values[`${baseKey}_min`] !== '' &&
                values[`${baseKey}_max`] !== undefined &&
                values[`${baseKey}_max`] !== ''
              ) {
                acc[`${baseKey}_min` as keyof SearchMyTaskQueryParams] =
                  values[`${baseKey}_min`];
                acc[`${baseKey}_max` as keyof SearchMyTaskQueryParams] =
                  values[`${baseKey}_max`];
                acc[`${baseKey}_condition` as keyof SearchMyTaskQueryParams] =
                  condition; // Ensure condition is sent
              }
            }
          }
        }
        return acc;
      },
      {} as Partial<SearchMyTaskQueryParams>
    );

    handleApplyFilter(updatedValues);
  };
  React.useEffect(() => {
    if (errorMessage) {
      const errorElement = document.querySelector(`[data-error-message]`);
      errorElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [errorMessage]);

  const handleClearAll = (formikResetForm: () => void) => {
    setErrorMessage('');
    formikResetForm();
    getFilteredDataTrigger({});
  };

  return (
    <Container fixed>
      <Grid container spacing={2}>
        {/* Filter Section */}
        <Grid item xs={12} md={4} sx={{ display: isOpen ? 'block' : 'none' }}>
          <Box
            sx={{
              position: { xs: 'fixed', md: 'absolute' },
              top: { xs: '0', md: '10%' },
              left: 0,
              width: { xs: '100%', md: '27%' },
              height: { xs: '100vh', md: '85vh' },
              bgcolor: '#10141F',
              color: 'white',
              boxShadow: 24,
              border: '1px solid #434857',
              borderRadius: { xs: 0, md: 2 },
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1300,
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={dashBoardMyTaskSchema(t)}
              onSubmit={handleSubmit}
              validateOnChange={false}
              enableReinitialize={false}
              validateOnBlur={false}
              validate={values => {
                try {
                  dashBoardMyTaskSchema(t).validateSync(values, {
                    abortEarly: false,
                  });
                } catch (error) {
                  if (
                    error instanceof Yup.ValidationError &&
                    error.inner.length > 0
                  ) {
                    setTimeout(() => {
                      const errorElement = document.querySelector(
                        `[name="${error.inner[0].path}"]`
                      );
                      errorElement?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      });
                    }, 100);
                  }
                  return {};
                }
                return {};
              }}
            >
              {({ values, resetForm, errors }) => {
                handleFormValuesChange(values);
                return (
                  <>
                    {/* Modal Header */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: '#1A1F2A',
                        zIndex: 1,
                        py: 2,
                        px: 4,
                        borderRadius: { xs: 0, md: 2 },
                        // mt: { xs: 3, md: 0 },
                      }}
                    >
                      <Typography
                        variant="h6"
                        id={title}
                        component="h2"
                        sx={{ color: 'white' }}
                      >
                        <Badge
                          badgeContent={activeFilterCount}
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': { backgroundColor: '#3f51b5' },
                          }}
                        >
                          {title}
                        </Badge>
                      </Typography>
                      <IconButton id="modal-close-button" onClick={handleClose}>
                        <Tooltip title="Close">
                          <CloseIcon sx={{ color: 'white' }} />
                        </Tooltip>
                      </IconButton>
                    </Box>

                    {/* Form */}
                    <Form id="filter-form">
                      {/* Scrollable Modal Content */}
                      <Box
                        sx={{
                          flex: 1,
                          overflowY: 'auto',
                          px: 2,
                          py: 2,
                          '&::-webkit-scrollbar': {
                            width: '8px',
                            height: '4px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: '#10141F',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '4px',
                          },
                          '&::-webkit-scrollbar-thumb:hover': {
                            background: '#555',
                          },
                        }}
                      >
                        <Box mt={2}>
                          {columns?.map(
                            (column, index) =>
                              column.filterable && (
                                <React.Fragment key={index}>
                                  {renderInput(column, values, errors)}
                                </React.Fragment>
                              )
                          )}
                        </Box>

                        {errorMessage && (
                          <Typography
                            data-error-message
                            sx={{
                              fontSize: '0.875rem',
                              color: '#FF474C',
                              fontFamily:
                                '"Roboto", "Helvetica", "Arial", sans-serif',
                              fontWeight: 400,
                              lineHeight: 1.43,
                            }}
                          >
                            {errorMessage}
                          </Typography>
                        )}
                      </Box>

                      {/* Sticky Footer */}
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                          position: 'fixed',
                          bottom: 0,
                          backgroundColor: '#1A1F2A',
                          zIndex: 1,
                          py: 2,
                          px: 4,
                          borderRadius: { xs: 0, md: 2 },
                          flexBasis: 'content',
                          width: { xs: '100%', md: '27%' },
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            '&:disabled': {
                              opacity: 0.2,
                              cursor: 'not-allowed',
                              backgroundColor: '#1997c6',
                              color: '#fff',
                            },
                            marginRight: 2,
                          }}
                          id="clear-all-button"
                          onClick={() => handleClearAll(resetForm)}
                        >
                          Clear All
                        </Button>

                        <Button
                          type="submit"
                          id="search-button"
                          variant="outlined"
                          sx={{
                            '&:disabled': {
                              opacity: 0.2,
                              cursor: 'not-allowed',
                              backgroundColor: '#1997c6',
                              color: '#fff',
                            },
                          }}
                        >
                          Search
                        </Button>
                      </Box>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommonModal;
