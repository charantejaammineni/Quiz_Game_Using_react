import { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

function UploadQuestions() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  function handleUpload(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setMessage(`${file.name} uploaded successfully.`);
  }

  return (
    <div className="admin-page">
        <Breadcrumb/>   
      <h1>Upload Questions</h1>

      <p>Upload quiz questions using an XML file.</p>

      <form onSubmit={handleSubmit}>
        <label>Choose Question File</label>

        {/* File upload */}
        <input
          type="file"
          accept=".xml"
          onChange={handleUpload}
        />

        {file && (
          <p>
            Selected file: <strong>{file.name}</strong>
          </p>
        )}

        <button type="submit">
          Upload Questions
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadQuestions;