import logo from "./logo.svg";
import "./App.css";
import DynamicFieldSet from "./components/question";
import "antd/dist/antd.css";
import Mention from "./components/mention";
function App() {
  return (
    <div className="App">
      <DynamicFieldSet />
    </div>
  );
}

export default App;
