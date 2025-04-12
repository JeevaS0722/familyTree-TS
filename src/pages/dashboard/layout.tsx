import React from 'react';
import { useGetDashboardLayoutQuery } from '../../store/Services/dashboardService';
import MetricsLayout from './metricsLayout';
import ActionsLayout from './actionsLayout';
const DraftDue = React.lazy(
  () =>
    import(
      /* webpackChunkName: "DraftDueDashboardLayout" */ '../dashboard/draftDueComponents/draftDueTable'
    )
);
const LayoutsPage: React.FC = () => {
  const { data, isLoading } = useGetDashboardLayoutQuery();

  if (!isLoading) {
    if (!data) {
      return <></>;
    }
  }

  return isLoading ? (
    <></>
  ) : (
    <>
      <MetricsLayout />
      <DraftDue />
      <ActionsLayout />
    </>
  );
};

export default LayoutsPage;
