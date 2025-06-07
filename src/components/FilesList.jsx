import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';
import FileUploadModal from './FileUploadModal';
import { fileService } from '../services';

const FilesList = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fileService.getAll();
        const projectFiles = result.filter(file => file.projectId === projectId);
        setFiles(projectFiles);
      } catch (err) {
        setError(err.message || 'Failed to load files');
        toast.error('Failed to load files');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadFiles();
    }
  }, [projectId]);

  const handleFileUpload = async (fileData) => {
    try {
      const newFile = await fileService.create({
        ...fileData,
        projectId,
        uploadedBy: 'user1', // Current user
        uploadedAt: new Date().toISOString()
      });
      setFiles(prev => [newFile, ...prev]);
      setShowUploadModal(false);
      toast.success('File uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload file');
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await fileService.delete(fileId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('File deleted');
    } catch (err) {
      toast.error('Failed to delete file');
    }
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
      case 'ppt':
      case 'pptx':
        return 'Presentation';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Image';
      case 'zip':
      case 'rar':
        return 'Archive';
      default:
        return 'File';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-28"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full overflow-hidden">
        <div className="text-center py-8">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load files</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          Files & Documents
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <ApperIcon name="Upload" size={16} />
          Upload File
        </motion.button>
      </div>

      {files.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg border"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="FolderOpen" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium">No files yet</h3>
          <p className="mt-2 text-gray-500">Upload files to share with your team</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadModal(true)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Upload First File
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg p-4 border hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name={getFileIcon(file.name)} size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 break-words group-hover:text-primary transition-colors">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(file.uploadedAt), 'MMM d')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {file.uploadedBy.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-500">
                      {file.uploadedBy}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                  title="Download"
                >
                  <ApperIcon name="Download" size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteFile(file.id)}
                  className="p-1.5 text-gray-400 hover:text-error transition-colors"
                  title="Delete"
                >
                  <ApperIcon name="Trash2" size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleFileUpload}
      />
    </div>
  );
};

export default FilesList;