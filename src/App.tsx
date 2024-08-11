import "./App.css";
import Inputs from "./components/input";
import Output from "./components/output";
import PreviousOutput from "./components/previousOutput";

function App() {
  return (
    <>
      <div className="app">
        <PreviousOutput />
        <Inputs />
        <Output />
      </div>
    </>
  );
}

export default App;
