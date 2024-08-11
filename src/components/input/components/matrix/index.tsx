import { useEffect, useState } from "react";
import { Inputs } from "../../types";
import styles from "./matrix.module.css";
import { isNumeric } from "../../../../utils/helpers";

type MatrixProps = {
  inputs: Inputs;
};
export default function Matrix(props: MatrixProps) {
  const { inputs } = props;
  const [matrix, setMatrix] = useState<string[][]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number,
  ) => {
    const value = e.target.value;
    if (isNumeric(value) && Number(value) >= 1 && value <= inputs.p) {
      const newMatrix = matrix.map((r, rIndex) =>
        r.map((c, cIndex) => (rIndex === row && cIndex === col ? value : c)),
      );
      setMatrix(newMatrix);
    } else {
      const newMatrix = matrix.map((r, rIndex) =>
        r.map((c, cIndex) => (rIndex === row && cIndex === col ? value : c)),
      );
      setMatrix(newMatrix);
    }
  };

  useEffect(() => {
    const newMatrix: string[][] = [];

    for (let i = 0; i < Number(inputs.m); i++) {
      const row: string[] = [];
      for (let j = 0; j < Number(inputs.n); j++) {
        row.push("0");
      }
      newMatrix.push(row);
    }

    setMatrix(newMatrix);
  }, [inputs.m, inputs.n]);

  return (
    <>
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
                  className={styles["matrix-input"]}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
