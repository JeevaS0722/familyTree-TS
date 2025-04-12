import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Field } from 'formik';
import { CustomTextArea } from '../../component/CommonComponent';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
} from '../../component/common/CommonStyle';
import { TaskFormProps } from '../../interface/task';
import { CustomSelectField } from '../../component/CustomizedSelectComponent';
import { Box } from '@mui/material';
import CustomDateTimePicker from '../../component/FormikCustomDateTimePicker';

const EditTaskForm: React.FC<TaskFormProps> = ({
  isValidating,
  values,
  errors,
  mode,
  dropDownValue,
  fieldVisibility,
  taskVisibleFields,
  handleInputChange,
}) => {
  const { t } = useTranslation('task');
  const dateDueRef = useRef<HTMLLabelElement>(null);
  const typeRef = useRef<HTMLLabelElement>(null);
  const priorityRef = useRef<HTMLLabelElement>(null);
  const NewTaskDueDateTimeRef = useRef<HTMLLabelElement>(null);
  const NewTaskPriorityRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    if (!isValidating) {
      if (errors?.dateDue) {
        dateDueRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      if (errors?.type) {
        typeRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      if (errors?.priority) {
        priorityRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      if (errors?.NewTaskDueDateTime) {
        NewTaskDueDateTimeRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      if (errors?.NewTaskPriority) {
        NewTaskPriorityRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors, isValidating]);
  return (
    <>
      <Grid item xs={12} sm={2} xl={1}>
        <CustomInputLabel required>{t('typeOfTask')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} sm={10} xl={11}>
        <Field
          name="type"
          inputProps={{ id: 'type' }}
          as={CustomSelectField}
          options={dropDownValue?.taskTypes}
          hasEmptyValue={true}
          labelKey="value"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleInputChange('type', e.target.value)
          }
        />
        {errors?.type && (
          <Box ref={typeRef}>
            <ErrorText id="typeValidationMsg">{errors?.type}</ErrorText>
          </Box>
        )}
      </StyledGrid>
      {mode === 'add' && (
        <>
          <Grid item xs={12} sm={2} xl={1}>
            <CustomInputLabel>{t('assignedTo')}:</CustomInputLabel>
          </Grid>
          <StyledGrid item xs={12} sm={10} xl={11}>
            <Field
              name="toUserID"
              inputProps={{ id: 'toUserID' }}
              as={CustomSelectField}
              options={dropDownValue.users}
              labelKey="label"
            />
          </StyledGrid>
        </>
      )}
      {fieldVisibility.showDateDue && (
        <>
          <Grid item xs={12} sm={2} xl={1}>
            <CustomInputLabel> {t('dueDate')}: </CustomInputLabel>
          </Grid>
          <StyledGrid item xs={12} sm={10} xl={11}>
            <CustomDateTimePicker
              name="dateDue"
              type="date"
              id="dateDue"
              sx={{
                paddingTop: '0 !important',
              }}
            />
            {errors?.dateDue && (
              <Box ref={dateDueRef}>
                <ErrorText id="error-dateDue">{errors?.dateDue}</ErrorText>
              </Box>
            )}
          </StyledGrid>
        </>
      )}
      <Grid item xs={12} sm={2} xl={1}>
        <CustomInputLabel required>{t('priority')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} sm={10} xl={11}>
        <Field
          name="priority"
          inputProps={{ id: 'priority' }}
          as={CustomSelectField}
          options={dropDownValue?.priorityTypes}
          labelKey="value"
        />
        {errors?.priority && (
          <Box ref={priorityRef}>
            <ErrorText id="priorityValidationMsg">{errors?.priority}</ErrorText>
          </Box>
        )}
      </StyledGrid>
      {fieldVisibility.showCounty && (
        <>
          <Grid item xs={12} sm={2} xl={1}>
            <CustomInputLabel>{t('county')}:</CustomInputLabel>
          </Grid>
          <StyledGrid item xs={12} sm={10} xl={11}>
            <Field
              name="city"
              as={StyledInputField}
              type="text"
              fullWidth
              inputProps={{
                id: 'city',
                maxLength: 255,
              }}
              sx={{
                width: { xs: '100%' },
                background: '#434857',
              }}
            />
          </StyledGrid>
        </>
      )}
      <Grid item xs={12} sm={2} xl={1}>
        <CustomInputLabel> {t('notes')}: </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} sm={10} xl={11}>
        <Field
          name="memo"
          xsWidth="100%"
          mdWidth="100%"
          inputProps={{ id: 'memo', rows: 5 }}
          component={CustomTextArea}
        />
      </StyledGrid>
      {fieldVisibility.showResult && (
        <>
          <Grid item xs={12} sm={2} xl={1}>
            <CustomInputLabel>{t('result')}:</CustomInputLabel>
          </Grid>
          <StyledGrid item xs={12} sm={10} xl={11}>
            <Field
              name="result"
              inputProps={{ id: 'result' }}
              as={CustomSelectField}
              hasEmptyValue={true}
              options={dropDownValue?.resultTypes}
              labelKey="value"
            />
          </StyledGrid>
        </>
      )}
      {values?.result &&
        taskVisibleFields.newTaskField.includes(values?.result) && (
          <>
            <Grid item xs={12} sm={2} xl={1}>
              <CustomInputLabel>{t('newTaskDate')}:</CustomInputLabel>
            </Grid>
            <StyledGrid item xs={12} sm={10} xl={11}>
              <CustomDateTimePicker
                name="NewTaskDueDateTime"
                type="datetime"
                id="NewTaskDueDateTime"
                sx={{
                  paddingTop: '0 !important',
                }}
              />
              {errors?.NewTaskDueDateTime && (
                <Box ref={NewTaskDueDateTimeRef}>
                  <ErrorText id="error-NewTaskDueDateTime">
                    {errors?.NewTaskDueDateTime}
                  </ErrorText>
                </Box>
              )}
            </StyledGrid>
            <Grid item xs={12} sm={2} xl={1}>
              <CustomInputLabel>{t('assignNewTaskTo')}:</CustomInputLabel>
            </Grid>
            <StyledGrid item xs={12} sm={10} xl={11}>
              <Field
                name="NewTaskToUser"
                inputProps={{ id: 'NewTaskToUser' }}
                as={CustomSelectField}
                options={dropDownValue.users}
                labelKey="label"
                valueKey="value"
                sx={{
                  width: { xs: '100%' },
                  background: '#434857',
                }}
              />
              <CustomInputLabel sx={{ marginTop: '5px' }}>
                {t('assignInfo')}
              </CustomInputLabel>
            </StyledGrid>
            <Grid item xs={12} sm={2} xl={1}>
              <CustomInputLabel>{t('newTaskPriority')}:</CustomInputLabel>
            </Grid>
            <StyledGrid item xs={12} sm={10} xl={11}>
              <Field
                name="NewTaskPriority"
                inputProps={{ id: 'NewTaskPriority' }}
                as={CustomSelectField}
                isLegalStateOption={true}
                options={dropDownValue?.priorityTypes}
                labelKey="value"
              />
              {errors?.NewTaskPriority && (
                <Box ref={NewTaskPriorityRef}>
                  <ErrorText id="newPriorityValidationMsg">
                    {errors?.NewTaskPriority}
                  </ErrorText>
                </Box>
              )}
            </StyledGrid>
          </>
        )}
      {values?.result &&
        !taskVisibleFields.newTaskMemo.includes(values?.result) && (
          <>
            <Grid item xs={12} sm={2} xl={1}>
              <CustomInputLabel>{t('newTaskMemo')}:</CustomInputLabel>
            </Grid>
            <StyledGrid item xs={12} sm={10} xl={11}>
              <Field
                name="NewTaskMemo"
                xsWidth="100%"
                mdWidth="100%"
                inputProps={{ id: 'newTaskMemo', rows: 5 }}
                component={CustomTextArea}
              />
            </StyledGrid>
          </>
        )}
    </>
  );
};

export default EditTaskForm;
