export const date = function (date: Date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.getMonth().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
