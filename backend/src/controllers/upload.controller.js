exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const filePath = `/uploads/general/${req.file.filename}`;
    res.json({ success: true, url: filePath, filename: req.file.filename });
  } catch (err) {
    console.error("uploadFile error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};