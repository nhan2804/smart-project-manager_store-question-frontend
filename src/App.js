import logo from "./logo.svg";
import "./App.css";
import DynamicFieldSet from "./components/question";
import "antd/dist/antd.css";
import Mention from "./components/mention";
import Browser from "./components/browser";
function App() {
  return (
    <div className="App">
      {/* <DynamicFieldSet /> */}
      <Browser />
    </div>
  );
}

export default App;
