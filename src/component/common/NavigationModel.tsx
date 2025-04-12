import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

interface CustomModelProps {
  open: boolean;
  handleClose: () => void;
  routeLinks: { action: string; link: string }[];
  modalHeader: string;
}

const CustomModel: React.FC<CustomModelProps> = ({
  open,
  handleClose,
  routeLinks,
  modalHeader,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-header-title"
      aria-describedby="modal-content-description"
      maxWidth="sm" // Controls the dialog width
      fullWidth // Ensures full width usage
      sx={{
        '& .MuiDialog-paper': {
          padding: '24px',
          borderRadius: '8px',
          backgroundColor: '#1E1E1E',
          color: '#fff',
          minHeight: '300px', // Ensures enough height for content
        },
      }}
    >
      <DialogTitle
        id="modal-header-title"
        sx={{
          fontSize: '20px',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {modalHeader}
      </DialogTitle>
      <DialogContent
        sx={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'auto', // Allows scrolling if content overflows
          gap: '16px', // Adds space between elements
          marginTop: '20px',
        }}
      >
        <Grid
          container
          direction="column"
          spacing={2}
          sx={{
            textAlign: 'center',
            marginTop: '20px',
            gap: '12px', // Space between links
          }}
        >
          {routeLinks.map((route, index) => (
            <Link
              id={`link-${index}`}
              key={`link-${index}`}
              className="hover-link-span text-decoration-none"
              to={route.link}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: '#00BFFF',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'color 0.3s',
              }}
            >
              {route.action}
            </Link>
          ))}
        </Grid>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            color: '#fff',
            borderColor: '#00BFFF',
            ':hover': {
              backgroundColor: '#00BFFF',
              color: '#000',
            },
            marginTop: '16px',
          }}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModel;
