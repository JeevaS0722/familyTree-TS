import React from 'react';
import DOMPurify from 'dompurify';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ListSubheader from '@mui/material/ListSubheader';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import releaseV1 from './ReleaseNoteJSON/releaseV1';
import { ReleaseNoteInterface } from '../../interface/common';

const releaseNotes: ReleaseNoteInterface[] = releaseV1;

const ReleaseNote: React.FC = () => {
  const [expanded, setExpanded] = React.useState<number | null>(null); // Track which accordion is expanded

  const handleExpand = (
    index: number,
    event:
      | React.MouseEvent<SVGSVGElement, MouseEvent>
      | React.SyntheticEvent<Element, Event>
  ) => {
    event.stopPropagation(); // Prevent the default onChange from triggering
    setExpanded(expanded === index ? null : index); // Toggle the accordion
  };

  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Release Notes
          </Typography>
          {releaseNotes.map((note: ReleaseNoteInterface, ind: number) => (
            <List key={ind}>
              <Accordion
                key={ind}
                expanded={expanded === ind}
                onChange={event => handleExpand(ind, event)}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: '#FFFF', // Change to your desired color
                      }}
                    />
                  }
                >
                  <Typography variant="h5" sx={{ color: '#FFFF' }}>
                    Version {note.version} - {note.release_date}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {expanded === ind &&
                    note.sections.length &&
                    note.sections.map((sel, i) => (
                      <React.Fragment key={`sel-${i}`}>
                        <Box sx={{ marginBottom: '25px' }}>
                          <ListSubheader
                            component="div"
                            sx={{
                              paddingLeft: '0px',
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2, // Space between icon and text
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                color: '#FFFF', // Customize text color
                                fontWeight: 'bold',
                                fontStyle: 'italic', // Makes the text italic
                                textDecoration: 'underline',
                              }}
                            >
                              {sel.title.name}
                            </Typography>
                          </ListSubheader>
                          {sel.details.map((detail, k) => {
                            if (detail.type === 'text') {
                              const contentLines =
                                detail.content?.split(/<br\s*\/?>/g) || [];
                              return contentLines.map((line, index) => (
                                <ListItem
                                  key={`line-${index}`}
                                  sx={{ pl: 4, alignItems: 'flex-start' }}
                                >
                                  <Typography
                                    sx={{
                                      color: '#FFFF', // Customize text color
                                      fontSize: '1.0rem', // Adjust text size
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(line.trim()),
                                    }}
                                  />
                                </ListItem>
                              ));
                            }

                            if (detail.type === 'image') {
                              const contentLines =
                                detail.content?.split(/<br\s*\/?>/g) || [];
                              const content = contentLines.map(
                                (line, index) => (
                                  <ListItem
                                    key={`line-${index}`}
                                    sx={{ alignItems: 'flex-start' }}
                                  >
                                    <Typography
                                      sx={{
                                        color: '#FFFF', // Customize text color
                                        fontSize: '1.0rem', // Adjust text size
                                      }}
                                      dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(line.trim()),
                                      }}
                                    />
                                  </ListItem>
                                )
                              );
                              return (
                                <ListItem key={`detail-image-${k}`}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'start',
                                      width: '100%',
                                    }}
                                  >
                                    {content}
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%', // Responsive width
                                        overflow: 'hidden', // Ensures no overflow from the media
                                        borderRadius: '8px', // Optional: Rounded corners
                                        height: {
                                          xs: '150px', // Small screens
                                          sm: '250px', // Medium screens
                                          md: '500px', // Larger screens
                                          lg: '600px', // Largest screens
                                        },
                                        '@media (aspect-ratio: 16/9)': {
                                          height: '56.25vw', // Maintain 16:9 aspect ratio
                                        },
                                        '@media (aspect-ratio: 4/3)': {
                                          height: '75vw', // Maintain 4:3 aspect ratio
                                        },
                                      }}
                                    >
                                      <img
                                        src={detail.src}
                                        alt={`Image detail ${k}`}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'contain',
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                </ListItem>
                              );
                            }

                            if (detail.type === 'video' && detail.src) {
                              // Check if the URL is a YouTube video
                              const youtubeRegex =
                                /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
                              const match = detail.src.match(youtubeRegex);
                              const youtubeEmbedUrl = match
                                ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}`
                                : '';

                              const driveRegex =
                                /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([^\/]+)/;
                              const googleMatch = detail.src.match(driveRegex);
                              const driveEmbedUrl = googleMatch
                                ? `https://drive.google.com/file/d/${googleMatch[1]}/preview`
                                : '';

                              const contentLines =
                                detail.content?.split(/<br\s*\/?>/g) || [];
                              const content = contentLines.map(
                                (line, index) => (
                                  <ListItem
                                    key={`line-${index}`}
                                    sx={{ alignItems: 'flex-start' }}
                                  >
                                    <Typography
                                      sx={{
                                        color: '#FFFF', // Customize text color
                                        fontSize: '1.0rem', // Adjust text size
                                      }}
                                      dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(line.trim()),
                                      }}
                                    />
                                  </ListItem>
                                )
                              );
                              return (
                                <ListItem
                                  key={`detail-video-${k}`}
                                  sx={{ pl: 2 }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'start',
                                      width: '100%',
                                    }}
                                  >
                                    {content}
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%',
                                        overflow: 'hidden',
                                        borderRadius: '8px',
                                        height: {
                                          xs: '150px',
                                          sm: '300px',
                                          md: '500px',
                                          lg: '600px',
                                        },
                                        '@media (aspect-ratio: 16/9)': {
                                          height: '56.25vw',
                                        },
                                        '@media (aspect-ratio: 4/3)': {
                                          height: '75vw',
                                        },
                                      }}
                                    >
                                      {youtubeEmbedUrl ? (
                                        <iframe
                                          src={youtubeEmbedUrl}
                                          frameBorder="0"
                                          allow="autoplay; encrypted-media"
                                          allowFullScreen
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '8px', // Optional: Rounded corners
                                          }}
                                          title={`YouTube video ${k}`}
                                        />
                                      ) : driveEmbedUrl ? (
                                        <iframe
                                          src={driveEmbedUrl}
                                          frameBorder="0"
                                          allow="autoplay; encrypted-media"
                                          allowFullScreen
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '8px', // Optional: Rounded corners
                                          }}
                                          title={`YouTube video ${k}`}
                                        />
                                      ) : (
                                        <video
                                          src={detail.src}
                                          controls
                                          muted
                                          loop
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain', // Ensures the video fills the Box while maintaining aspect ratio
                                            borderRadius: '8px', // Optional: Rounded corners
                                          }}
                                        >
                                          Your browser does not support the
                                          video tag.
                                        </video>
                                      )}
                                    </Box>
                                  </Box>
                                </ListItem>
                              );
                            }
                            return null;
                          })}
                        </Box>
                      </React.Fragment>
                    ))}
                </AccordionDetails>
              </Accordion>
            </List>
          ))}
        </Box>
      </Stack>
    </Container>
  );
};

export default ReleaseNote;
