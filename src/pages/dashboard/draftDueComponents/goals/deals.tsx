/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { GoalsSectionAdditionalProps } from '../../../../interface/draftDue';
import { SectionRenderer } from './goalsSection';
import { Skeleton } from '@mui/material';

export const Deals: React.FC<GoalsSectionAdditionalProps> = ({
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
      section="deals"
      viewMode={data.deals.viewMode}
      data={data.deals.data}
      columns={columns}
      count={data.deals.data.length}
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
