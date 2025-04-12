import * as React from 'react';
import styled from '@mui/material/styles/styled';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Column, File, Props } from '../../interface/searchFile';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { phoneFormat } from '../../utils/GeneralUtil';
import {
  NameOrPhone,
  FileByNameOrPhoneColumn,
} from '../../interface/searchFileByNameOrPhone';
import { useTranslation } from 'react-i18next';
import CustomModel from '../../component/common/CustomModal';
import { useCreateDeedMutation } from '../../store/Services/deedService';
import { useAppDispatch } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import {
  createDeedConfirmation,
  deedBuyerAlert,
  deedContactAlert,
} from '../../utils/constants';
import Modal from '@mui/material/Modal';
import { Address, CourtAddressColumn } from '../../interface/searchCourts';
import Typography from '@mui/material/Typography';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#252830',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  borderRight: '1px solid rgba(224, 224, 224, 1)',
}));

const StyledTableRow = styled(TableRow)({
  color: 'black',
  '&:nth-of-type(odd)': {
    backgroundColor: '#F0F0F6',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
  },
  background: '#FFFFFF',
  '&:last-child td, &:last-child th': {
    borderRight: '1px solid rgba(224, 224, 224, 1)',
  },
});

const CustomizedTable: React.FC<Props> = ({
  id,
  data,
  count,
  setSortBy,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  sortBy,
  columns,
  setSortOrder,
  sortOrder,
  changePageLoading,
  setSortLoading,
  sortLoading,
}) => {
  const { t } = useTranslation('searchFileByNameOrPhone');
  const dispatch = useAppDispatch();
  const [createDeed] = useCreateDeedMutation();
  const { t: et } = useTranslation('errors');
  const [openModel, setOpenModel] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState<string>('');
  const [infoTitle, setInfoTitle] = React.useState<string>('');
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const [infoOpen, setInfoOpen] = React.useState(false);
  const handleInfoOpen = () => setInfoOpen(true);
  const handleInfoClose = () => setInfoOpen(false);
  const [selectedFileID, setSelectedFileID] = React.useState<number | null>(
    null
  );
  const [selectedContactID, setSelectedContactID] = React.useState<
    number | null
  >(null);
  const [isCreateDeedLoading, setIsCreateDeedLoading] = React.useState(false);
  const navigate = useNavigate();
  const handleSortClick = (column: string) => {
    setSortLoading(true);
    setSortBy(column);
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };
  const renderCellContent = (
    row: File | NameOrPhone | Address,
    column: Column | FileByNameOrPhoneColumn | CourtAddressColumn
  ) => {
    let { accessor } = column;
    if (accessor === 'phoneNo') {
      accessor = 'phone';
    }
    switch (accessor) {
      case 'fileName':
        return renderFileName(row);
      case 'contactName':
        return renderContactName(row);
      case 'returnDate':
        return renderReturnDate(row);
      case 'deedID':
        return renderDeedID(row);
      case 'name':
        return renderAddressName(row);
      case 'website':
        return renderCourtWebsite(row);
      case 'form':
        return renderCourtForm(row);
      case 'email':
        return renderCourtEmail(row);
      case 'phone':
        return renderPhoneNo(row);
      default:
        return row[accessor as keyof (File | NameOrPhone | Address)] ?? '';
    }
  };

  const renderPhoneNo = (row: File | NameOrPhone | Address) => {
    if ('phoneNo' in row) {
      return 'phoneNo' in row ? phoneFormat(row.phoneNo ?? '') : '';
    } else {
      return 'phone' in row ? phoneFormat(row.phone ?? '') : '';
    }
  };

  const renderFileName = (row: File | NameOrPhone | Address) => {
    return 'fileID' in row ? (
      <Link to={`/editfile/${(row as File).fileID}`} className="hover-link">
        {row.fileName}
      </Link>
    ) : (
      ''
    );
  };

  const renderAddressName = (row: File | NameOrPhone | Address) => {
    return 'name' in row ? (
      <Link
        to={`/editaddress/${row.addressID}`}
        state={{
          isEditView: true,
        }}
        className="hover-link"
      >
        {row.name}
      </Link>
    ) : (
      ''
    );
  };

  const renderCourtWebsite = (row: File | NameOrPhone | Address) => {
    return 'website' in row && row.website ? (
      <Link
        to={row.website}
        onClick={event => handleLinkClick(event, row.website)}
        className="hover-link"
      >
        {row.website}
      </Link>
    ) : (
      ''
    );
  };
  const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Function to handle link click and prevent default behavior
  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    url: string | null | undefined
  ) => {
    event.preventDefault();
    openInNewTab(url);
  };

  const renderCourtForm = (row: File | NameOrPhone | Address) => {
    return 'form' in row && row.form ? (
      <Link
        to={row.form}
        onClick={event => handleLinkClick(event, row.form)}
        className="hover-link"
      >
        Open Form
      </Link>
    ) : (
      ''
    );
  };

  const renderCourtEmail = (row: File | NameOrPhone | Address) => {
    return 'email' in row ? (
      <Link
        to={row.email ? `mailto:${row.email}` : ''}
        target="_blank"
        rel="noopener noreferrer"
        className="hover-link"
      >
        {row.email}
      </Link>
    ) : (
      ''
    );
  };

  const renderContactName = (row: File | NameOrPhone | Address) => {
    return 'contactID' in row && row.contactID ? (
      <Link to={`/editcontact/${row.contactID}`} className="hover-link">
        {row.contactName ? row.contactName : '-'}
      </Link>
    ) : (
      <Typography display="inline" sx={{ color: '#1997c6' }}>
        {'-'}
      </Typography>
    );
  };

  const renderReturnDate = (row: File | NameOrPhone | Address) => {
    return 'deedID' in row && row.deedID ? (
      <Link to={`/editdeed/${Number(row.deedID)}`} className="hover-link">
        {row.returnDate ? `${row.returnDate} - ${row.county}` : '-'}
      </Link>
    ) : (
      <Typography display="inline" sx={{ color: '#1997c6' }}>
        {'-'}
      </Typography>
    );
  };

  const renderDeedID = (row: File | NameOrPhone | Address) => {
    return 'contactID' in row ? (
      <Button
        onClick={() => handleDeedAlert(row)}
        sx={{
          color: '#1997c6',
          border: '1px solid #1997c6',
          '&:hover': {
            backgroundColor: '#1672a3',
            color: '#fff',
          },
        }}
      >
        {t('newDeedReturned')}
      </Button>
    ) : (
      ''
    );
  };

  const handleDeedAlert = (row: File | NameOrPhone) => {
    let modalTitle = '';
    setSelectedFileID(null);
    setSelectedContactID(null);
    handleClose();
    if ('buyer' in row && !row.buyer) {
      modalTitle = deedBuyerAlert;
    } else if ('contactID' in row && !row.contactID) {
      modalTitle = deedContactAlert;
    } else if ('contactID' in row && row.contactID) {
      setInfoOpen(false);
      setSelectedFileID(row.fileID);
      setSelectedContactID(row.contactID);
      setModalTitle(`${createDeedConfirmation} ${row.contactName}?`);
      handleOpen();
      return;
    }
    setInfoTitle(modalTitle);
    handleInfoOpen();
    return;
  };

  const handleCreateDeed = async () => {
    handleClose();
    if (selectedFileID && selectedContactID) {
      try {
        setIsCreateDeedLoading(true);
        const response = await createDeed({
          fileId: Number(selectedFileID),
          contactId: Number(selectedContactID),
        });
        if ('error' in response) {
          setIsCreateDeedLoading(false);
        }
        if ('data' in response && response.data.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setIsCreateDeedLoading(false);
          navigate(`/editdeed/${Number(response?.data?.data.deedId)}`);
        }
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: et('error'),
          })
        );
        setIsCreateDeedLoading(false);
      }
    }
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
          id={id}
        >
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <StyledTableCell key={index} align="left">
                  <TableSortLabel
                    active={sortBy === column.accessor.toString()}
                    direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                    id={column.accessor.toString()}
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '10pt',
                      '&:hover': {
                        color: 'white',
                      },
                      '&:focus': {
                        color: '#1997c6',
                      },
                    }}
                    onClick={() => handleSortClick(column.accessor.toString())}
                  >
                    {column.label}
                  </TableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortLoading || changePageLoading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={columns.length}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CircularProgress sx={{ color: 'black' }} />
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              <>
                {data.map((row, idx) => (
                  <StyledTableRow key={idx}>
                    {columns.map((column, index) => (
                      <StyledTableCell
                        id={column.accessor.toString() + idx}
                        key={index}
                        component="th"
                        scope="row"
                        sx={{ color: 'black' }}
                      >
                        {renderCellContent(row, column)}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{
          background: 'white',
          border: '1px solid rgba(224, 224, 224, 1)',
          color: 'black',
        }}
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <CustomModel
        open={infoOpen}
        handleClose={handleInfoClose}
        modalHeader="Info"
        modalTitle={infoTitle}
      />
      <CustomModel
        open={openModel}
        handleClose={handleClose}
        handleDelete={handleCreateDeed}
        modalHeader="Create Deed"
        modalTitle={modalTitle}
        modalButtonLabel="Yes"
      />
      {isCreateDeedLoading && (
        <Modal
          open={isCreateDeedLoading}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={25} color="inherit" />
        </Modal>
      )}
    </Paper>
  );
};

export default CustomizedTable;
