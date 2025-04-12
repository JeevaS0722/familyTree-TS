const getTableRowBackgroundColor = (row: {
  [key: string]: string | number | number[] | null | boolean | undefined;
}): string => {
  const rows = row as { origin: string; totalFileValue: string };
  if (rows.origin === 'Tax Sale') {
    return '#FFA500';
  }
  if (
    Number(rows.totalFileValue.replace(/[$,]/g, '')) >= 10000 &&
    Number(rows.totalFileValue.replace(/[$,]/g, '')) < 50000
  ) {
    return '#9BC53D';
  }
  if (
    Number(rows.totalFileValue.replace(/[$,]/g, '')) >= 50000 &&
    Number(rows.totalFileValue.replace(/[$,]/g, '')) < 100000
  ) {
    return '#E55934';
  }
  if (Number(rows.totalFileValue.replace(/[$,]/g, '')) >= 100000) {
    return '#FDE74C';
  }
  return 'white';
};

const getFileColor = (row: {
  [key: string]: string | number | number[] | null | boolean | undefined;
}): string => {
  const rows = row as { origin: string; totalFileValue: string };
  if (rows.origin === 'Tax Sale') {
    return 'orange';
  }
  if (
    Number(rows.totalFileValue.replace(/[$,]/g, '')) >= 10000 &&
    Number(rows.totalFileValue.replace(/[$,]/g, '')) < 50000
  ) {
    return 'green';
  }
  if (
    Number(rows.totalFileValue.replace(/[$,]/g, '')) >= 50000 &&
    Number(rows.totalFileValue.replace(/[$,]/g, '')) < 100000
  ) {
    return 'red';
  }
  if (Number(rows.totalFileValue.replace(/[$,]/g, '')) >= 100000) {
    return 'yellow';
  }
  return 'white';
};

export { getTableRowBackgroundColor, getFileColor };
