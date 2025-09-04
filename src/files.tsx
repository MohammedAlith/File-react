import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloudUploadSharp } from "react-icons/io5";

interface FileWithDescription {
  id?: number;
  file: File;
  description: string;
}

export default function FileUpload() {
  const UploadIcon = IoCloudUploadSharp as React.ComponentType;

  const [selectedFiles, setSelectedFiles] = useState<FileWithDescription[]>([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray: FileWithDescription[] = Array.from(e.target.files).map((file) => ({
        file,
        description: "",
      }));
      setSelectedFiles(filesArray);
      setMessage(""); 
    }
  };

  // Handle description input
  const handleDescriptionChange = (index: number, value: string) => {
    const updated = [...selectedFiles];
    updated[index].description = value;
    setSelectedFiles(updated);
  };

  const allDescriptionsFilled = selectedFiles.every(f => f.description.trim() !== "");

  // ✅ Upload
  const handleUpload = async () => {
    if (!allDescriptionsFilled || selectedFiles.length === 0) {
      setMessage("Please fill all descriptions before uploading.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(f => {
      formData.append("datas", f.file);
    });
    formData.append("descriptions", JSON.stringify(selectedFiles.map(f => f.description)));

    try {
      const res = await fetch("https://file-node.vercel.app/uploads/files", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Uploaded files:", data.files);

      setSelectedFiles([]);
      setMessage("Upload successful!");
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("Upload failed. Please try again.");
    }
  };

  // ✅ Always fetch from backend
  const handleViewFiles = async () => {
    try {
      const res = await fetch("https://file-node.vercel.app/files");
      const data = await res.json();
      console.log("Fetched files:", data);
      navigate("/uploaded-files", { state: data });
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-900">Upload Files</h1>

        <label className="w-full mb-6 cursor-pointer">
          <input type="file" multiple onChange={handleFileChange} className="hidden" />
          <div className="flex flex-col items-center justify-center outline-dashed outline-blue-300 rounded-2xl p-4 transition hover:border-blue-500 hover:bg-blue-50">
            <p className="text-blue-400 text-7xl"><UploadIcon/></p>
            <p className="text-blue-700 font-medium text-lg">Click or drag files here</p>
          </div>
        </label>

        {selectedFiles.length > 0 && (
          <div className="w-full mb-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-3 text-center">
              File Descriptions<span className="text-red-500"><sup>*</sup></span>
            </h2>
            <ul className="bg-blue-50 rounded-xl p-4 space-y-4 max-h-64 overflow-y-auto">
              {selectedFiles.map((f, index) => (
                <li key={index} className="flex flex-col">
                  <span className="text-blue-700 font-medium">{f.file.name}</span>
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={f.description}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    className="mt-1 p-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {message && <p className="text-green-700 mb-4 font-medium">{message}</p>}

        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            disabled={!allDescriptionsFilled || selectedFiles.length === 0}
            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload
          </button>

          <button
            onClick={handleViewFiles}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg transition-all"
          >
            View Uploaded Files
          </button>
        </div>
      </div>
    </div>
  );
}
