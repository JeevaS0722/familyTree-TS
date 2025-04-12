import React from 'react';
import { GoalsSectionAdditionalProps } from '../../../../interface/draftDue';
import { SectionRenderer } from './goalsSection'; // We'll move this to the main file
import { Skeleton } from '@mui/material';

export const Offers: React.FC<GoalsSectionAdditionalProps> = ({
  data,
  columns,
  isGoalCountLoading,
  handleViewModeToggle,
  onCellValueChanged,
  onHeaderValueChange,
  renderBarChart,
  getTableRowBackgroundColor,
}) => {
  return isGoalCountLoading ? (
    <Skeleton variant="rectangular" width="100%" height={500} />
  ) : (
    <SectionRenderer
      section="offers"
      viewMode={data.offers.viewMode}
      data={data.offers.data}
      columns={columns}
      count={data.offers.data.length}
      initialLoading={false}
      loading={false}
      onCellValueChanged={onCellValueChanged}
      onHeaderValueChange={onHeaderValueChange}
      handleViewModeToggle={handleViewModeToggle}
      renderBarChart={renderBarChart}
      getTableRowBackgroundColor={getTableRowBackgroundColor}
    />
  );
};
