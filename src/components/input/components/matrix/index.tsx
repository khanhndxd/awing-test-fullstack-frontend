import { useEffect, useState } from "react";
import { Inputs } from "../../types";
import styles from "./matrix.module.css";
import {
  isMatrixComplete,
  isNumeric,
  isResultMessageEmpty,
} from "../../../../utils/helpers";
import { Input, ResultDisplayData, ServiceResponse } from "../../../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  findResult,
  findResultWithoutSaving,
  updateInput,
} from "../../../../services/api";
import { DEFAULT_RESULT_MESSSAGE } from "../../enums";
import { useNavigate } from "react-router-dom";

type MatrixProps = {
  inputs: Inputs;
  inputData: ServiceResponse<Input> | undefined;
  isCreate: boolean;
};

export default function Matrix(props: MatrixProps) {
  const { inputs, inputData, isCreate } = props;
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [matrix, setMatrix] = useState<string[][]>([]);
  const [inputErrors, setInputErrors] = useState<boolean[][]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<ResultDisplayData>(
    DEFAULT_RESULT_MESSSAGE,
  );

  const {
    mutate: findResultMutation,
    isPending: findResultPending,
    isError: findResultError,
    error: findResultErrorMessage,
  } = useMutation({
    mutationFn: findResult,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["inputs"] });
    },
  });

  const {
    mutate: findResultWithoutSavingMutation,
    isPending: findResultWithoutSavingPending,
    isError: findResultWithoutSavingError,
    error: findResultWithoutSavingErrorMessage,
  } = useMutation({
    mutationFn: findResultWithoutSaving,
    onSuccess(data) {
      setResultMessage({
        result: data.data.result.toString(),
        path: data.data.pathInfo,
      });
    },
  });

  const {
    mutate: updateInputMutation,
    isPending: updateInputPending,
    isError: updateInputError,
    error: updateInputErrorMessage,
  } = useMutation({
    mutationFn: updateInput,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["inputs"] });
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number,
  ) => {
    const value = e.target.value;
    const newMatrix = matrix.map((r, rIndex) =>
      r.map((c, cIndex) => (rIndex === row && cIndex === col ? value : c)),
    );

    if (isNumeric(value)) {
      const pCount = newMatrix
        .flat()
        .filter((val) => val === inputs.p.toString()).length;
      if (
        Number(value) >= 1 &&
        Number(value) <= Number(inputs.p) &&
        pCount <= 1
      ) {
        setInputErrors((prev) =>
          prev.map((r, rIndex) =>
            r.map((c, cIndex) =>
              rIndex === row && cIndex === col ? false : c,
            ),
          ),
        );
      } else {
        setInputErrors((prev) =>
          prev.map((r, rIndex) =>
            r.map((c, cIndex) => (rIndex === row && cIndex === col ? true : c)),
          ),
        );
        setHasError(true);
      }
      setMatrix(newMatrix);
    }
  };

  useEffect(() => {
    if (inputData) {
      const newMatrix: string[][] = [];
      const newErrors: boolean[][] = [];

      for (let i = 0; i < Number(inputData.data.rows); i++) {
        const row: string[] = [];
        const errorRow: boolean[] = [];
        for (let j = 0; j < Number(inputData.data.columns); j++) {
          const matrixElement = inputData.data.matrixElements.find(
            (el) => el.row === i && el.column === j,
          );
          row.push(matrixElement ? matrixElement.value.toString() : "");
          errorRow.push(false);
        }
        newMatrix.push(row);
        newErrors.push(errorRow);
      }

      setMatrix(newMatrix);
      setInputErrors(newErrors);
    } else {
      const newMatrix: string[][] = [];
      const newErrors: boolean[][] = [];

      for (let i = 0; i < Number(inputs.n); i++) {
        const row: string[] = [];
        const errorRow: boolean[] = [];
        for (let j = 0; j < Number(inputs.m); j++) {
          row.push("");
          errorRow.push(false);
        }
        newMatrix.push(row);
        newErrors.push(errorRow);
      }

      setMatrix(newMatrix);
      setInputErrors(newErrors);
    }
  }, [inputData, inputs.n, inputs.m]);

  useEffect(() => {
    setHasError(inputErrors.some((row) => row.includes(true)));
  }, [inputErrors]);

  const handleFindResult = (type: number) => {
    const matrixElements = matrix.flatMap((row, rowIndex) =>
      row.map((value, colIndex) => ({
        row: rowIndex,
        column: colIndex,
        value: Number(value),
      })),
    );

    const payload = {
      m: Number(inputs.m),
      n: Number(inputs.n),
      p: Number(inputs.p),
      matrixElements,
    };

    setResultMessage(DEFAULT_RESULT_MESSSAGE);

    if (type === 0) findResultWithoutSavingMutation(payload);
    else {
      if (isCreate) findResultMutation(payload);
      else {
        if (inputData) {
          updateInputMutation({
            id: inputData.data.id,
            rows: Number(inputs.n),
            columns: Number(inputs.m),
            treasure: Number(inputs.p),
            matrixElements,
          });
        }
      }

      navigate("/");
    }
  };

  const isLoading =
    findResultPending || findResultWithoutSavingPending || updateInputPending;
  const isError =
    findResultError || findResultWithoutSavingError || updateInputError;
  const errorMessage =
    findResultErrorMessage?.message ||
    findResultWithoutSavingErrorMessage?.message ||
    updateInputErrorMessage?.message;

  return (
    <>
      <span style={{ marginRight: "auto", fontWeight: "bold" }}>
        Ma trận (số hàng: {inputs.n}, số cột: {inputs.m}, kho báu: {inputs.p})
      </span>
      {matrix.length > 0 && (
        <div className={styles["matrix-container"]}>
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className={styles["matrix-row"]}>
              {row.map((value, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                  className={`${styles["matrix-input"]} ${
                    inputErrors[rowIndex][colIndex] ? styles["input-error"] : ""
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      )}
      {hasError && (
        <div className={styles["error-message"]}>
          Ma trận không hợp lệ, giá trị phải nằm trong khoảng 1 &lt;= x &lt;=
          {inputs.p} và chỉ có duy nhất 1 giá trị x = p.
        </div>
      )}
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {errorMessage}</div>}
      {!isResultMessageEmpty(resultMessage) && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: "bold" }}>Kết quả</span>
          <span>Nhiên liệu: {resultMessage.result}</span>
          <span>Đường đi: {resultMessage.path}</span>
        </div>
      )}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => handleFindResult(0)}
          style={{
            width: "fit-content",
            marginLeft: "auto",
          }}
          disabled={hasError || isMatrixComplete(matrix) === false}
        >
          Xem kết quả
        </button>
        <button
          onClick={() => handleFindResult(1)}
          style={{
            width: "fit-content",
          }}
          disabled={hasError || isMatrixComplete(matrix) === false}
        >
          Lưu
        </button>
      </div>
    </>
  );
}
