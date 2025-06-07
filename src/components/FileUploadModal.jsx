import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';

const FileUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await onSubmit({
        name: selectedFile.name,
        size: selectedFile.size,
        url: `/files/${selectedFile.name}` // Mock URL
      });
      
      // Reset
      setSelectedFile(null);
    } catch (err) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'FileText';
      case 'doc':
      case 'docx':
        return 'FileText';
      case 'xls':
      case 'xlsx':
        return 'FileSpreadsheet';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Image';
      default:
        return 'File';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-heading font-semibold text-gray-900">
                    Upload File
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* Drag & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                    dragOver 
                      ? 'border-primary bg-primary/5 scale-105' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept="*/*"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <motion.div
                      animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <ApperIcon 
                        name="Upload" 
                        className={`w-12 h-12 mx-auto mb-4 ${
                          dragOver ? 'text-primary' : 'text-gray-400'
                        }`} 
                      />
                    </motion.div>
                    <p className={`text-gray-600 ${dragOver ? 'text-primary' : ''}`}>
                      {dragOver ? 'Drop file here' : 'Drag files here or click to browse'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Maximum file size: 50MB
                    </p>
                  </label>
                </div>

                {/* Selected File Preview */}
                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ApperIcon name={getFileIcon(selectedFile.name)} size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 break-words">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ApperIcon name="X" size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Upload" size={16} />
                        Upload File
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FileUploadModal;