import React from 'react';
import { useParams } from 'react-router-dom';
import EditFileForm from './EditFileForm';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useGetFileDetailsQuery } from '../../store/Services/fileService';
import OverlayLoader from '../../component/common/OverlayLoader';

const EditFile: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { data, isLoading, refetch } = useGetFileDetailsQuery(
    {
      fileid: Number(fileId),
    },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      {isLoading ? (
        <OverlayLoader open />
      ) : !data?.data?.file?.fileID ? (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h1>File not found</h1>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <EditFileForm
          initialValues={data?.data?.file}
          refetchFileData={refetch}
          loading={isLoading}
          fileId={fileId}
        />
      )}
    </Container>
  );
};

export default EditFile;
