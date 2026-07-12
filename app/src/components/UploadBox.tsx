import { useEffect, useRef, useState, type ClipboardEvent as ReactClipboardEvent, type DragEvent } from "react";

export interface UploadBoxProps {
  onFile: (text: string) => void;
}

export default function UploadBox({ onFile }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => onFile(String(e.target?.result ?? ""));
    reader.readAsText(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  }

  function handlePaste(e: ReactClipboardEvent<HTMLDivElement>) {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    e.preventDefault();
    onFile(text);
  }

  useEffect(() => {
    function handleWindowPaste(event: ClipboardEvent) {
      if (event.defaultPrevented) return;
      const text = event.clipboardData?.getData("text");
      if (!text) return;
      event.preventDefault();
      onFile(text);
    }

    window.addEventListener("paste", handleWindowPaste);
    return () => window.removeEventListener("paste", handleWindowPaste);
  }, [onFile]);

  return (
    <div
      className={isDragging ? "upload-box dragging" : "upload-box"}
      tabIndex={0}
      role="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <p className="upload-box-title">Drop your chapter HTML here</p>
      <p className="upload-box-subtitle">
        or click to choose a file, or paste HTML text (Ctrl/Cmd+V)
      </p>
      <p className="upload-box-hint">
        The file just needs to contain HTML markup — .html or .txt both work.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".html,.htm,.txt"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
