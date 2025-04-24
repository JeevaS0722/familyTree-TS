/* eslint-disable no-console */
/* eslint-disable max-depth */
/* eslint-disable complexity */
// src/components/FamilyTree/components/EditDialog.tsx - Updated with otherParentId support
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
  Grid,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Contact } from '../types';
import { useCreateContactMutation } from '../../../../store/Services/contactService';
import { PersonData as FamilyMember } from './FamilyTreeBuilder/types/familyTree';
import { contactsToFamilyTreemapper } from '../utils/mapper';

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: FamilyMember) => void;
  parentMember?: FamilyMember | null;
  contactList?: Contact[];
  existingFamilyMembers?: FamilyMember[];
  refreshContacts?: () => Promise<Contact[]>;
  initialRelationshipType?: string | null;
  otherParentId?: string;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  onSave,
  parentMember,
  contactList = [],
  existingFamilyMembers = [],
  refreshContacts = async () => [],
  initialRelationshipType,
  otherParentId,
}) => {
  // Get fileId from URL params
  const { fileId } = useParams<{ fileId: string }>();

  // RTK Query hook for creating contacts
  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();

  // State for selected contact vs adding new contact
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingNewContact, setIsAddingNewContact] = useState(false);
  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<{
    contact?: string;
    firstName?: string;
    ownership?: string;
  }>({});

  // State for new contact form
  const [newContactForm, setNewContactForm] = useState({
    relationship: '',
    ownership: '',
    lastName: '',
    gender: '',
    firstName: '',
    deceased: false,
    decDt: '',
    dOB: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  // When dialog opens, set the relationship type based on initialRelationshipType
  useEffect(() => {
    console.log(
      'Dialog opened with initialRelationshipType:',
      initialRelationshipType
    );
    if (open && initialRelationshipType) {
      let gender = '';
      if (
        initialRelationshipType === 'father' ||
        initialRelationshipType === 'son'
      ) {
        gender = 'male';
      } else if (
        initialRelationshipType === 'mother' ||
        initialRelationshipType === 'daughter' ||
        initialRelationshipType === 'suppose'
      ) {
        gender = 'female';
      }
      let formatRelationship = initialRelationshipType || '';
      if (initialRelationshipType === 'spouse') {
        formatRelationship = `Wife of ${parentMember?.data?.name || ''}`;
      } else if (initialRelationshipType === 'son') {
        formatRelationship = `Son of ${parentMember?.data?.name || ''}`;
      } else if (initialRelationshipType === 'daughter') {
        formatRelationship = `Daughter of ${parentMember?.data?.name || ''}`;
      } else if (initialRelationshipType === 'father') {
        formatRelationship = `Father of ${parentMember?.data?.name || ''}`;
      } else if (initialRelationshipType === 'mother') {
        formatRelationship = `Mother of ${parentMember?.data?.name || ''}`;
      }
      setNewContactForm(prev => ({
        ...prev,
        relationship: formatRelationship,
        gender,
      }));
    }
  }, []);

  const validateSelectContactInputs = (): boolean => {
    const errors: {
      contact?: string;
    } = {};

    if (!selectedContact && !isAddingNewContact) {
      errors.contact = 'Please select a contact';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateNewContactInputs = (): boolean => {
    const errors: {
      firstName?: string;
      ownership?: string;
    } = {};

    if (!newContactForm.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!newContactForm.ownership) {
      errors.ownership = 'Ownership is required';
    } else if (isNaN(parseFloat(newContactForm.ownership))) {
      errors.ownership = 'Ownership must be a valid number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form field changes
  const handleNewContactChange = (field: string, value: string | boolean) => {
    setNewContactForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveExistingContact = async () => {
    if (!validateSelectContactInputs()) {
      return;
    }
    console.log('Selected contact:', selectedContact);

    // Create a family member from the selected contact
    const newMember = contactsToFamilyTreemapper(
      selectedContact as Contact,
      fileId,
      false
    );

    console.log('Created family member from existing contact:', newMember);
    onSave(newMember);
  };

  const handleSaveNewContact = async () => {
    if (!validateNewContactInputs()) {
      return;
    }

    try {
      // Create contact data object
      const contactData = {
        fileID: Number(fileId),
        relationship: initialRelationshipType || newContactForm.relationship,
        ownership: newContactForm.ownership,
        lastName: newContactForm.lastName,
        firstName: newContactForm.firstName,
        deceased: newContactForm.deceased,
        decDt: newContactForm.decDt,
        dOB: newContactForm.dOB,
        address: newContactForm.address,
        city: newContactForm.city,
        state: newContactForm.state,
        zip: newContactForm.zip,
        gender: newContactForm.gender,
      };

      console.log('Creating contact with data:', contactData);

      // Submit the new contact
      const response = await createContact(contactData).unwrap();

      console.log('Contact creation API Response:', response);

      if (response?.success && response?.data?.contactID) {
        const newContactId = response.data.contactID;
        console.log('Successfully created contact with ID:', newContactId);

        // If we have the refreshContacts function, use it to get updated contact list
        if (refreshContacts) {
          try {
            console.log('Refreshing contacts after creating new contact...');
            const updatedContacts = await refreshContacts();
            console.log('Refreshed contacts count:', updatedContacts.length);

            // Find the newly created contact in the refreshed list
            const createdContact = updatedContacts.find(
              c => c.contactID === newContactId
            );

            if (createdContact) {
              console.log(
                'Found newly created contact in refreshed list:',
                createdContact
              );

              // Check if the contact has any tasks/notes (likely won't for a new contact)
              const hasNotes =
                Array.isArray(createdContact.TasksModels) &&
                createdContact.TasksModels.length > 0;
              const newMember = contactsToFamilyTreemapper(
                createdContact,
                fileId,
                hasNotes
              );

              console.log('Created family member to be saved:', newMember);
              onSave(newMember);
              return;
            } else {
              console.warn(
                'Could not find the newly created contact in the refreshed list. Will use form data instead.'
              );
            }
          } catch (refreshError) {
            console.error('Error refreshing contacts:', refreshError);
            // Continue with form data if refresh fails
          }
        }

        // Fallback if refresh fails or contact not found after refresh
        // Create a family member based on the form data
        const newMember = contactsToFamilyTreemapper(
          {
            ...newContactForm,
            contactID: newContactId,
          } as Contact,
          fileId,
          false
        );
        console.log('Created family member from form data:', newMember);
        onSave(newMember);
      } else {
        console.error('Contact creation failed or invalid response:', response);
      }
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  // Combined save handler
  const handleSave = () => {
    if (isAddingNewContact) {
      void handleSaveNewContact();
    } else {
      void handleSaveExistingContact();
    }
  };

  // State options
  const stateOptions = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
    'DC',
    'PR',
    'VI',
    'AA',
    'AE',
    'AP',
  ];

  const getDialogTitle = () => {
    if (!parentMember) {
      return isAddingNewContact ? 'Add New Contact' : 'Add Family Member';
    }

    const otherParentTitle = otherParentId ? ' (with other parent)' : '';

    return isAddingNewContact
      ? `Add New Contact for ${parentMember.data.name || ''}${otherParentTitle}`
      : `Add Family Member for ${parentMember.data.name || ''}${otherParentTitle}`;
  };

  // Filter out contacts that are already in the family tree
  const filteredContacts = React.useMemo(() => {
    // Extract contact IDs that are already in the family tree
    const existingContactIds = new Set(
      existingFamilyMembers
        .filter(member => member.data.contactId)
        .map(member => member.data.contactId)
    );

    // Don't filter out the parent member itself
    if (parentMember?.data.contactId) {
      existingContactIds.delete(parentMember?.data?.contactId);
    }

    // Don't filter out the other parent if specified
    if (otherParentId) {
      const otherParent = existingFamilyMembers.find(
        m => m.id === otherParentId
      );
      if (otherParent?.data.contactId) {
        existingContactIds.delete(otherParent.data.contactId);
      }
    }

    // Filter the contact list
    return contactList.filter(
      contact => !existingContactIds.has(contact.contactID)
    );
  }, [contactList, existingFamilyMembers, parentMember, otherParentId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isAddingNewContact ? 'md' : 'xs'}
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
        {getDialogTitle()}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        {!isAddingNewContact ? (
          // EXISTING CONTACT SELECTION MODE
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Contact Autocomplete with Add Contact button - First Row */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Autocomplete
                  options={filteredContacts}
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
                      setValidationErrors(prev => ({
                        ...prev,
                        contact: undefined,
                      }));
                    }
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.contactID === value.contactID
                  }
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setIsAddingNewContact(true)}
                  sx={{
                    height: 56,
                    backgroundColor: '#4CAF50',
                    '&:hover': {
                      backgroundColor: '#45a049',
                    },
                  }}
                >
                  Add
                </Button>
              </Box>
              {validationErrors.contact && (
                <FormHelperText error>
                  {validationErrors.contact}
                </FormHelperText>
              )}
            </Box>

            {/* Relation Dropdown - Second Row */}
            <Box>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  id="relationship"
                  label="Relation"
                  value={newContactForm.relationship}
                  onChange={e =>
                    handleNewContactChange('relationship', e.target.value)
                  }
                  InputLabelProps={{
                    sx: { color: 'white' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </FormControl>
            </Box>
          </Box>
        ) : (
          // ADD NEW CONTACT MODE
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              {/* Last Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={newContactForm.lastName}
                  onChange={e =>
                    handleNewContactChange('lastName', e.target.value)
                  }
                  InputLabelProps={{
                    sx: { color: 'white' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>

              {/* First Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  label="First Name *"
                  value={newContactForm.firstName}
                  onChange={e =>
                    handleNewContactChange('firstName', e.target.value)
                  }
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                  InputLabelProps={{
                    sx: { color: 'white' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: validationErrors.firstName
                          ? '#f44336'
                          : 'rgba(255,255,255,0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: validationErrors.firstName
                          ? '#f44336'
                          : 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: validationErrors.firstName
                          ? '#f44336'
                          : 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>

              {/* Relation dropdown */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    id="relationship"
                    label="Relation"
                    value={newContactForm.relationship}
                    onChange={e =>
                      handleNewContactChange('relationship', e.target.value)
                    }
                    InputLabelProps={{
                      sx: { color: 'white' },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                    }}
                  />
                </FormControl>
              </Grid>

              {/* Ownership */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="ownership"
                  label="Ownership (%)"
                  value={newContactForm.ownership}
                  onChange={e =>
                    handleNewContactChange('ownership', e.target.value)
                  }
                  error={!!validationErrors.ownership}
                  helperText={validationErrors.ownership}
                  InputLabelProps={{
                    sx: { color: 'white' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>

              {/* Deceased Checkbox */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newContactForm.deceased}
                      onChange={e =>
                        handleNewContactChange('deceased', e.target.checked)
                      }
                      sx={{
                        color: 'white',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                    />
                  }
                  label="Deceased"
                  sx={{
                    color: 'white',
                  }}
                />
              </Grid>

              {/* Date of Death */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="decDt"
                  label="Date of Death"
                  value={newContactForm.decDt}
                  onChange={e =>
                    handleNewContactChange('decDt', e.target.value)
                  }
                  placeholder="MM/DD/YYYY"
                  InputLabelProps={{
                    sx: { color: 'white' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="dOB"
                  label="Date of Birth"
                  value={newContactForm.dOB}
                  onChange={e => handleNewContactChange('dOB', e.target.value)}
                  placeholder="MM/DD/YYYY"
                  InputLabelProps={{
                    sx: { color: 'white' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  label="Address"
                  value={newContactForm.address}
                  onChange={e =>
                    handleNewContactChange('address', e.target.value)
                  }
                  InputLabelProps={{
                    sx: { color: 'white' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>

              {/* City */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  id="city"
                  label="City"
                  value={newContactForm.city}
                  onChange={e => handleNewContactChange('city', e.target.value)}
                  InputLabelProps={{
                    sx: { color: 'white' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>

              {/* State */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="state-label" sx={{ color: 'white' }}>
                    State
                  </InputLabel>
                  <Select
                    labelId="state-label"
                    id="state"
                    value={newContactForm.state}
                    onChange={e =>
                      handleNewContactChange('state', e.target.value)
                    }
                    label="State"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                    }}
                  >
                    {stateOptions.map(state => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Zip */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  id="zip"
                  label="Zip Code"
                  value={newContactForm.zip}
                  onChange={e => handleNewContactChange('zip', e.target.value)}
                  InputLabelProps={{
                    sx: { color: 'white' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'center',
          pb: 2,
          '& > *': {
            width: isAddingNewContact ? '30%' : '40%',
            height: 50,
          },
        }}
      >
        {isAddingNewContact && (
          <Button
            onClick={() => setIsAddingNewContact(false)}
            variant="outlined"
            sx={{
              borderColor: '#888',
              color: '#888',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: '#aaa',
              },
            }}
          >
            Back
          </Button>
        )}

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
          disabled={isCreating}
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
          {isCreating ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
