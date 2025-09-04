import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
  import { IoMdArrowRoundBack } from "react-icons/io";
import { MdDelete, MdEdit, } from "react-icons/md";
import { FaFileDownload } from "react-icons/fa";

interface UploadedFile {
  id: number;
  filename: string;
  filepath: string;
  description: string;
  filetype: string;
}

export default function UploadedFilesTable() {
  



const BackIcon = IoMdArrowRoundBack as React.ComponentType;
const DeleteIcon = MdDelete as React.ComponentType;
const EditIcon = MdEdit as React.ComponentType;

const DownloadIcon = FaFileDownload as React.ComponentType;


  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFilename, setEditFilename] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchFiles = () => {
    setLoading(true);
    fetch("https://file-node.vercel.app/files")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this file?")) return;
  try {
    const res = await fetch(`https://file-node.vercel.app/files/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log("Delete response:", res.status, data);
    if (res.ok) fetchFiles();
  } catch (err) {
    console.error(err);
  }
};


 const handleEdit = (file: UploadedFile) => {
  setEditingId(file.id);
  setEditFilename(file.filename || ""); 
  setEditDescription(file.description || "");
};

const handleSave = async (id: number) => {
  if (!editFilename.trim()) return alert("Filename cannot be empty");

  try {
    const res = await fetch(`https://file-node.vercel.app/files/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: editFilename, description: editDescription }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return alert(errorData.message || "Failed to update file");
    }

    await fetchFiles();
    setEditingId(null);
  } catch (err) {
    console.error(err);
    alert("Error updating file");
  }
};

  const handleCancel = () => setEditingId(null);

  if (loading) return <p className="text-center mt-6">Loading files...</p>;
  if (files.length === 0) return <p className="text-center mt-6">No files uploaded.</p>;

  return (
    <div className="flex justify-center p-6 bg-gray-100 min-h-screen">
      
      <div className="w-full max-w-6xl">
         <Link
          to="/" 
          className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-3 rounded-md "
        >
        <button className="text-xl"><BackIcon/></button>
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-center py-4">Uploaded Files</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-800 shadow-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 border border-gray-700">ID</th>
                <th className="py-3 px-4 border border-gray-700">Filename</th>
                <th className="py-3 px-4 border border-gray-700">Description</th>
                <th className="py-3 px-4 border border-gray-700">File Type</th>
                <th className="py-3 px-4 border border-gray-700">Link</th>
                <th className="py-3 px-4 border border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 text-white">
              {files.map((file,index) => (
                <tr key={file.id} className="text-center hover:bg-gray-600 transition">
                  <td className="py-2 px-4 border border-gray-600">{index+1}</td>
                  <td className="py-2 px-4 border border-gray-600">
                    {editingId === file.id ? (
                      <input
                        type="text"
                        value={editFilename}
                        onChange={(e) => setEditFilename(e.target.value)}
                        className="text-black px-2 py-1 rounded"
                      />
                    ) : (
                      file.filename
                    )}
                  </td>
                  <td className="py-2 px-4 border border-gray-600">
                    {editingId === file.id ? (
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="text-black px-2 py-1 rounded"
                      />
                    ) : (
                      file.description
                    )}
                  </td>
                  <td className="py-2 px-4 border border-gray-600">{file.filetype}</td>
                  <td className="py-2 px-4 border border-gray-600">
                    <a
                      href={`https://file-node.vercel.app${file.filepath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline hover:text-blue-200"
                    >
                      View
                    </a>
                  </td>
                  <td className="py-2 px-4 border border-gray-600 flex justify-center gap-4">
                    {editingId === file.id ? (
                      <>
                        <button
                          onClick={() => handleSave(file.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full shadow-md transition"
                        >
                        Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-full shadow-md transition"
                        >
                         Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(file)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full shadow-md transition"
                        >
                         <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full shadow-md transition"
                        >
                        <DeleteIcon />
                        </button>
                        <a
                           href={`https://file-node.vercel.app/files/${file.id}/download`}
                          download
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full shadow-md transition"
                        >
                        <DownloadIcon />
                        </a>                   
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
