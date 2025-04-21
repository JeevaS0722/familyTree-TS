/* eslint-disable max-depth */
/* eslint-disable complexity */
// src/components/FamilyTree/components/EditDialog.tsx - Updated with fileId and contactId
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
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { FamilyMember } from '../types';
import { Contact } from '../contactToFamilyMapper';
import { useCreateContactMutation } from '../../../../store/Services/contactService';

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: FamilyMember, relationshipType: 'partner' | 'child') => void;
  parentMember?: FamilyMember | null;
  contactList?: Contact[];
  existingFamilyMembers?: FamilyMember[];
  refreshContacts?: () => Promise<Contact[]>;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  onSave,
  parentMember,
  contactList = [],
  existingFamilyMembers = [],
  refreshContacts = async () => [],
}) => {
  // Get fileId from URL params
  const { fileId } = useParams<{ fileId: string }>();

  // RTK Query hook for creating contacts
  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();

  // State for selected contact vs adding new contact
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingNewContact, setIsAddingNewContact] = useState(false);

  // State for gender and relationship type
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(
    null
  );
  const [relationshipType, setRelationshipType] = useState<
    'partner' | 'child' | null
  >(null);

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<{
    contact?: string;
    gender?: string;
    relationshipType?: string;
    firstName?: string;
    ownership?: string;
  }>({});

  // State for new contact form
  const [newContactForm, setNewContactForm] = useState({
    relationship: '',
    ownership: '',
    lastName: '',
    firstName: '',
    deceased: false,
    decDt: '',
    dOB: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedContact(null);
      setGender(null);
      setRelationshipType(null);
      setValidationErrors({});
      setIsAddingNewContact(false);
      setNewContactForm({
        relationship: '',
        ownership: '',
        lastName: '',
        firstName: '',
        deceased: false,
        decDt: '',
        dOB: '',
        address: '',
        city: '',
        state: '',
        zip: '',
      });
    }
  }, [open]);

  const validateSelectContactInputs = (): boolean => {
    const errors: {
      contact?: string;
      gender?: string;
      relationshipType?: string;
    } = {};

    if (!selectedContact && !isAddingNewContact) {
      errors.contact = 'Please select a contact';
    }

    if (!gender) {
      errors.gender = 'Please select a gender';
    }

    if (!relationshipType) {
      errors.relationshipType = 'Please select a relationship type';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateNewContactInputs = (): boolean => {
    const errors: {
      firstName?: string;
      ownership?: string;
      gender?: string;
      relationshipType?: string;
    } = {};

    if (!newContactForm.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!newContactForm.ownership) {
      errors.ownership = 'Ownership is required';
    } else if (isNaN(parseFloat(newContactForm.ownership))) {
      errors.ownership = 'Ownership must be a valid number';
    }

    if (!gender) {
      errors.gender = 'Please select a gender';
    }

    if (!relationshipType || !newContactForm.relationship) {
      errors.relationshipType = 'Please select a relationship type';
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

  const handleSaveExistingContact = async () => {
    if (!validateSelectContactInputs()) {
      return;
    }

    // Check if the contact has any tasks/notes
    const hasNotes =
      Array.isArray(selectedContact?.TasksModels) &&
      selectedContact?.TasksModels.length > 0;

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
      divisionOfInterest: 'Interest',
      percentage: `${parseFloat(selectedContact!.ownership).toFixed(4)} %`,
      relationshipType: relationshipType === 'partner' ? 'Partner' : 'Child',
      children: [],
      parentId: relationshipType === 'child' ? parentMember?.id : undefined,
      isPartnerOf:
        relationshipType === 'partner' ? parentMember?.id : undefined,
      // Add fileId and contactId
      fileId: fileId ? Number(fileId) : undefined,
      contactId: selectedContact!.contactID,
      // Add isNewNotes property
      isNewNotes: hasNotes,
      // Keep reference to original contact data
      originalContact: selectedContact,
    };

    onSave(newMember, relationshipType!);
  };

  const handleSaveNewContact = async () => {
    if (!validateNewContactInputs()) {
      return;
    }

    try {
      // Create contact data object
      const contactData = {
        fileID: Number(fileId),
        relationship: newContactForm.relationship,
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

              const newMember: FamilyMember = {
                id: `contact-${newContactId}`,
                name:
                  `${createdContact.firstName || ''} ${createdContact.lastName || ''}`.trim() ||
                  'New Contact',
                gender: gender as 'male' | 'female' | 'other',
                age: createdContact.dOB
                  ? calculateAge(createdContact.dOB)
                  : '00',
                birthDate: createdContact.dOB || '00/00/00',
                deathDate: createdContact.decDt || '00/00/00',
                address: [
                  createdContact.address,
                  createdContact.city,
                  createdContact.state,
                  createdContact.zip,
                ]
                  .filter(Boolean)
                  .join(', '),
                isDeceased: createdContact.deceased,
                divisionOfInterest: 'Interest',
                percentage: `${parseFloat(createdContact.ownership || '0').toFixed(4)} %`,
                relationshipType:
                  relationshipType === 'partner' ? 'Partner' : 'Child',
                children: [],
                parentId:
                  relationshipType === 'child' ? parentMember?.id : undefined,
                isPartnerOf:
                  relationshipType === 'partner' ? parentMember?.id : undefined,
                // Add fileId and contactId
                fileId: Number(fileId),
                contactId: newContactId,
                // Add isNewNotes property
                isNewNotes: hasNotes,
                originalContact: createdContact,
              };

              console.log('Created family member to be saved:', newMember);
              console.log(
                'Calling onSave with relationship type:',
                relationshipType
              );
              onSave(newMember, relationshipType);
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
        const newMember: FamilyMember = {
          id: `contact-${newContactId}`,
          name: `${newContactForm.firstName || ''} ${newContactForm.lastName || ''}`.trim(),
          gender: gender as 'male' | 'female' | 'other',
          age: newContactForm.dOB ? calculateAge(newContactForm.dOB) : '00',
          birthDate: newContactForm.dOB || '00/00/00',
          deathDate: newContactForm.decDt || '00/00/00',
          address: [
            newContactForm.address,
            newContactForm.city,
            newContactForm.state,
            newContactForm.zip,
          ]
            .filter(Boolean)
            .join(', '),
          isDeceased: newContactForm.deceased,
          divisionOfInterest: 'Interest',
          percentage: `${parseFloat(newContactForm.ownership || '0').toFixed(4)} %`,
          relationshipType:
            relationshipType === 'partner' ? 'Partner' : 'Child',
          children: [],
          parentId: relationshipType === 'child' ? parentMember?.id : undefined,
          isPartnerOf:
            relationshipType === 'partner' ? parentMember?.id : undefined,
          // Add fileId and contactId
          fileId: Number(fileId),
          contactId: newContactId,
          // New contacts typically won't have notes yet
          isNewNotes: false,
          // No originalContact reference since we don't have the full API response
        };

        console.log('Created family member from form data:', newMember);
        onSave(newMember, relationshipType);
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

  // Relation options
  const relationOptions = [
    'Child',
    'Partner',
    'Stepchild',
    'Niece',
    'Nephew',
    'Foster Child',
    'Parent',
    'Sibling',
    'Cousin',
    'Other',
  ];

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

    return isAddingNewContact
      ? `Add New Contact for ${parentMember.name}`
      : `Add Family Member for ${parentMember.name}`;
  };

  // Filter out contacts that are already in the family tree
  const filteredContacts = React.useMemo(() => {
    // Extract contact IDs that are already in the family tree
    const existingContactIds = new Set(
      existingFamilyMembers
        .filter(member => member.originalContact)
        .map(member => (member.originalContact as Contact).contactID)
    );

    // Don't filter out the parent member itself
    if (parentMember?.originalContact) {
      existingContactIds.delete(
        (parentMember.originalContact as Contact).contactID
      );
    }

    // Filter the contact list
    return contactList.filter(
      contact => !existingContactIds.has(contact.contactID)
    );
  }, [contactList, existingFamilyMembers, parentMember]);

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
                    // Automatically set gender based on contact relationship
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
                <InputLabel id="relation-label" sx={{ color: 'white' }}>
                  Relation *
                </InputLabel>
                <Select
                  labelId="relation-label"
                  id="relation"
                  value={relationshipType}
                  onChange={e => {
                    setRelationshipType(e.target.value as 'partner' | 'child');
                    setValidationErrors(prev => ({
                      ...prev,
                      relationshipType: undefined,
                    }));
                  }}
                  label="Relation"
                  error={!!validationErrors.relationshipType}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: validationErrors.relationshipType
                        ? '#f44336'
                        : 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: validationErrors.relationshipType
                        ? '#f44336'
                        : 'white',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: validationErrors.relationshipType
                        ? '#f44336'
                        : 'white',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
                  <MenuItem value="partner">Partner</MenuItem>
                  <MenuItem value="child">Child</MenuItem>
                  <MenuItem value="stepchild">Stepchild</MenuItem>
                  <MenuItem value="niece">Niece</MenuItem>
                  <MenuItem value="nephew">Nephew</MenuItem>
                  <MenuItem value="foster">Foster Child</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              {validationErrors.relationshipType && (
                <FormHelperText error sx={{ textAlign: 'center' }}>
                  {validationErrors.relationshipType}
                </FormHelperText>
              )}
            </Box>

            {/* Gender Dropdown - Third Row */}
            <Box>
              <FormControl fullWidth>
                <InputLabel id="gender-label" sx={{ color: 'white' }}>
                  Gender *
                </InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  value={gender || ''}
                  onChange={e => {
                    setGender(e.target.value as 'male' | 'female' | 'other');
                    setValidationErrors(prev => ({
                      ...prev,
                      gender: undefined,
                    }));
                  }}
                  label="Gender"
                  error={!!validationErrors.gender}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: validationErrors.gender
                        ? '#f44336'
                        : 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: validationErrors.gender
                        ? '#f44336'
                        : 'white',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: validationErrors.gender
                        ? '#f44336'
                        : 'white',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              {validationErrors.gender && (
                <FormHelperText error sx={{ textAlign: 'center' }}>
                  {validationErrors.gender}
                </FormHelperText>
              )}
            </Box>
          </Box>
        ) : (
          // ADD NEW CONTACT MODE - Content omitted for brevity
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              {/* Form fields for adding new contact - content omitted for brevity */}
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
                <FormControl
                  fullWidth
                  error={!!validationErrors.relationshipType}
                >
                  <InputLabel id="relation-label" sx={{ color: 'white' }}>
                    Relation *
                  </InputLabel>
                  <Select
                    labelId="relation-label"
                    id="relation"
                    value={newContactForm.relationship}
                    onChange={e => {
                      handleNewContactChange('relationship', e.target.value);
                      // Set the relationshipType based on the selection
                      if (e.target.value === 'Partner') {
                        setRelationshipType('partner');
                      } else {
                        setRelationshipType('child');
                      }
                      setValidationErrors(prev => ({
                        ...prev,
                        relationshipType: undefined,
                      }));
                    }}
                    label="Relation *"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: validationErrors.relationshipType
                          ? '#f44336'
                          : 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: validationErrors.relationshipType
                          ? '#f44336'
                          : 'white',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: validationErrors.relationshipType
                          ? '#f44336'
                          : 'white',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                    }}
                  >
                    {relationOptions.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.relationshipType && (
                    <FormHelperText>
                      {validationErrors.relationshipType}
                    </FormHelperText>
                  )}
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

              {/* Gender Dropdown */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!validationErrors.gender}>
                  <InputLabel id="gender-label" sx={{ color: 'white' }}>
                    Gender *
                  </InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender-select"
                    value={gender || ''}
                    onChange={e => {
                      setGender(e.target.value as 'male' | 'female' | 'other');
                      setValidationErrors(prev => ({
                        ...prev,
                        gender: undefined,
                      }));
                    }}
                    label="Gender *"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: validationErrors.gender
                          ? '#f44336'
                          : 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: validationErrors.gender
                          ? '#f44336'
                          : 'white',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: validationErrors.gender
                          ? '#f44336'
                          : 'white',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                    }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {validationErrors.gender && (
                    <FormHelperText>{validationErrors.gender}</FormHelperText>
                  )}
                </FormControl>
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
