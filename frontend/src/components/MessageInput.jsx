import { useRef, useState } from "react";
import axios from "axios";

const MessageInput = ({ onSend, socket, username }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const typingTimeout = useRef(null);

  // ============================
  // WHEN USER TYPES
  // ============================

  const handleChange = (event) => {
    const value = event.target.value;

    setMessage(value);

    if (!socket) {
      return;
    }

    if (value.trim()) {
      socket.emit("typing", username);

      clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        socket.emit("stop_typing", username);
      }, 1000);
    } else {
      socket.emit("stop_typing", username);

      clearTimeout(typingTimeout.current);
    }
  };

  // ============================
  // SELECT FILE
  // ============================

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size must be less than 10 MB.");

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // ============================
  // REMOVE FILE
  // ============================

  const handleRemoveFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================
  // UPLOAD FILE
  // ============================

  const uploadFile = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:5000/api/messages/upload",
      formData
    );

    return response.data.file;
  };

  // ============================
  // SEND MESSAGE
  // ============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage && !selectedFile) {
      return;
    }

    try {
      setUploading(true);

      // ============================
      // SEND FILE
      // ============================

      if (selectedFile) {
        const uploadedFile = await uploadFile(
          selectedFile
        );

        socket.emit("send_message", {
          username,
          message: trimmedMessage,
          fileUrl: uploadedFile.fileUrl,
          fileName: uploadedFile.fileName,
          fileType: uploadedFile.fileType,
          fileSize: uploadedFile.fileSize,
        });
      }

      // ============================
      // SEND TEXT ONLY
      // ============================

      else if (trimmedMessage) {
        onSend(trimmedMessage);
      }

      // ============================
      // CLEAR INPUT
      // ============================

      setMessage("");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (socket) {
        socket.emit(
          "stop_typing",
          username
        );
      }

      clearTimeout(typingTimeout.current);

    } catch (error) {
      console.error(
        "File upload error:",
        error
      );

      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      className="message-input-container"
      onSubmit={handleSubmit}
    >

      {/* ============================
          FILE PREVIEW
      ============================ */}

      {selectedFile && (
        <div className="selected-file">
          <span>
            📎 {selectedFile.name}
          </span>

          <button
            type="button"
            onClick={handleRemoveFile}
            className="remove-file-btn"
            title="Remove file"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================
          FILE INPUT
      ============================ */}

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="file-input"
        accept="image/*,.pdf,.doc,.docx,.txt,.zip"
      />

      {/* ============================
          ATTACH BUTTON
      ============================ */}

      <button
        type="button"
        className="attach-button"
        onClick={() =>
          fileInputRef.current?.click()
        }
        title="Attach file"
        disabled={uploading}
      >
        📎
      </button>

      {/* ============================
          MESSAGE INPUT
      ============================ */}

      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder={
          uploading
            ? "Uploading..."
            : "Type a message..."
        }
        autoComplete="off"
        disabled={uploading}
      />

      {/* ============================
          SEND BUTTON
      ============================ */}

      <button
        type="submit"
        className="send-button"
        disabled={uploading}
      >
        {uploading ? "Sending..." : "Send"}
      </button>

    </form>
  );
};

export default MessageInput;