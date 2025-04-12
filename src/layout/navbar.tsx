/* eslint-disable complexity */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InputBase from '@mui/material/InputBase';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import ListItemIcon from '@mui/material/ListItemIcon';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../store/Services/auth';
import { useTranslation } from 'react-i18next';
import Notification from '../pages/notification/Notification';
import Description from '@mui/icons-material/Description';
import Tooltip from '@mui/material/Tooltip';
import Logo from '../assets/images/logo.png';
import InputLabel from '@mui/material/InputLabel';
import HelpIcon from '@mui/icons-material/Help';
import Menu from '@mui/material/Menu/Menu';
import InfoIcon from '@mui/icons-material/Info';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ReleaseNotePopup from '../pages/ReleaseNote/ReleaseNotePopup';
import { useSelector } from 'react-redux';
import JiraTicketForm from '../component/FeedBackForm';
import OverlayLoader from '../component/common/OverlayLoader';

const NavBar = (): JSX.Element => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchMenuOpen, setSearchMenuOpen] = useState<boolean>(false);
  const { t } = useTranslation('searchFileByNameOrPhone');
  const { t: lt } = useTranslation('login');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isMediumScreenTwo = useMediaQuery('(max-width:1100px)');
  const isMediumScreenFour = useMediaQuery('(max-width:1300px)');
  const isWideScreen = useMediaQuery('(min-width:1440px)');
  const is1400pxScreen = useMediaQuery('(min-width:1400px)');
  const is1300pxScreen = useMediaQuery('(min-width:1300px)');
  const is1200pxScreen = useMediaQuery('(min-width:1200px)');
  const is1100pxScreen = useMediaQuery('(min-width:1000px)');
  const is1000pxScreen = useMediaQuery('(min-width:950px)');
  const navigate = useNavigate();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [isSlideshowOpen, setSlideshowOpen] = useState(false);
  const [isOpenFeedbackForm, setOpenFeedbackForm] = useState(false);

  const version = useSelector(
    (state: {
      app: {
        version: string;
      };
    }) => state.app.version
  );

  useEffect(() => {
    if (
      !localStorage.getItem('appVersion') ||
      localStorage.getItem('appVersion') !== version
    ) {
      setSlideshowOpen(true);
      localStorage.setItem('appVersion', version);
    }
  }, [version]);

  const handleMobileMenuNavigate = (
    url: string,
    state?: { state: { [key: string]: string | boolean } }
  ) => {
    navigate(url, state);
    handleDrawerToggle();
  };

  const location = useLocation();
  const searchLinks = [
    '/searchfiles',
    '/searchoffers',
    '/searchmoea',
    '/searchcourts',
    '/searchoperators',
    '/searchdeeds',
    '/searchwellmasters',
  ];
  const handleLogout = async () => {
    return await logout('');
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleHelpClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleHelpClose = () => {
    setAnchorEl(null);
  };

  const isHelpOpen = Boolean(anchorEl);
  const searchBox = () => {
    const [searchInput, setSearchInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (searchInput.trim().length > 0) {
        navigate(`/findname?searchFor=${searchInput}`);
      }
      setSearchInput('');
      setIsFocused(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(event.target.value);
    };

    return (
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          p: '2px 0px',
          display: 'flex',
          alignItems: 'center',
          width:
            isMediumScreenTwo && !isMobile
              ? 180
              : isMediumScreenFour && !isMobile
                ? 250
                : 300,
          borderRadius: '5px', // Adjust the borderRadius to get the desired pill shape
          backgroundColor: isFocused ? '#ffffff' : '#434857', // Changes on focus
          height: '35px',
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            color: isFocused ? '#434857' : 'white', // Changes text color on focus
            'label + & .MuiInputBase-input::placeholder': {
              color: isFocused ? '#434857' : '#FFF', // Changes placeholder color on focus
            },
          }}
          placeholder={
            isMediumScreenTwo && !isMobile
              ? t('searchNameOrPhoneSmallScreen')
              : t('searchNameOrPhone')
          }
          required
          inputProps={{
            'aria-label': 'search name or phone',
            id: 'search-input',
            value: searchInput,
            onChange: handleInputChange,
          }}
        />
        <IconButton
          type="submit"
          sx={{
            px: '25px',
            color: 'white', // Icon color
            border: '1px solid #17a683', // Border color
            borderRadius: '5px', // Circular shape
            backgroundColor: '#000', // Background color
            '&:hover': {
              backgroundColor: '#17a683', // Slightly darker on hover
            },
            height: '35px',
            width: '35px',
            margin: '0px',
          }}
          aria-label="search"
          id="search-button"
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    );
  };

  const handleClosForm = () => {
    setOpenFeedbackForm(false);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#222222',
        color: 'white',
      }}
    >
      <OverlayLoader open={isLogoutLoading} loadingText={lt('logout')} />
      <Toolbar
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              id="menu-link"
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
              id="dashboard-link"
            >
              <img src={Logo as string} alt="logo" className="mlogo" />
              <Typography
                variant="h6"
                noWrap
                sx={{ fontSize: '1.25rem', color: '#FFFF', cursor: 'pointer' }}
                id="dashboard-title"
                onClick={() => navigate('/')}
              >
                FileMaster Dashboard
              </Typography>
            </Box>
            <Notification />
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={Logo as string} alt="logo" className="wlogo" />
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/')}
                component={Button}
                id="dashboard-link"
              >
                <Typography
                  variant="h6"
                  noWrap
                  sx={{ fontSize: '1.25rem', color: '#FFFF' }}
                  id="dashboard-title"
                >
                  FileMaster Dashboard
                </Typography>
              </Box>
              <FormControl
                sx={{
                  minWidth: 90,
                  marginLeft: 1,
                }}
                className={`hover-menu${searchLinks.includes(location.pathname) ? ' hover-menu-active' : ''}`}
                onClick={() => setSearchMenuOpen(!searchMenuOpen)}
              >
                <InputLabel
                  sx={{
                    top: '-6px',
                    '&.Mui-focused': {
                      color: '#1997c6',
                    },
                    color: '#cfd2da',
                  }}
                  id="search-select-label"
                  shrink={false}
                >
                  Search
                </InputLabel>
                <Select
                  displayEmpty
                  value={''}
                  label="search"
                  sx={{
                    maxHeight: '44px !important',
                    border: 'none',
                    '& .MuiSelect-icon': {
                      color: '#cfd2da', // Change 'red' to your desired color
                      right: '0px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none', // Removes the outline
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none', // Removes the outline on hover
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none', // Removes the outline when focused
                    },
                    '&.Mui-focused div': {
                      color: '#1997c6',
                    },
                    '&.Mui-focused svg path': {
                      color: '#1997c6',
                    },
                    fontSize: '0.9rem',
                    color: '#cfd2da',
                  }}
                  inputProps={{
                    id: 'search-select',
                  }}
                  MenuProps={{
                    open: searchMenuOpen,
                  }}
                >
                  <MenuItem
                    value="files"
                    id="files"
                    onClick={() => {
                      navigate('/searchfiles');
                    }}
                  >
                    Files
                  </MenuItem>
                  <MenuItem
                    value="offers"
                    id="offers"
                    onClick={() => navigate('/searchoffers')}
                  >
                    Offers
                  </MenuItem>
                  <MenuItem
                    value="moea"
                    id="moea"
                    onClick={async () => {
                      navigate('/searchmoea');
                    }}
                  >
                    MOEA
                  </MenuItem>
                  <MenuItem
                    value="courts"
                    id="courts"
                    onClick={() => navigate('/searchcourts')}
                  >
                    Courts
                  </MenuItem>
                  <MenuItem
                    value="operators"
                    id="operators"
                    onClick={() => navigate('/searchoperators')}
                  >
                    Operators
                  </MenuItem>
                  <MenuItem
                    value="deeds"
                    id="deeds"
                    onClick={() => navigate('/searchdeeds')}
                  >
                    Deeds
                  </MenuItem>
                  <MenuItem
                    value="wellMasters"
                    id="wellMasters"
                    onClick={() =>
                      navigate('/searchwellmasters', {
                        state: {
                          newSearch: true,
                        },
                      })
                    }
                  >
                    Well Masters
                  </MenuItem>
                </Select>
              </FormControl>
              <Box
                sx={{
                  paddingLeft: isWideScreen ? 5 : !is1200pxScreen ? 3 : 1,
                }}
              />
              <Tooltip title="Create Newfile">
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  className={`hover-menu${location.pathname.includes('newfile') ? ' hover-menu-active' : ''}`}
                  onClick={() => {
                    navigate('/newfile');
                  }}
                  // component={Button}
                  id="newfile-link"
                >
                  <FolderIcon sx={{ color: '#cfd2da', fontSize: '1rem' }} />
                  <Typography
                    noWrap
                    sx={{
                      color: '#cfd2da',
                      fontSize: '0.9rem',
                      paddingLeft: '5px',
                      cursor: 'pointer',
                    }}
                    id="newfile-title"
                  >
                    New File
                  </Typography>
                </Box>
              </Tooltip>
              <Box
                sx={{
                  paddingLeft: isWideScreen ? 5 : !is1100pxScreen ? 3 : 1,
                }}
              />
              <Tooltip title="Request Check">
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}
                  className={`hover-menu${location.pathname.includes('requestCheck') ? ' hover-menu-active' : ''}`}
                  // component={Button}
                  onClick={() => {
                    navigate('/requestCheck');
                  }}
                  id="request-link"
                >
                  <AttachMoneyIcon
                    sx={{ color: '#cfd2da', fontSize: '1rem' }}
                  />
                  {is1000pxScreen && (
                    <Typography
                      noWrap
                      sx={{
                        color: '#cfd2da',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        paddingLeft: '5px',
                      }}
                      id="request-title"
                    >
                      Request
                    </Typography>
                  )}
                </Box>
              </Tooltip>
              <Box
                sx={{
                  paddingLeft: isWideScreen ? 5 : !is1100pxScreen ? 3 : 1,
                }}
              />
              <Tooltip title="Generated documents list">
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}
                  onClick={() => {
                    navigate('/document/report');
                  }}
                  className={`hover-menu${location.pathname.includes('/document/report') ? ' hover-menu-active' : ''}`}
                  // component={Button}
                  id="document-generated-list-layout"
                >
                  <Description sx={{ color: '#cfd2da', fontSize: '1rem' }} />
                  {is1100pxScreen && (
                    <Typography
                      noWrap
                      sx={{
                        color: '#cfd2da',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        paddingLeft: '5px',
                      }}
                      id="document=generated-list-title"
                    >
                      Documents
                    </Typography>
                  )}
                </Box>
              </Tooltip>

              <Box
                sx={{
                  paddingLeft: isWideScreen ? 5 : !is1200pxScreen ? 3 : 1,
                }}
              />
              <Tooltip title="Help Center">
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}
                  className={`hover-menu${location.pathname.includes('/release-notes') ? ' hover-menu-active' : ''}`}
                  id="help-center-link"
                  onClick={handleHelpClick}
                >
                  <HelpIcon sx={{ color: '#cfd2da', fontSize: '1rem' }} />
                  {is1200pxScreen && (
                    <Typography
                      noWrap
                      sx={{
                        color: '#cfd2da',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        paddingLeft: '5px',
                      }}
                      id="help-center-title"
                    >
                      Help
                    </Typography>
                  )}
                </Box>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={isHelpOpen}
                MenuListProps={{
                  'aria-labelledby': 'help-center-menu',
                }}
                onClose={handleHelpClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate('/release-notes');
                    handleHelpClose();
                  }}
                >
                  <Typography variant="body1">
                    <IconButton
                      color="inherit"
                      sx={{
                        m: 0,
                        p: 1,
                        ml: 0,
                        mr: 0,
                      }}
                    >
                      <InfoIcon sx={{ color: '#cfd2da', fontSize: '1.2rem' }} />
                    </IconButton>
                    Release Notes
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setOpenFeedbackForm(true);
                    handleHelpClose();
                  }}
                >
                  <Typography>
                    <IconButton
                      color="inherit"
                      sx={{
                        m: 0,
                        p: 1,
                        ml: 0,
                        mr: 0,
                      }}
                    >
                      <ContactSupportIcon sx={{ color: '#cfd2da' }} />
                    </IconButton>
                    Report Issue
                  </Typography>
                </MenuItem>
              </Menu>
              <Box
                sx={{
                  paddingLeft: isWideScreen ? 5 : !is1300pxScreen ? 3 : 1,
                }}
              />
              <Notification />
              <Box
                sx={{
                  paddingLeft: isWideScreen ? 5 : !is1400pxScreen ? 3 : 1,
                }}
              />
              <Tooltip title="Logout">
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}
                  className="hover-menu"
                  // component={Button}
                  id="logout-link"
                  onClick={() => {
                    void handleLogout();
                  }}
                >
                  <LogoutIcon sx={{ color: '#cfd2da', fontSize: '1rem' }} />
                  {is1400pxScreen && (
                    <Typography
                      noWrap
                      sx={{
                        color: '#cfd2da',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        paddingLeft: '5px',
                      }}
                      id="logout-title"
                    >
                      Log Out
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              {searchBox()}
            </Box>
          </Box>
        )}
      </Toolbar>

      {isMobile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px',
          }}
        >
          {searchBox()}
        </Box>
      )}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: '65%',
            backgroundColor: '#222222',
            color: 'white',
          },
        }}
      >
        <Box
          sx={{ textAlign: 'center', paddingTop: theme.spacing(2) }}
          role="presentation"
        >
          {/* FileMaster Dashboard */}
          <ListSubheader
            sx={{
              cursor: 'pointer',
              backgroundColor: 'transparent', // Keep the background consistent
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => handleMobileMenuNavigate('/')}
            id="dashboard-link"
          >
            <img src={Logo as string} alt="logo" className="mlogo" />
            FileMaster Dashboard
          </ListSubheader>
          <Divider sx={{ bgcolor: '#DDDD', mx: 1 }} /> {/* The dividing line */}
          <List>
            {/* New File option */}
            <ListItem onClick={() => setSearchMenuOpen(!searchMenuOpen)}>
              <ListItemIcon>
                <SearchIcon sx={{ color: '#cfd2da' }} />
              </ListItemIcon>
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel
                  sx={{
                    top: '-15px',
                    left: '-15px',
                    fontSize: '1rem',
                    color: 'rgb(207, 210, 218)',
                  }}
                  id="search-select-label"
                  shrink={false}
                >
                  Search
                </InputLabel>
                <Select
                  displayEmpty
                  value={''}
                  label="search"
                  sx={{
                    maxHeight: '40px !important',
                    border: 'none',
                    '& .MuiSelect-icon': {
                      color: '#cfd2da', // Change 'red' to your desired color
                      right: '0px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none', // Removes the outline
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none', // Removes the outline on hover
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none', // Removes the outline when focused
                    },
                    '& .MuiSelect-select': {
                      padding: '0px', // Adjust this value to reduce the space
                      margin: '0px',
                    },
                    fontSize: '1rem',
                    fontWeight: 400,
                    color: '#cfd2da',
                  }}
                  inputProps={{ id: 'search-select' }}
                  MenuProps={{
                    open: searchMenuOpen,
                  }}
                >
                  <MenuItem
                    value="files"
                    id="files"
                    onClick={() => handleMobileMenuNavigate('/searchfiles')}
                  >
                    Files
                  </MenuItem>
                  <MenuItem
                    value="offers"
                    id="offers"
                    onClick={() => handleMobileMenuNavigate('/searchoffers')}
                  >
                    Offers
                  </MenuItem>
                  <MenuItem
                    value="moea"
                    id="moea"
                    onClick={async () => {
                      handleMobileMenuNavigate('/searchmoea');
                    }}
                  >
                    MOEA
                  </MenuItem>
                  <MenuItem
                    value="courts"
                    id="courts"
                    onClick={() => handleMobileMenuNavigate('/searchcourts')}
                  >
                    Courts
                  </MenuItem>
                  <MenuItem
                    value="operators"
                    id="operators"
                    onClick={() => handleMobileMenuNavigate('/searchoperators')}
                  >
                    Operators
                  </MenuItem>
                  <MenuItem
                    value="deeds"
                    id="deeds"
                    onClick={() => handleMobileMenuNavigate('/searchdeeds')}
                  >
                    Deeds
                  </MenuItem>
                  <MenuItem
                    value="wellMasters"
                    id="wellMasters"
                    onClick={() =>
                      handleMobileMenuNavigate('/searchwellmasters', {
                        state: {
                          newSearch: true,
                        },
                      })
                    }
                  >
                    Well Masters
                  </MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <ListItem
              component={Button}
              onClick={() => {
                handleMobileMenuNavigate('/newfile');
              }}
              id="newfile-link"
            >
              <ListItemIcon>
                <FolderIcon sx={{ color: '#cfd2da' }} />
              </ListItemIcon>
              <ListItemText
                id="newfile-title"
                primary="New File"
                primaryTypographyProps={{ style: { color: '#cfd2da' } }}
              />
            </ListItem>

            {/* Request option */}
            <ListItem
              component={Button}
              onClick={() => {
                handleMobileMenuNavigate('/requestCheck');
              }}
              id="request-link"
            >
              <ListItemIcon>
                <AttachMoneyIcon sx={{ color: '#cfd2da' }} />
              </ListItemIcon>
              <ListItemText
                primary="Request"
                primaryTypographyProps={{ style: { color: '#cfd2da' } }}
                id="request-title"
              />
            </ListItem>

            {/* Log Out option */}
            <ListItem
              component={Button}
              onClick={() => {
                void handleLogout();
              }}
              id="logout-link"
            >
              <ListItemIcon>
                <LogoutIcon sx={{ color: '#cfd2da' }} />
              </ListItemIcon>
              <ListItemText
                primary="Log Out"
                primaryTypographyProps={{ style: { color: '#cfd2da' } }}
                id="logout-title"
              />
            </ListItem>

            {/* Document Option*/}
            <ListItem
              component={Button}
              onClick={() => {
                handleMobileMenuNavigate('/document/report');
              }}
              id="document-generate-list-link"
            >
              <ListItemIcon>
                <Description sx={{ color: '#cfd2da' }} />
              </ListItemIcon>
              <ListItemText
                primary="Documents"
                primaryTypographyProps={{ style: { color: '#cfd2da' } }}
                id="document-generate-list-title"
              />
            </ListItem>
            <ListItem component={Button} id="document-generate-list-link">
              <ListItemIcon>
                <HelpIcon sx={{ color: '#cfd2da' }} />
              </ListItemIcon>
              <ListItemText
                primary="Help Center"
                primaryTypographyProps={{ style: { color: '#cfd2da' } }}
                id="help-center-title"
                onClick={handleHelpClick}
              />
            </ListItem>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleHelpClose}
            >
              <MenuItem
                onClick={() => {
                  navigate('/release-notes');
                  handleHelpClose();
                  handleDrawerToggle();
                }}
              >
                Release Notes
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setOpenFeedbackForm(true);
                  handleDrawerToggle();
                }}
              >
                Report Issue
              </MenuItem>
            </Menu>
          </List>
        </Box>
      </Drawer>

      {isSlideshowOpen && (
        <ReleaseNotePopup
          open={isSlideshowOpen}
          setSlideshowOpen={setSlideshowOpen}
        />
      )}
      {isOpenFeedbackForm && (
        <JiraTicketForm
          openModel={isOpenFeedbackForm}
          onClose={handleClosForm}
        />
      )}
    </AppBar>
  );
};

export default NavBar;
