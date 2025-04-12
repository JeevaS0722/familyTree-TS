import React from 'react';
import { GoalsSectionAdditionalProps } from '../../../../interface/draftDue';
import { SectionRenderer } from './goalsSection';
import { Skeleton } from '@mui/material';

export const NewWells: React.FC<GoalsSectionAdditionalProps> = ({
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
      section="newWells"
      viewMode={data.newWells.viewMode}
      data={data.newWells.data}
      columns={columns}
      count={data.newWells.data.length}
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
