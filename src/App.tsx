import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./files";
import UploadFiles from "./uploadFiles";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/uploaded-files" element={<UploadFiles />} />
      </Routes>
    </Router>
  );
}

export default App;
