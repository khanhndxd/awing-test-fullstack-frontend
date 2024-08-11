import { useEffect, useState } from "react";
import styles from "./previousinput.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteInput, getAllInputs } from "../../services/api";
import { InputList } from "../../types";
import { useNavigate } from "react-router-dom";

export default function PreviousInput() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [currentApiStatus, setCurrentApiStatus] = useState<boolean>(false);
  const [inputList, setInputList] = useState<InputList[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["inputs"],
    queryFn: getAllInputs,
    retry: 5,
  });
  const {
    mutate: deleteInputMutation,
    isPending: deleteInputPending,
    isError: deleteInputError,
  } = useMutation({
    mutationFn: deleteInput,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["inputs"] });
    },
  });

  useEffect(() => {
    if (data && !isLoading && !isError) {
      setInputList(data.data as unknown as InputList[]);
      setCurrentApiStatus(true);
    } else {
      setCurrentApiStatus(false);
    }
  }, [data, isLoading, isError]);

  if (isError || deleteInputError) return <div>Có lỗi xảy ra</div>;

  const handleCreate = () => {
    navigate(`/create`);
  };
  const handleEdit = (id: number) => {
    navigate(`/edit/${id}`);
  };
  const handleDelete = (id: number) => {
    deleteInputMutation(id);
  };

  const loading = isLoading || deleteInputPending;

  return (
    <div className={styles["previous-input"]}>
      <span style={{ marginRight: "auto" }}>
        Tình trạng kết nối api:{" "}
        <span style={{ color: currentApiStatus ? "#339900" : "#cc3300" }}>
          {currentApiStatus ? "OK" : "Chưa được kết nối"}
        </span>
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Danh sách input đã tạo:</span>
        <button onClick={handleCreate} style={{ marginLeft: "auto" }}>
          Tạo input
        </button>
      </div>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className={styles["previous-input__list"]}>
          <table className={styles["table"]}>
            <thead>
              <tr>
                <th>ID</th>
                <th>M</th>
                <th>N</th>
                <th>P</th>
                <th>Output</th>
                <th>Path</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inputList.map((input) => (
                <tr key={input.id}>
                  <td>{input.id}</td>
                  <td>{input.rows}</td>
                  <td>{input.columns}</td>
                  <td>{input.treasure}</td>
                  <td>{input.output?.result ?? "N/A"}</td>
                  <td>{input.output?.pathInfo ?? "N/A"}</td>
                  <td style={{ display: "flex", gap: "10px" }}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(input.id)}
                    >
                      Sửa
                    </button>
                    <button
                      className={styles.editButton}
                      onClick={() => handleDelete(input.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
