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
import { FamilyMember } from '../types';
import { Contact } from '../contactToFamilyMapper';

interface InitialNodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: FamilyMember) => void;
  isFirstNode?: boolean;
  contactList?: Contact[]; // Add contact list for autocomplete
}

const InitialNodeDialog: React.FC<InitialNodeDialogProps> = ({
  open,
  onClose,
  onSave,
  isFirstNode = false,
  contactList = [],
}) => {
  // Get fileId from URL params
  const { fileId } = useParams<{ fileId: string }>();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<{
    contact?: string;
    gender?: string;
  }>({});

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedContact(null);
      setGender(null);
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

  // Determine gender based on relationship
  const determineGender = (contact: Contact): 'male' | 'female' | 'other' => {
    const relationship = contact.relationship?.toLowerCase() || '';

    if (
      relationship.includes('husband') ||
      relationship.includes('father') ||
      relationship.includes('son')
    ) {
      return 'male';
    }

    if (
      relationship.includes('wife') ||
      relationship.includes('mother') ||
      relationship.includes('daughter')
    ) {
      return 'female';
    }

    // Default based on ID being even/odd as a fallback (arbitrary)
    return contact.contactID % 2 === 0 ? 'male' : 'female';
  };

  // Calculate age from birthdate string
  const calculateAge = (birthDateStr: string): string => {
    try {
      const birthDate = new Date(birthDateStr);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age.toString();
    } catch (e) {
      return '00';
    }
  };

  const handleSave = () => {
    if (!validateInputs()) {
      return;
    }

    // Create a FamilyMember from the selected contact
    const newMember: FamilyMember = {
      id: `contact-${selectedContact!.contactID}`,
      name: `${selectedContact!.firstName || ''} ${selectedContact!.lastName || ''}`.trim(),
      gender: gender as 'male' | 'female' | 'other',
      age: selectedContact!.dOB ? calculateAge(selectedContact!.dOB) : '00',
      birthDate: selectedContact!.dOB || '00/00/00',
      deathDate: selectedContact!.decDt || '00/00/00',
      address: [
        selectedContact!.address,
        selectedContact!.city,
        selectedContact!.state,
        selectedContact!.zip,
      ]
        .filter(Boolean)
        .join(', '),
      isDeceased: selectedContact!.deceased,
      divisionOfInterest: 'Primary Interest',
      percentage: `${parseFloat(selectedContact!.ownership).toFixed(4)} %`,
      relationshipType: isFirstNode ? 'Primary Root' : 'Primary File',
      children: [],
      // Add fileId and contactId
      fileId: fileId ? Number(fileId) : undefined,
      contactId: selectedContact!.contactID,
      // Keep reference to original contact data
      originalContact: selectedContact,
    };

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Contact Autocomplete */}
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
                // Automatically set gender if selected from contacts
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

          {/* Gender Selection */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant={gender === 'male' ? 'contained' : 'outlined'}
                color="primary"
                startIcon={<MaleIcon />}
                onClick={() => {
                  setGender('male');
                  setValidationErrors(prev => ({ ...prev, gender: undefined }));
                }}
                sx={{
                  width: 150,
                  height: 50,
                  backgroundColor:
                    gender === 'male' ? '#3498db' : 'transparent',
                  color: gender === 'male' ? 'white' : '#3498db',
                  '&:hover': {
                    backgroundColor:
                      gender === 'male' ? '#2980b9' : 'rgba(52, 152, 219, 0.1)',
                  },
                }}
              >
                Male
              </Button>

              <Button
                variant={gender === 'female' ? 'contained' : 'outlined'}
                color="secondary"
                startIcon={<FemaleIcon />}
                onClick={() => {
                  setGender('female');
                  setValidationErrors(prev => ({ ...prev, gender: undefined }));
                }}
                sx={{
                  width: 150,
                  height: 50,
                  backgroundColor:
                    gender === 'female' ? '#e74c3c' : 'transparent',
                  color: gender === 'female' ? 'white' : '#e74c3c',
                  '&:hover': {
                    backgroundColor:
                      gender === 'female'
                        ? '#c0392b'
                        : 'rgba(231, 76, 60, 0.1)',
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
