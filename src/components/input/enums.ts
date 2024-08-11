import { ResultDisplayData } from "../../types";
import { Inputs, InputErrors } from "./types";

export const DEFAULT_INPUTS: Inputs = {
  m: "",
  n: "",
  p: "",
};
export const DEFAULT_ERRORS: InputErrors = {
  errors: {
    m: "",
    n: "",
    p: "",
  },
};
export const DEFAULT_RESULT_MESSSAGE: ResultDisplayData = {
  result: "",
  path: "",
};
