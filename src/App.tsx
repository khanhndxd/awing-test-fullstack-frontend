import "./App.css";
import PreviousOutput from "./components/previousInput";
import { Route, Routes } from "react-router-dom";
import Create from "./pages/create";
import Edit from "./pages/edit";

export default function App() {
  return (
    <div className="app">
      <span style={{ fontSize: "3rem" }}>
        AWING Fullstack Test - Nguyễn Duy Khánh
      </span>
      <PreviousOutput />
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>
    </div>
  );
}
