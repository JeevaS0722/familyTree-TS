// Import the createTheme function directly
import { createTheme } from '@mui/material/styles';

// Create a theme instance and configure it
const theme = createTheme({
  palette: {
    background: {
      default: '#252830', // Application background color
      paper: '#252830', // Background color for Paper components
    },
    primary: {
      main: '#222222', // Primary element color
    },
    text: {
      primary: '#C2C0C2', // Main text color for the application
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#222222',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#C2C0C2',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#C2C0C2',
          '&.Mui-focused': {
            color: '#C2C0C2',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& $notchedOutline': {
            borderColor: '#C2C0C2',
          },
          '&:hover $notchedOutline': {
            borderColor: '#C2C0C2',
          },
          '&.Mui-focused $notchedOutline': {
            borderColor: '#C2C0C2',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: 'white',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'normal',
        },
        outlined: {
          color: '#1997c6',
          borderColor: '#1997c6',
          '&:hover': {
            backgroundColor: '#1997c6',
            color: '#fff',
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          height: '50px !important',
          minHeight: '50px !important',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        fixed: {
          maxWidth: '100% !important',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: 'white',
          '&.Mui-active': {
            color: '#1997c6',
          },
          '&.Mui-active .MuiTableSortLabel-icon': {
            color: '#1997c6',
          },
        },
      },
    },
  },
});

export default theme;
