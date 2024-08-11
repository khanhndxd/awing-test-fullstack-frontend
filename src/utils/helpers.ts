export const isNumeric = (str: string): boolean => {
  return str.split("").every((char) => !isNaN(Number(char)) && char !== " ");
};
