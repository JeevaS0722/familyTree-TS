import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import { object, string, boolean } from 'yup';
import styled from '@mui/material/styles/styled';
import background from '../../assets/images/background.webp';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../../store/Services/auth';
import { loginResponse, user } from '../../interface/user';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setServerTimezone } from '../../store/Reducers/timezoneSliceReducer';
import { StyledCheckboxField } from '../../component/common/CommonStyle';
import { getCurrentYear } from '../../utils/GeneralUtil';
import { useNavigate } from 'react-router-dom';

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'black',
    fontSize: '0.8rem',
    fontWeight: 'bolder',
  },
  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
    transform: 'translate(14px, -6px) scale(0.75)',
  },
  '& label': {
    fontSize: '0.8rem',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiOutlinedInput-root': {
    // borderRadius: '4px',
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
    '& .MuiInputBase-input': {
      color: 'black',
      backgroundColor: 'white',
      padding: '8px 14px',
      fontSize: '0.875rem',
      lineHeight: '1.25',
      '@media (max-width: 960px)': {
        fontSize: '1rem !important',
      },
    },
  },
  height: '2.5rem',
  width: '95%',
  '@media (max-width: 960px)': {
    fontSize: '1rem !important',
  },
});

const userSchema = object({
  username: string().required(),
  password: string().required(),
  stayLoggedIn: boolean(),
});

const style: {
  formHelperTextStyle: PropertyIndexedKeyframes;
} = {
  formHelperTextStyle: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#E64759',
    padding: '0.75rem 1.25rem',
    width: '95%',
    fontSize: '0.9rem',
    marginTop: '16px',
  },
};

const LoginPage: React.FC = () => {
  const { t } = useTranslation('login');
  const { t: et } = useTranslation('error');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector(state => state.auth);
  const [user, setUser] = useState<user>({
    username: '',
    password: '',
    stayLoggedIn: false,
  });
  const [login, { isLoading, error: loginError, reset }] = useLoginMutation();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [auth.isLoggedIn, navigate]);

  const handleLogin = async () => {
    try {
      await userSchema.validate(user);
    } catch (err) {
      return setError(true);
    }
    try {
      setError(false);

      const result = (await login({ data: user }).unwrap()) as loginResponse;

      // Assuming the timezone information is part of the response data:
      if (result?.servertimezone) {
        dispatch(setServerTimezone(result.servertimezone)); // Dispatch the timezone to the Redux store.
      }
      return result;
    } catch (err) {
      return err;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    userSchema
      .isValid({
        ...user,
        [name]: value,
      })
      .then(valid => {
        if (valid) {
          setError(false);
        }
      })
      .catch(() => {});
    if (loginError) {
      reset();
    }
    setUser({
      ...user,
      [name]: value,
    });
  };
  const handleChecked = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const { name } = e.target;
    setUser({
      ...user,
      [name]: checked,
    });
  };

  function IsErrorWithMessage(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message;
    }
    return et('error');
  }

  async function handleKeyEnter(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      await handleLogin();
    }
  }

  return (
    <Box
      sx={{
        background: `url(${background}) no-repeat center center fixed`,
        WebkitBackgroundSize: 'cover',
        MozBackgroundSize: 'cover',
        OBackgroundSize: 'cover',
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 20px',
      }}
    >
      <Container component="main" onKeyDown={handleKeyEnter} maxWidth="xs">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: 'white',
            textAlign: 'center',
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
          }}
        >
          {t('title')}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'white',
            textAlign: 'center',
            marginTop: '0.5rem',
            fontSize: '0.9rem',
          }}
        >
          © {getCurrentYear()} Enerlex, Inc
        </Typography>
        {!error && loginError && (
          <FormHelperText sx={style.formHelperTextStyle}>
            <Grid>
              {IsErrorWithMessage(
                'data' in loginError
                  ? loginError.data
                  : { message: 'server error' }
              )}
            </Grid>
          </FormHelperText>
        )}
        {error && (
          <FormHelperText sx={style.formHelperTextStyle}>
            <Grid sx={{ marginBottom: '10px' }}>
              There were error(s) in your form:
            </Grid>
            <Grid>
              {error && !user.username && 'Username is a required field'}
            </Grid>
            <Grid>
              {error && !user.password && 'Password is a required field'}
            </Grid>
          </FormHelperText>
        )}
        <Typography
          variant="body2"
          sx={{
            color: 'white',
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.9rem',
          }}
        >
          {t('description')}
        </Typography>
        <FormControl
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '0.5rem',
          }}
        >
          <CustomTextField
            size="small"
            placeholder={t('username')}
            fullWidth
            variant="outlined"
            name="username"
            onChange={handleChange}
            sx={{ marginBottom: '10px' }}
            inputProps={{ id: 'username' }}
          />
          <CustomTextField
            size="small"
            placeholder={t('password')}
            type="password"
            fullWidth
            name="password"
            onChange={handleChange}
            inputProps={{ id: 'password' }}
          />
          <FormControlLabel
            control={
              <StyledCheckboxField
                size="small"
                onChange={handleChecked}
                inputProps={{ id: 'stay-logged-in-checkbox' }}
              />
            }
            name="stayLoggedIn"
            label={t('remember')}
            labelPlacement="end"
            sx={{ color: 'white', fontSize: '0.5rem' }}
            id="stay-logged-in-label"
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#1BC98E !important',
              color: 'white !important',
              textTransform: 'none',
            }}
            disabled={isLoading}
            onClick={handleLogin}
            id="login"
          >
            {isLoading && (
              <CircularProgress
                size={15}
                sx={{ marginRight: '10px' }}
                color={'primary'}
              />
            )}
            {t('submit')}
          </Button>
        </FormControl>
      </Container>
    </Box>
  );
};

export default LoginPage;
