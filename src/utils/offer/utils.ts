import moment from 'moment';

const getInitialDueData = (fileColor: string, letterType?: string): string => {
  let dueDate = moment().add(10, 'd').format('YYYY-MM-DD');
  if (letterType === 'E-mail') {
    dueDate = moment().add(2, 'd').format('YYYY-MM-DD');
  } else if (fileColor === 'orange') {
    dueDate = moment().add(3, 'd').format('YYYY-MM-DD');
  }
  return dueDate;
};
const getPriority = (fileColor: string): string => {
  if (fileColor === 'white') {
    return 'Low';
  } else if (fileColor === 'green') {
    return 'Medium';
  } else if (fileColor === 'red') {
    return 'High';
  } else if (fileColor === 'yellow' || fileColor === 'orange') {
    return 'Urgent';
  }
  return 'Low';
};

export { getInitialDueData, getPriority };
