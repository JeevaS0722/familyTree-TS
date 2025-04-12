import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import React from 'react';
import { ContactProps, ContactTableData } from '../../interface/contact';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Link, useNavigate } from 'react-router-dom';
import { Field } from 'formik';
import { toggleSelectedContact } from '../../store/Reducers/selectContactReducer';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import DOMPurify from 'dompurify';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#252830',
    color: 'white',
    padding: '8px 16px',
    border: '1px solid #C0C0C0',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: 'white',
    padding: '6px 12px',
    border: '1px solid #C0C0C0',
  },
  border: '1px solid #C0C0C0',
}));

const StyledTableRow = styled(TableRow)({
  color: 'white',
  '&:nth-of-type(odd)': {
    backgroundColor: '#434857',
    border: '1px solid #C0C0C0',
  },
  background: '#252830',
  '&:last-child td, &:last-child th': {
    border: '1px solid #C0C0C0',
  },
});

const ContactsTable: React.FC<ContactProps> = ({
  data,
  columns,
  setSortBy,
  sortBy,
  setSortOrder,
  sortOrder,
  setSortLoading,
  sortLoading,
  mainContactId,
  setMainContactId,
}) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    // Find the first contact that has `main` set to true
    const mainContact = data.find(contact => contact.main === true);
    if (mainContact) {
      setMainContactId(mainContact.contactId);
    } else {
      setMainContactId(null);
    }
  }, [data, setMainContactId]);
  const handleSortClick = (column: string) => {
    setSortLoading(true);
    setSortBy(column);
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleEditContactNavigation = (contactId: number) => {
    navigate(`/editcontact/${Number(contactId)}`);
  };
  const handleEditDeedNavigation = (deedId: number) => {
    navigate(`/editdeed/${Number(deedId)}`);
  };
  const selectedContacts = useAppSelector(
    state => state.selectedContacts.selectedContacts
  );
  const dispatch = useAppDispatch();

  const handleCheckboxChange = (contactId: number) => {
    dispatch(toggleSelectedContact(contactId));
  };

  const getVisitValue = (row: ContactTableData): string => {
    const visit = row['visit'];
    const notInterested = row['dNC'];
    const ticklerDt = row['ticklered'] as string;
    if (ticklerDt) {
      return 'Ticklered for ' + ticklerDt;
    } else if (visit && !notInterested) {
      return 'Visit';
    } else if (notInterested) {
      return 'Not Interested';
    } else {
      return '';
    }
  };
  const handleMainCheckboxChange = (contactId: number) => {
    setMainContactId(mainContactId === contactId ? null : contactId);
  };

  return (
    <Paper
      sx={{
        width: '100%',
        mb: 1,
        border: 1,
        borderColor: 'white',
        borderRadius: '1px',
      }}
    >
      <TableContainer
        sx={{
          maxHeight: 'calc(100vh - 310px)',
          height: 'auto',
          backgroundColor: 'white',
          overflow: 'auto',
        }}
      >
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <StyledTableCell key={index} align="center">
                  <TableSortLabel
                    active={sortBy.includes(column.accessor.toString())}
                    direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                    sx={{
                      fontSize: '10pt',
                      '&:hover': {
                        color: 'white',
                      },
                      '&:focus': {
                        color: '#1997c6',
                      },
                    }}
                    onClick={() =>
                      column.sortable &&
                      handleSortClick(column.accessor.toString())
                    }
                  >
                    {column.label}
                  </TableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <StyledTableRow key={row.contactId} id={`${row.contactId}`}>
                {columns.map((column, index) => (
                  <StyledTableCell key={index} component="th" scope="row">
                    {column.accessor === 'visit' ? (
                      <Typography
                        id={`${column.accessor}-${row.contactId}`}
                        component={'span'}
                        display={'inline'}
                        sx={{
                          textDecoration: 'none',
                          color: '#FF0000',
                        }}
                      >
                        {getVisitValue(row)}
                      </Typography>
                    ) : column.accessor === 'firstName' ? (
                      <Link
                        to={`/editcontact/${row.contactId}`}
                        id={`${column.accessor}-${row.contactId}`}
                        className="hover-link text-decoration-none"
                      >
                        {row[column.accessor]}
                      </Link>
                    ) : column.accessor === 'returnDate' ? (
                      row.deedId ? (
                        <Link
                          to={`/editdeed/${Number(row.deedId)}`}
                          id={`${column.accessor}-${row.deedId}`}
                          className="hover-link-red text-decoration-none"
                        >
                          {row[column.accessor] || '-'}
                        </Link>
                      ) : (
                        <span></span>
                      )
                    ) : column.accessor === 'select' && !row.deceased ? (
                      <Field
                        name="select"
                        inputProps={{
                          id: 'select',
                        }}
                        type="checkbox"
                        as={Checkbox}
                        checked={selectedContacts.includes(row.contactId)}
                        onChange={() => handleCheckboxChange(row.contactId)}
                        sx={{
                          color: 'white',
                          padding: 0,
                        }}
                        size="small"
                        color="info"
                      />
                    ) : column.accessor === 'main' ? (
                      <Checkbox
                        checked={mainContactId === row.contactId}
                        onChange={() => handleMainCheckboxChange(row.contactId)}
                        disabled={
                          mainContactId !== null &&
                          mainContactId !== row.contactId
                        }
                        name="main"
                        sx={{
                          color: 'white',
                          padding: 0,
                          '&.Mui-disabled': {
                            color: 'gray',
                          },
                        }}
                        size="small"
                        color="info"
                      />
                    ) : column.accessor === 'relationship' ||
                      column.accessor === 'address' ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(row[column.accessor]),
                        }}
                      />
                    ) : (
                      row[column.accessor]
                    )}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {sortLoading && <LinearProgress />}
    </Paper>
  );
};

export default ContactsTable;
