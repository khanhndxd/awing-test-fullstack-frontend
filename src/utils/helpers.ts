import { DEFAULT_RESULT_MESSSAGE } from "../components/input/enums";
import { ResultDisplayData } from "../types";

export const isNumeric = (str: string): boolean => {
  return str.split("").every((char) => !isNaN(Number(char)) && char !== " ");
};
export const isMatrixComplete = (matrix: string[][]): boolean => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === "") {
        return false;
      }
    }
  }
  return true;
};
export const isResultMessageEmpty = (obj: ResultDisplayData) => {
  return (
    obj.result === DEFAULT_RESULT_MESSSAGE.result &&
    obj.path === DEFAULT_RESULT_MESSSAGE.path
  );
};
