import { useRef, useState } from "react";
import { Paperclip, Upload, X, FileText, Image, File } from "lucide-react";
import { validateAttachments } from "@/utils/ticket.validators";

interface AttachmentUploaderProps {
  onFilesSelected: (files: File[]) => void;
  existingFiles?: File[];
  onRemoveFile?: (index: number) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export function AttachmentUploader({ 
  onFilesSelected, 
  existingFiles = [], 
  onRemoveFile,
  multiple = true, 
  maxFiles = 10 
}: AttachmentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validation = validateAttachments(fileArray);
    
    if (!validation.valid) {
      setError(validation.errors[0]);
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setError(null);
    onFilesSelected(fileArray);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image size={14} />;
    if (file.type === "application/pdf") return <FileText size={14} />;
    return <File size={14} />;
  };

  return (
    <div>
      <div
        className={`mt-1 border-2 border-dashed rounded-xl p-4 text-center transition cursor-pointer
          ${isDragging ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300 hover:bg-gray-50"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">Click or drag files to upload</p>
        <p className="text-xs text-gray-400 mt-1">Images, PDF, TXT (max 10MB each)</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}

      {existingFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {existingFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getFileIcon(file)}
                <span className="text-sm text-gray-600 truncate max-w-[200px]">{file.name}</span>
                <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(0)} KB)</span>
              </div>
              {onRemoveFile && (
                <button
                  type="button"
                  onClick={() => onRemoveFile(idx)}
                  className="text-red-500 hover:text-red-700 transition p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}