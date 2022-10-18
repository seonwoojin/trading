import reset from "styled-reset";
import { createGlobalStyle } from "styled-components";
import Home from "./Routes/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const GlobalStyle = createGlobalStyle`

${reset}

* {
  box-sizing: border-box;
}
body {
  font-family: 'Oswald','Holtwood One SC', 'Open Sans', sans-serif;
  font-weight: 400;
  line-height: 1.2;
  overflow-x: hidden;
  -webkit-tap-highlight-color: transparent;
}
input[type="datetime-local"]::-webkit-inner-spin-button,
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
a {
  text-decoration: none;
  color:inherit;
}
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
