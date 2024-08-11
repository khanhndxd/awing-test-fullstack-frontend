import { useEffect, useState } from "react";
import styles from "./previousoutput.module.css";

export default function PreviousOutput() {
  const [currentApiStatus, setCurrentApiStatus] = useState<boolean>(false);
  const [outputList, setOutputList] = useState<[]>([1, 2]);

  useEffect(() => {
    setCurrentApiStatus(true);
  }, []);

  return (
    <div className={styles["previous-output"]}>
      <span style={{ marginRight: "auto" }}>
        Tình trạng kết nối api:{" "}
        <span style={{ color: currentApiStatus ? "#339900" : "#cc3300" }}>
          {currentApiStatus ? "OK" : "Chưa được kết nối"}
        </span>
      </span>
      <span style={{ marginRight: "auto" }}>Danh sách output</span>
      <div className={styles["previous-output__list"]}>
        {outputList.map((item) => {
          return (
            <div key={item} className={styles["previous-output__list--item"]}>
              TEST
            </div>
          );
        })}
      </div>
    </div>
  );
}
