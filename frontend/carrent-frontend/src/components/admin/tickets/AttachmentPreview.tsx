import { useState } from "react";
import { X, Download, Image, FileText, File, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AttachmentPreviewProps {
  url: string;
  filename: string;
  mimeType: string;
  onClose?: () => void;
  onDownload?: () => void;
}

export function AttachmentPreview({ url, filename, mimeType, onClose, onDownload }: AttachmentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isImage = mimeType.startsWith("image/");
  const isPDF = mimeType === "application/pdf";

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* Thumbnail Button */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition group"
      >
        {isImage ? <Image size={14} /> : isPDF ? <FileText size={14} /> : <File size={14} />}
        <span className="text-sm text-gray-600 truncate max-w-[150px]">{filename}</span>
        <Eye size={12} className="text-gray-400 group-hover:text-gray-600" />
      </button>

      {/* Modal Preview */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-medium">{filename}</h3>
                <div className="flex gap-2">
                  {onDownload && (
                    <button onClick={onDownload} className="p-1 text-gray-500 hover:text-gray-700">
                      <Download size={18} />
                    </button>
                  )}
                  <button onClick={handleClose} className="p-1 text-gray-500 hover:text-gray-700">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-auto max-h-[calc(90vh-70px)]">
                {isImage && (
                  <img src={url} alt={filename} className="max-w-full mx-auto rounded-lg" />
                )}
                {isPDF && (
                  <iframe src={url} className="w-full h-[70vh] rounded-lg" title={filename} />
                )}
                {!isImage && !isPDF && (
                  <div className="text-center py-12">
                    <File size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">Preview not available for this file type</p>
                    {onDownload && (
                      <button onClick={onDownload} className="mt-4 text-red-600 hover:text-red-700">
                        Download File
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}