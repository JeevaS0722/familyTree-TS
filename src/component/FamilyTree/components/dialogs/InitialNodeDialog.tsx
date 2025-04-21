// src/component/FamilyTree/components/dialogs/InitialNodeDialog.tsx
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { PersonData } from '../../types/familyTree';
import { Contact } from '../../types/familyTreeExtended';
import {
  contactToPersonData,
  determineGender,
} from '../../utils/contactMapper';

interface InitialNodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: PersonData) => void;
  isFirstNode?: boolean;
  contactList?: Contact[];
  fileId?: string | number;
}

const InitialNodeDialog: React.FC<InitialNodeDialogProps> = ({
  open,
  onClose,
  onSave,
  isFirstNode = false,
  contactList = [],
  fileId,
}) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [gender, setGender] = useState<'M' | 'F' | '' | null>(null);
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

  const handleContactChange = (
    _event: React.SyntheticEvent,
    newValue: Contact | null
  ) => {
    setSelectedContact(newValue);

    // Automatically set gender based on contact relationship
    if (newValue) {
      setGender(determineGender(newValue));
      setValidationErrors(prev => ({
        ...prev,
        contact: undefined,
      }));
    }
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value as 'M' | 'F' | '');
    setValidationErrors(prev => ({
      ...prev,
      gender: undefined,
    }));
  };

  const handleSave = () => {
    if (!validateInputs()) {
      return;
    }

    // Create a PersonData from the selected contact
    const personData = contactToPersonData(selectedContact!);

    // Override gender if manually changed
    if (gender !== determineGender(selectedContact!)) {
      personData.data.gender = gender!;
    }

    // Set relationshipType
    personData.data.relationshipType = isFirstNode
      ? 'Primary Root'
      : 'Primary File';

    // Set fileId if provided
    if (fileId) {
      personData.data.fileId = Number(fileId);
    }

    // Set as main node
    personData.main = true;

    onSave(personData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
                  helperText={validationErrors.contact}
                />
              )}
              value={selectedContact}
              onChange={handleContactChange}
              isOptionEqualToValue={(option, value) =>
                option.contactID === value.contactID
              }
            />
          </Box>

          {/* Gender Selection */}
          <FormControl error={!!validationErrors.gender}>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              row
              name="gender"
              value={gender || ''}
              onChange={handleGenderChange}
            >
              <FormControlLabel value="M" control={<Radio />} label="Male" />
              <FormControlLabel value="F" control={<Radio />} label="Female" />
              <FormControlLabel value="" control={<Radio />} label="Other" />
            </RadioGroup>
            {validationErrors.gender && (
              <FormHelperText error>{validationErrors.gender}</FormHelperText>
            )}
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ width: '40%', height: 50 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{ width: '40%', height: 50 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InitialNodeDialog;
