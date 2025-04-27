import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import TitleFailureSection from './draftDue/titleFailureSection';

const DraftDueSection = React.lazy(
  () =>
    import(
      /* webpackChunkName: "draftDueSectionDashboard" */ './draftDue/draftDueSection'
    )
);
const GoalsSection = React.lazy(
  () =>
    import(
      /* webpackChunkName: "goalsSectionDashboard" */ './goals/goalsSection'
    )
);

const DraftDueTable: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [active, setActive] = useState<number>(0);
  const handleChange = (index: number) => setActive(index);

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {isMobile || isTablet ? (
        // Mobile and tablet layout - stacked
        <Grid
          container
          spacing={2}
          sx={{ marginTop: '0px' }}
          justifyContent={'center'}
        >
          <GoalsSection
            active={active}
            handleChange={handleChange}
            isMobileOrTablet={true}
          />
          <Grid item xs={12}>
            {active === 0 && <DraftDueSection />}
            {active === 1 && <GoalsSection section="newWells" />}
            {active === 2 && <GoalsSection section="offers" />}
            {active === 3 && <GoalsSection section="deals" />}
            {active === 4 && <TitleFailureSection />}
          </Grid>
        </Grid>
      ) : (
        // Desktop layout - side by side
        <Grid
          container
          spacing={2}
          sx={{
            marginTop: '0px',
            alignItems: 'flex-start', // Align items to the top
          }}
        >
          {/* Left side - Draft Due Section */}
          <Grid item xs={12} md={8} sx={{ paddingTop: '0px' }}>
            <DraftDueSection />
          </Grid>

          {/* Right side - Goals Section */}
          <Grid item xs={12} md={4} sx={{ paddingTop: '0px' }}>
            <GoalsSection
              active={active}
              handleChange={handleChange}
              isMobileOrTablet={false}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default DraftDueTable;
