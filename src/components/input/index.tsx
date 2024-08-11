import { useState } from "react";
import { Inputs, InputErrors } from "./types";
import styles from "./input.module.css";
import { DEFAULT_ERRORS, DEFAULT_INPUTS } from "./enums";
import { isNumeric } from "../../utils/helpers";
import Matrix from "./components/matrix";

export default function InputComponent() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [inputErrors, setInputErrors] = useState<InputErrors>(DEFAULT_ERRORS);

  const areInputsValid = (inputErrors: InputErrors, inputs: Inputs) => {
    return (
      inputErrors.errors.m === "" &&
      inputs.m &&
      inputErrors.errors.n === "" &&
      inputs.n &&
      inputErrors.errors.p === "" &&
      inputs.p
    );
  };

  const handleChangeInputs = (value: string, inputType: string) => {
    if (isNumeric(value)) {
      if (inputType === "m" || inputType === "n") {
        if (Number(value) < 1 || Number(value) > 500) {
          setInputErrors((prev) => {
            return {
              ...prev,
              errors: {
                ...prev.errors,
                [inputType]: "m và n phải thỏa mãn điều kiện (1 <= m,n <= 500)",
              },
            };
          });
          setInputs((prev) => {
            return { ...prev, [inputType]: value };
          });
        } else {
          setInputErrors((prev) => {
            return {
              ...prev,
              errors: {
                ...prev.errors,
                [inputType]: "",
              },
            };
          });
          setInputs((prev) => {
            return { ...prev, [inputType]: value };
          });
        }
      } else {
        if (inputType === "p" && inputs.m && inputs.n) {
          console.log("value", value);
          if (value && Number(value) <= Number(inputs.m) * Number(inputs.n)) {
            setInputErrors((prev) => {
              return {
                ...prev,
                errors: {
                  ...prev.errors,
                  [inputType]: "",
                },
              };
            });
            setInputs((prev) => {
              return { ...prev, [inputType]: value };
            });
          } else {
            setInputErrors((prev) => {
              return {
                ...prev,
                errors: {
                  ...prev.errors,
                  [inputType]: "p phải thỏa mãn điều kiện (1 <= p <= m * n)",
                },
              };
            });
            setInputs((prev) => {
              return { ...prev, [inputType]: value };
            });
          }
        } else return;
      }
    } else return;
  };

  return (
    <div className={styles["input"]}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <div className={styles["input__container"]}>
          <div className={styles["input__box"]}>
            <input
              name="m"
              value={inputs.m}
              type="text"
              onChange={(e) => {
                handleChangeInputs(e.target.value, "m");
              }}
              placeholder="Nhập m"
            />
            {inputErrors.errors.m !== "" && (
              <span style={{ color: "#cc3300" }}>{inputErrors.errors.m}</span>
            )}
          </div>
          <div className={styles["input__box"]}>
            <input
              name="n"
              type="text"
              value={inputs.n}
              onChange={(e) => {
                handleChangeInputs(e.target.value, "n");
              }}
              placeholder="Nhập n"
            />
            {inputErrors.errors.n !== "" && (
              <span style={{ color: "#cc3300" }}>{inputErrors.errors.n}</span>
            )}
          </div>
          <div className={styles["input__box"]}>
            <input
              name="p"
              type="text"
              value={inputs.p}
              onChange={(e) => {
                handleChangeInputs(e.target.value, "p");
              }}
              placeholder="Nhập p"
              disabled={!inputs.m || !inputs.n}
            />
            {inputErrors.errors.p !== "" && (
              <span style={{ color: "#cc3300" }}>{inputErrors.errors.p}</span>
            )}
          </div>
        </div>
        <button disabled={!areInputsValid(inputErrors, inputs)}>
          Tạo ma trận
        </button>
      </div>
      {areInputsValid(inputErrors, inputs) && <Matrix inputs={inputs} />}
    </div>
  );
}
