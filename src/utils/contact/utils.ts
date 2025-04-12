/**
 * Concatenates the first name and last name to form a full name.
 *
 * @param firstName - The first name to be concatenated.
 * @param lastName - The last name to be concatenated.
 * @returns The concatenated full name or an empty string if both first name and last name are missing.
 */
export const concatContactName = (
  firstName?: string | null,
  lastName?: string | null
): string => {
  if (firstName && lastName) {
    return lastName + ' ' + firstName;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  }
  return '';
};

export const departmentMap: { [key: string]: string } = {
  BuyerResearch: 'Research',
};
