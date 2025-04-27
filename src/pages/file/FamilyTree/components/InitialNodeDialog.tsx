// src/components/FamilyTree/components/InitialNodeDialog.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Box,
  FormHelperText,
} from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { PersonData } from '../components/FamilyTreeBuilder/types/familyTree';
import { Contact } from '../types';
import { contactsToFamilyTreemapper, determineGender } from '../utils/mapper';

interface InitialNodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: PersonData) => void;
  isFirstNode?: boolean;
  contactList?: Contact[];
}

const InitialNodeDialog: React.FC<InitialNodeDialogProps> = ({
  open,
  onClose,
  onSave,
  isFirstNode = false,
  contactList = [],
}) => {
  const { fileId } = useParams<{ fileId: string }>();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [gender, setGender] = useState<'M' | 'F' | ''>('M');
  const [validationErrors, setValidationErrors] = useState<{
    contact?: string;
    gender?: string;
  }>({});

  useEffect(() => {
    if (open) {
      setSelectedContact(null);
      setGender('M');
      setValidationErrors({});
    }
  }, [open]);

  const validateInputs = (): boolean => {
    const errors: {
      contact?: string;
      gender?: string;
    } = {};

    if (!selectedContact) {
      errors.contact = 'Please select a contact';
    }

    if (!gender) {
      errors.gender = 'Please select a gender';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateInputs()) {
      return;
    }

    const newMember: PersonData = contactsToFamilyTreemapper(
      { ...selectedContact, gender: gender } as Contact,
      fileId,
      isFirstNode
    );

    onSave(newMember);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: '#2C2C2C',
        },
      }}
    >
      <DialogTitle
        sx={{
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          backgroundColor: '#1E1E1E',
        }}
      >
        {isFirstNode ? 'Create Family Tree Root' : 'Add New Member'}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <Box>
            <Autocomplete
              options={contactList}
              getOptionLabel={option =>
                `${option.firstName || ''} ${option.lastName || ''}`.trim()
              }
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <strong>
                      {`${option.firstName || ''} ${option.lastName || ''}`.trim()}
                    </strong>
                    {option.relationship && (
                      <span style={{ marginLeft: 8, opacity: 0.7 }}>
                        ({option.relationship})
                      </span>
                    )}
                    {option.ownership && (
                      <span style={{ marginLeft: 8, opacity: 0.7 }}>
                        {parseFloat(option.ownership).toFixed(4)}%
                      </span>
                    )}
                  </Box>
                </li>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Select Contact"
                  variant="outlined"
                  fullWidth
                  error={!!validationErrors.contact}
                  InputLabelProps={{
                    sx: { color: 'white' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: validationErrors.contact
                          ? '#f44336'
                          : 'rgba(255,255,255,0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: validationErrors.contact
                          ? '#f44336'
                          : 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      '& .MuiIconButton-root': {
                        color: 'white',
                      },
                    },
                  }}
                />
              )}
              value={selectedContact}
              onChange={(_, newValue) => {
                setSelectedContact(newValue);
                if (newValue) {
                  setGender(determineGender(newValue));
                  setValidationErrors(prev => ({
                    ...prev,
                    contact: undefined,
                  }));
                }
              }}
              isOptionEqualToValue={(option, value) =>
                option.contactID === value.contactID
              }
            />
            {validationErrors.contact && (
              <FormHelperText error>{validationErrors.contact}</FormHelperText>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                disabled={!selectedContact}
                variant={gender === 'M' ? 'contained' : 'outlined'}
                color="primary"
                startIcon={<MaleIcon />}
                onClick={() => {
                  setGender('M');
                  setValidationErrors(prev => ({ ...prev, gender: undefined }));
                }}
                sx={{
                  width: 150,
                  height: 50,
                  backgroundColor: gender === 'M' ? '#3498db' : 'transparent',
                  color: gender === 'M' ? 'white' : '#3498db',
                  '&:hover': {
                    backgroundColor:
                      gender === 'M' ? '#2980b9' : 'rgba(52, 152, 219, 0.1)',
                  },
                }}
              >
                Male
              </Button>

              <Button
                disabled={!selectedContact}
                variant={gender === 'F' ? 'contained' : 'outlined'}
                color="secondary"
                startIcon={<FemaleIcon />}
                onClick={() => {
                  setGender('F');
                  setValidationErrors(prev => ({ ...prev, gender: undefined }));
                }}
                sx={{
                  width: 150,
                  height: 50,
                  backgroundColor: gender === 'F' ? '#e74c3c' : 'transparent',
                  color: gender === 'F' ? 'white' : '#e74c3c',
                  '&:hover': {
                    backgroundColor:
                      gender === 'F' ? '#c0392b' : 'rgba(231, 76, 60, 0.1)',
                  },
                }}
              >
                Female
              </Button>
            </Box>
            {validationErrors.gender && (
              <FormHelperText error sx={{ textAlign: 'center' }}>
                {validationErrors.gender}
              </FormHelperText>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'center',
          pb: 2,
          '& > *': {
            width: '40%',
            height: 50,
          },
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: '#666',
            color: '#666',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderColor: '#999',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: '#4CAF50',
            '&:hover': {
              backgroundColor: '#45a049',
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(76, 175, 80, 0.5)',
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InitialNodeDialog;
