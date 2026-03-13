import path from 'path';

// @desc    Upload file
// @route   POST /api/upload
// @access  Private (Admin only)
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Get the file URL
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:filename
// @access  Private (Admin only)
export const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const candidatePaths = [
      path.join(process.cwd(), 'web', 'public', 'uploads', filename),
      path.join(process.cwd(), 'public', 'uploads', filename),
    ];

    // Check if file exists
    const fs = await import('fs/promises');
    let deleted = false;

    for (const filePath of candidatePaths) {
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        deleted = true;
        break;
      } catch {
        // Try next candidate path.
      }
    }

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
};
