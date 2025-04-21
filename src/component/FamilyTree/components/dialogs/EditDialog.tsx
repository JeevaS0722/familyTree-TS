// src/component/FamilyTree/components/dialogs/EditDialog.tsx
import React, { useState, useEffect } from 'react';
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
  Switch,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { PersonData } from '../../types/familyTree';
import { Contact } from '../../types/familyTreeExtended';
import {
  contactToPersonData,
  determineGender,
} from '../../utils/contactMapper';

// This would be your real API service import
const useCreateContactMutation = () => {
  return [
    async (data: any) => {
      console.log('Creating contact with data:', data);
      // Mock API call
      return {
        unwrap: async () => ({
          success: true,
          data: {
            contactID: Math.floor(Math.random() * 10000),
            ...data,
          },
        }),
      };
    },
    { isLoading: false },
  ] as const;
};

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: PersonData, relationshipType: 'partner' | 'child') => void;
  parentMember?: PersonData | null;
  contactList?: Contact[];
  existingFamilyMembers?: PersonData[];
  refreshContacts?: () => Promise<Contact[]>;
  fileId?: string | number;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  onSave,
  parentMember,
  contactList = [],
  existingFamilyMembers = [],
  refreshContacts = async () => [],
  fileId,
}) => {
  // State for selected contact vs adding new contact
  const [tabValue, setTabValue] = useState(0);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // State for gender and relationship type
  const [gender, setGender] = useState<'M' | 'F' | ''>('M');
  const [relationshipType, setRelationshipType] = useState<
    'partner' | 'child' | null
  >(null);

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<{
    contact?: string;
    gender?: string;
    relationshipType?: string;
    firstName?: string;
    lastName?: string;
    ownership?: string;
  }>({});

  // State for new contact form
  const [newContactForm, setNewContactForm] = useState({
    relationship: '',
    ownership: '0',
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

  // RTK Query hook for creating contacts
  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setTabValue(0);
      setSelectedContact(null);
      setGender('M');
      setRelationshipType(null);
      setValidationErrors({});
      setNewContactForm({
        relationship: '',
        ownership: '0',
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

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const validateSelectContactInputs = (): boolean => {
    const errors: {
      contact?: string;
      gender?: string;
      relationshipType?: string;
    } = {};

    if (!selectedContact && tabValue === 0) {
      errors.contact = 'Please select a contact';
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
      lastName?: string;
      ownership?: string;
      relationshipType?: string;
    } = {};

    if (!newContactForm.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!newContactForm.lastName) {
      errors.lastName = 'Last name is required';
    }

    if (!newContactForm.ownership) {
      errors.ownership = 'Ownership is required';
    } else if (isNaN(parseFloat(newContactForm.ownership))) {
      errors.ownership = 'Ownership must be a valid number';
    }

    if (!relationshipType) {
      errors.relationshipType = 'Please select a relationship type';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form field changes
  const handleNewContactChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setNewContactForm(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for the field
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSaveExistingContact = async () => {
    if (!validateSelectContactInputs()) {
      return;
    }

    if (!relationshipType) {
      setValidationErrors(prev => ({
        ...prev,
        relationshipType: 'Please select a relationship type',
      }));
      return;
    }

    // Create a PersonData from the selected contact
    const personData = contactToPersonData(selectedContact!);

    // Override gender if manually changed
    if (gender !== personData.data.gender) {
      personData.data.gender = gender;
    }

    // Set fileId if provided
    if (fileId) {
      personData.data.fileId = Number(fileId);
    }

    // Set relationship data
    personData.data.relationshipType =
      relationshipType === 'partner' ? 'Partner' : 'Child';

    // Set parent-child relationship
    if (relationshipType === 'child' && parentMember) {
      // Child relationship
      if (parentMember.data.gender === 'M') {
        personData.rels.father = parentMember.id;
      } else if (parentMember.data.gender === 'F') {
        personData.rels.mother = parentMember.id;
      }
    } else if (relationshipType === 'partner' && parentMember) {
      // Partner relationship
      if (!personData.rels.spouses) {
        personData.rels.spouses = [];
      }
      personData.rels.spouses.push(parentMember.id);
    }

    onSave(personData, relationshipType);
  };

  const handleSaveNewContact = async () => {
    if (!validateNewContactInputs()) {
      return;
    }

    if (!relationshipType) {
      setValidationErrors(prev => ({
        ...prev,
        relationshipType: 'Please select a relationship type',
      }));
      return;
    }

    try {
      // Create contact data object
      const contactData = {
        fileID: Number(fileId),
        relationship:
          relationshipType === 'partner'
            ? 'Partner'
            : relationshipType === 'child'
              ? 'Child'
              : newContactForm.relationship,
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

      // Submit the new contact
      const response = await createContact(contactData).unwrap();

      if (response?.success && response?.data?.contactID) {
        const newContactId = response.data.contactID;

        // Refresh contacts if needed
        if (refreshContacts) {
          const updatedContacts = await refreshContacts();
          const createdContact = updatedContacts.find(
            c => c.contactID === newContactId
          );

          if (createdContact) {
            // Create a PersonData from the new contact
            const personData = contactToPersonData(createdContact);

            // Override gender if needed
            if (gender !== personData.data.gender) {
              personData.data.gender = gender;
            }

            // Set fileId if provided
            if (fileId) {
              personData.data.fileId = Number(fileId);
            }

            // Set relationship data
            personData.data.relationshipType =
              relationshipType === 'partner' ? 'Partner' : 'Child';

            // Set parent-child relationship
            if (relationshipType === 'child' && parentMember) {
              // Child relationship
              if (parentMember.data.gender === 'M') {
                personData.rels.father = parentMember.id;
              } else if (parentMember.data.gender === 'F') {
                personData.rels.mother = parentMember.id;
              }
            } else if (relationshipType === 'partner' && parentMember) {
              // Partner relationship
              if (!personData.rels.spouses) {
                personData.rels.spouses = [];
              }
              personData.rels.spouses.push(parentMember.id);
            }

            onSave(personData, relationshipType);
            return;
          }
        }

        // Fallback if refresh fails - create PersonData from form
        const personData: PersonData = {
          id: `contact-${newContactId}`,
          data: {
            gender,
            firstName: newContactForm.firstName,
            lastName: newContactForm.lastName,
            dOB: newContactForm.dOB || '',
            decDt: newContactForm.decDt || null,
            deceased: newContactForm.deceased || null,
            address: newContactForm.address || null,
            city: newContactForm.city || null,
            state: newContactForm.state || null,
            fileId: Number(fileId),
            contactId: newContactId,
            relationshipType:
              relationshipType === 'partner' ? 'Partner' : 'Child',
            divisionOfInterest: 'Interest',
            percentage: `${parseFloat(newContactForm.ownership || '0').toFixed(4)} %`,
          },
          rels: {
            father:
              relationshipType === 'child' && parentMember?.data.gender === 'M'
                ? parentMember.id
                : undefined,
            mother:
              relationshipType === 'child' && parentMember?.data.gender === 'F'
                ? parentMember.id
                : undefined,
            spouses:
              relationshipType === 'partner' && parentMember
                ? [parentMember.id]
                : [],
            children: [],
          },
        };

        onSave(personData, relationshipType);
      }
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  // Combined save handler
  const handleSave = () => {
    if (tabValue === 0) {
      void handleSaveExistingContact();
    } else {
      void handleSaveNewContact();
    }
  };

  // Relation type options
  const relationOptions = [
    'Partner',
    'Child',
    'Stepchild',
    'Sibling',
    'Parent',
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
  ];

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
      existingContactIds.delete(parentMember.data.contactId);
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: theme =>
            theme.palette.mode === 'dark' ? '#2C2C2C' : 'background.paper',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          bgcolor: theme =>
            theme.palette.mode === 'dark' ? '#1E1E1E' : 'primary.main',
          color: 'white',
        }}
      >
        {parentMember
          ? `Add Family Member for ${parentMember.data.firstName} ${parentMember.data.lastName}`
          : 'Add Family Member'}
      </DialogTitle>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="contact tabs"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Select Existing Contact" />
        <Tab label="Create New Contact" />
      </Tabs>

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        {tabValue === 0 ? (
          // EXISTING CONTACT SELECTION
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Contact Autocomplete */}
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
                  helperText={validationErrors.contact}
                />
              )}
              value={selectedContact}
              onChange={(_event, newValue) => {
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

            {/* Relationship Type */}
            <FormControl fullWidth error={!!validationErrors.relationshipType}>
              <InputLabel id="relationship-type-label">
                Relationship Type
              </InputLabel>
              <Select
                labelId="relationship-type-label"
                value={relationshipType || ''}
                onChange={e => {
                  setRelationshipType(e.target.value as 'partner' | 'child');
                  setValidationErrors(prev => ({
                    ...prev,
                    relationshipType: undefined,
                  }));
                }}
                label="Relationship Type"
              >
                <MenuItem value="partner">Partner</MenuItem>
                <MenuItem value="child">Child</MenuItem>
              </Select>
              {validationErrors.relationshipType && (
                <FormHelperText>
                  {validationErrors.relationshipType}
                </FormHelperText>
              )}
            </FormControl>

            {/* Gender */}
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                value={gender}
                onChange={e => setGender(e.target.value as 'M' | 'F' | '')}
                label="Gender"
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : (
          // NEW CONTACT FORM
          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name *"
                value={newContactForm.firstName}
                onChange={e =>
                  handleNewContactChange('firstName', e.target.value)
                }
                error={!!validationErrors.firstName}
                helperText={validationErrors.firstName}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name *"
                value={newContactForm.lastName}
                onChange={e =>
                  handleNewContactChange('lastName', e.target.value)
                }
                error={!!validationErrors.lastName}
                helperText={validationErrors.lastName}
              />
            </Grid>

            {/* Relationship Type */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={!!validationErrors.relationshipType}
              >
                <InputLabel id="relationship-type-new-label">
                  Relationship Type
                </InputLabel>
                <Select
                  labelId="relationship-type-new-label"
                  value={relationshipType || ''}
                  onChange={e => {
                    setRelationshipType(e.target.value as 'partner' | 'child');
                    setValidationErrors(prev => ({
                      ...prev,
                      relationshipType: undefined,
                    }));
                  }}
                  label="Relationship Type"
                >
                  <MenuItem value="partner">Partner</MenuItem>
                  <MenuItem value="child">Child</MenuItem>
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
                label="Ownership (%)"
                value={newContactForm.ownership}
                onChange={e =>
                  handleNewContactChange('ownership', e.target.value)
                }
                error={!!validationErrors.ownership}
                helperText={validationErrors.ownership}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-new-label">Gender</InputLabel>
                <Select
                  labelId="gender-new-label"
                  value={gender}
                  onChange={e => setGender(e.target.value as 'M' | 'F' | '')}
                  label="Gender"
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                value={newContactForm.dOB}
                onChange={e => handleNewContactChange('dOB', e.target.value)}
                placeholder="MM/DD/YYYY"
              />
            </Grid>

            {/* Deceased */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newContactForm.deceased}
                    onChange={e =>
                      handleNewContactChange('deceased', e.target.checked)
                    }
                  />
                }
                label="Deceased"
              />
            </Grid>

            {/* Date of Death */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Death"
                value={newContactForm.decDt}
                onChange={e => handleNewContactChange('decDt', e.target.value)}
                placeholder="MM/DD/YYYY"
                disabled={!newContactForm.deceased}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={newContactForm.address}
                onChange={e =>
                  handleNewContactChange('address', e.target.value)
                }
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={newContactForm.city}
                onChange={e => handleNewContactChange('city', e.target.value)}
              />
            </Grid>

            {/* State */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="state-label">State</InputLabel>
                <Select
                  labelId="state-label"
                  value={newContactForm.state}
                  onChange={e =>
                    handleNewContactChange('state', e.target.value)
                  }
                  label="State"
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
                label="Zip Code"
                value={newContactForm.zip}
                onChange={e => handleNewContactChange('zip', e.target.value)}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={isCreating}
          startIcon={isCreating ? <CircularProgress size={20} /> : null}
        >
          {isCreating ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
