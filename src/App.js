import logo from "./logo.svg";
import "./App.css";
import DynamicFieldSet from "./components/question";
import "antd/dist/antd.css";
import Mention from "./components/mention";
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <DynamicFieldSet />
      </div>
    </BrowserRouter>
    
  );
}

export default App;
