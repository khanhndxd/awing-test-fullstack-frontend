import { useEffect, useState } from "react";
import { Inputs, InputErrors } from "./types";
import styles from "./input.module.css";
import { DEFAULT_ERRORS, DEFAULT_INPUTS } from "./enums";
import { isNumeric } from "../../utils/helpers";
import Matrix from "./components/matrix";
import { useQuery } from "@tanstack/react-query";
import { getInputById } from "../../services/api";

type InputComponentProps = {
  id: number;
};

export default function InputComponent(props: InputComponentProps) {
  const { id } = props;

  const { data, isLoading, isError } = useQuery({
    queryKey: [`input_${id}`, id],
    queryFn: () => getInputById(id),
    enabled: id > 0,
  });

  const [isMatrixOpen, setIsMatrixOpen] = useState<boolean>(false);
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [inputErrors, setInputErrors] = useState<InputErrors>(DEFAULT_ERRORS);

  const areInputsValid = (
    inputErrors: InputErrors,
    inputs: Inputs,
  ): boolean => {
    return Boolean(
      inputErrors.errors.m === "" &&
        inputs.m &&
        inputErrors.errors.n === "" &&
        inputs.n &&
        inputErrors.errors.p === "" &&
        inputs.p,
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
          setIsMatrixOpen(false);
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
            setIsMatrixOpen(false);
            setInputs((prev) => {
              return { ...prev, [inputType]: value };
            });
          }
        } else return;
      }
    } else return;
  };

  useEffect(() => {
    if (data !== undefined && !isLoading) {
      setIsMatrixOpen(true);
      setInputs({
        n: data.data.rows.toString(),
        m: data.data.columns.toString(),
        p: data.data.treasure.toString(),
      });
    }
  }, [isLoading, data]);

  if (isError) return <div>Có lỗi xảy ra</div>;

  const handleOpenMatrix = () => {
    setIsMatrixOpen((prev) => !prev);
  };

  return (
    <div className={styles["input"]}>
      {isLoading ? (
        <div>Đang tải ...</div>
      ) : (
        <>
          <span style={{ marginRight: "auto", fontWeight: "bold" }}>
            {id > 0 ? `Sửa input ${id}` : "Tạo mới input"}
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <div className={styles["input__container"]}>
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
                  <span style={{ color: "#cc3300" }}>
                    {inputErrors.errors.n}
                  </span>
                )}
              </div>
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
                  <span style={{ color: "#cc3300" }}>
                    {inputErrors.errors.m}
                  </span>
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
                  <span style={{ color: "#cc3300" }}>
                    {inputErrors.errors.p}
                  </span>
                )}
              </div>
            </div>
            <button
              style={{ width: "fit-content", marginLeft: "auto" }}
              onClick={handleOpenMatrix}
              disabled={!areInputsValid(inputErrors, inputs)}
            >
              Xem ma trận
            </button>
          </div>
        </>
      )}
      {areInputsValid(inputErrors, inputs) && isMatrixOpen && (
        <Matrix inputs={inputs} inputData={data} isCreate={id === 0} />
      )}
    </div>
  );
}
