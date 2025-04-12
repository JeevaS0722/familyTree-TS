/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState, ReactElement, useRef } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useLocation, useNavigate, Link } from 'react-router-dom';

interface MultiLineTabsProps {
  children: ReactElement[];
  onTabChange?: (tabId: string) => void;
}

const MultiLineTabs: React.FC<MultiLineTabsProps> = ({
  children,
  onTabChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const currentTabFromUrl = query.get('tab');
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  // Initialize state based on URL or fallback to the first child's label
  const [activeTab, setActiveTab] = useState<string>(
    currentTabFromUrl || children[0].props.id
  );

  // Handle changes in the active tab
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    // Update the URL only if different from the current tab to prevent unnecessary navigation
    if (newValue !== activeTab) {
      navigate(`?tab=${newValue}`, { replace: true });
      setActiveTab(newValue);
      if (onTabChange) {
        onTabChange(newValue);
      }
    }
  };

  // Scroll the active tab into view
  useEffect(() => {
    if (tabRefs?.current && currentTabFromUrl) {
      const activeTabIndex = children.findIndex(
        child => child.props.id === activeTab
      );
      const activeTabRef = tabRefs.current[activeTabIndex];
      if (activeTabRef) {
        setTimeout(() => {
          activeTabRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [tabRefs]);

  // Update state when URL changes externally
  useEffect(() => {
    if (currentTabFromUrl && currentTabFromUrl !== activeTab) {
      setActiveTab(currentTabFromUrl);
      navigate(`?tab=${currentTabFromUrl}`, { replace: true });
    } else if (!currentTabFromUrl) {
      const defaultTab = children[0].props.id || 'Item 1';
      setActiveTab(defaultTab);
      // navigate(`?tab=${defaultTab}`, { replace: true });
    }
  }, [location.search]);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant="standard"
        scrollButtons={false}
        TabIndicatorProps={{ sx: { display: 'none' } }}
        sx={{
          '& .MuiTabs-flexContainer': {
            flexWrap: 'wrap',
          },
          '.MuiTab-root': {
            textTransform: 'capitalize',
            fontSize: '13px',
            color: 'white',
            '&.Mui-selected': {
              color: '#1997c6',
              borderBottom: '4px solid #1997c6',
            },
          },
        }}
      >
        {children.map((child, index) => {
          const tabId = child.props.id || `Item ${index + 1}`;
          return (
            <Tab
              key={index}
              label={child.props.label || `Item ${index + 1}`}
              value={tabId}
              ref={el => (tabRefs.current[index] = el)}
              id={child.props.tabId ? child.props.tabId : `${tabId}-tab`}
              className="hover-tab"
              sx={{
                '&:hover': {
                  textDecoration: 'none !important',
                },
              }}
              component={Link}
              to={`?tab=${tabId}`}
              onClick={e => {
                e.preventDefault();
                handleChange(e, tabId);
              }}
            />
          );
        })}
      </Tabs>
      <Box sx={{ marginTop: 2 }}>
        {children.map((child, index) => (
          <div
            key={index}
            hidden={activeTab !== (child.props.id || `Item ${index + 1}`)}
          >
            {activeTab === (child.props.id || `Item ${index + 1}`)
              ? child
              : null}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default MultiLineTabs;
