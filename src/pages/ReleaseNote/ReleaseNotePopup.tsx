import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import DOMPurify from 'dompurify';
import { Close } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import releaseV1 from './ReleaseNoteJSON/releaseV1';
import { ListItem } from '@mui/material';

interface ContentDetail {
  content: string;
  type: 'text' | 'video' | 'image';
  src: string;
}

interface Section {
  title: { name: string; sx: string };
  details: ContentDetail[];
}

const sections: Section[] = releaseV1[0].sections as Section[];

const ReleaseNotePopup: React.FC<{
  open: boolean;
  setSlideshowOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setSlideshowOpen }) => {
  const [sectionIndex, setSectionIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const currentSection = sections[sectionIndex];

  const handleNext = () => {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 200);
    if (sectionIndex < sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
    }
  };

  const handlePrevious = () => {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 200);
    if (sectionIndex > 0) {
      setSectionIndex(sectionIndex - 1);
    }
  };

  const renderContent = () => {
    return (
      <Box sx={{ boxShadow: 'none' }}>
        {currentSection.details.map((detail, index) => {
          const youtubeRegex =
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
          const match = detail.src?.match(youtubeRegex);
          const youtubeEmbedUrl = match
            ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}`
            : '';

          const driveRegex =
            /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([^\/]+)/;
          const googleMatch = detail.src?.match(driveRegex);
          const driveEmbedUrl = googleMatch
            ? `https://drive.google.com/file/d/${googleMatch[1]}/preview`
            : '';

          const contentLines = detail.content?.split(/<br\s*\/?>/g) || [];

          return (
            <Box
              key={`detail-${index}`}
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                flexDirection: 'column',
                marginBottom: 2,
                textAlign: 'justify',
              }}
            >
              {detail.type === 'text' ? (
                <Card sx={{ marginBottom: 0, boxShadow: 'none' }}>
                  {contentLines.map((line, lineIndex) => (
                    <ListItem
                      key={`line-${index}-${lineIndex}`}
                      sx={{ alignItems: 'flex-start' }}
                    >
                      <Typography
                        sx={{
                          color: '#FFFF',
                          fontSize: '1.0rem',
                          textAlign: 'justify',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(line.trim()),
                        }}
                      />
                    </ListItem>
                  ))}
                </Card>
              ) : detail.type === 'video' ? (
                <>
                  {contentLines.map((line, lineIndex) => (
                    <ListItem
                      key={`line-${index}-${lineIndex}`}
                      sx={{ alignItems: 'flex-start' }}
                    >
                      <Typography
                        sx={{
                          color: '#FFFF',
                          fontSize: '1.0rem',
                          textAlign: 'justify',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(line.trim()),
                        }}
                      />
                    </ListItem>
                  ))}
                  <CardMedia
                    component="video"
                    src={youtubeEmbedUrl || driveEmbedUrl || detail.src}
                    sx={{
                      width: '100%',
                      height: isSmallScreen ? 200 : 400,
                    }}
                    muted
                    controls
                  />
                </>
              ) : detail.type === 'image' ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    textAlign: 'justify',
                  }}
                >
                  {contentLines.map((line, lineIndex) => (
                    <ListItem
                      key={`line-${index}-${lineIndex}`}
                      sx={{ alignItems: 'flex-start' }}
                    >
                      <Typography
                        sx={{
                          color: '#FFFF',
                          fontSize: '1.0rem',
                          textAlign: 'justify',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(line.trim()),
                        }}
                      />
                    </ListItem>
                  ))}
                  <CardMedia
                    component="img"
                    image={detail.src}
                    alt="Image"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              ) : null}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      fullWidth
      fullScreen={isSmallScreen}
      PaperProps={{
        sx: {
          maxWidth: isSmallScreen ? '100%' : 'none', // Ensure full width for mobile
          width: isSmallScreen ? '100%' : '80%',
          height: isSmallScreen ? '100%' : '80%',
          position: 'relative', // Enables absolute positioning inside the dialog
        },
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column', // Allows stacking elements vertically
          padding: 2,
          backgroundColor: 'background.paper', // Matches the dialog's background
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Optional shadow for separation
        }}
      >
        {sectionIndex === 0 && (
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#FFFF',
            }}
          >
            New Version Update details
          </Typography>
        )}
        <Typography
          variant="h5" // You can change this based on your preference
          sx={{
            textAlign: 'center',
            marginTop: 1, // Adds spacing between the two texts
            color: '#FFFF', // Adjust color if needed
          }}
        >
          {currentSection.title.name}
        </Typography>
        <IconButton
          onClick={() => setSlideshowOpen(false)}
          sx={{
            color: '#FFFF',
            position: 'absolute',
            top: isSmallScreen ? 40 : 8,
            right: isSmallScreen ? 0 : 8,
          }}
        >
          <Close />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          paddingBottom: '72px', // Leave space for buttons
          backgroundColor: 'background.paper', // Matches the dialog's default background
        }}
        ref={containerRef}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding={2}
          sx={{ paddingLeft: '0px' }}
        >
          <Card
            sx={{
              width: '100%',
              boxShadow: 'none',
              marginBottom: 3,
              borderRadius: 'none',
            }}
          >
            {renderContent()}
          </Card>
        </Box>
      </DialogContent>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          padding: 2,
          backgroundColor: 'background.paper', // Matches DialogContent background
        }}
      >
        <Button
          id="previous-button"
          variant="outlined"
          onClick={handlePrevious}
          disabled={sectionIndex === 0}
          sx={{
            margin: '5px',
            '&:disabled': {
              opacity: 0.2,
              cursor: 'not-allowed',
              backgroundColor: '#1997c6',
              color: '#fff',
            },
          }}
        >
          Previous
        </Button>
        <Button
          id="skip-button"
          variant="outlined"
          onClick={() => setSlideshowOpen(false)}
          sx={{
            margin: '5px',
          }}
        >
          Skip
        </Button>
        <Button
          id="next-button"
          variant="outlined"
          onClick={handleNext}
          disabled={sectionIndex === sections.length - 1}
          sx={{
            margin: '5px',
            '&:disabled': {
              opacity: 0.2,
              cursor: 'not-allowed',
              backgroundColor: '#1997c6',
              color: '#fff',
            },
          }}
        >
          Next
        </Button>
      </Box>
    </Dialog>
  );
};

export default ReleaseNotePopup;
