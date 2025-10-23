const fs = require('fs');
const path = require('path');
const config = require('../config');

class FileRegistry {
  constructor() {
    this.registryPath = path.resolve(config.files.registryPath);
    this.registry = this.load();
  }

  /**
   * Load the file registry from JSON file
   * @returns {Object} Registry data
   */
  load() {
    try {
      if (fs.existsSync(this.registryPath)) {
        const data = fs.readFileSync(this.registryPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Failed to load file registry:', error.message);
    }
    
    // Return default structure
    return {
      baseFileId: null,
      files: []
    };
  }

  /**
   * Save the registry to JSON file
   */
  save() {
    try {
      fs.writeFileSync(
        this.registryPath,
        JSON.stringify(this.registry, null, 2),
        'utf8'
      );
      console.log('✅ File registry saved');
    } catch (error) {
      console.error('❌ Failed to save file registry:', error.message);
      throw error;
    }
  }

  /**
   * Get the base file ID
   * @returns {string|null} Base file ID
   */
  getBaseFile() {
    return this.registry.baseFileId;
  }

  /**
   * Set the base file ID
   * @param {string} fileId - Claude file ID
   */
  setBaseFile(fileId) {
    this.registry.baseFileId = fileId;
    this.save();
    console.log(`✅ Base file set to: ${fileId}`);
  }

  /**
   * Get all registered files
   * @returns {Array} Array of file metadata
   */
  getAllFiles() {
    return this.registry.files;
  }

  /**
   * Add a file to the registry
   * @param {Object} fileData - File metadata (id, filename, mimeType, size, etc.)
   */
  addFile(fileData) {
    const fileEntry = {
      id: fileData.id,
      filename: fileData.filename,
      mimeType: fileData.mime_type || fileData.mimeType,
      sizeBytes: fileData.size_bytes || fileData.sizeBytes,
      uploadedAt: new Date().toISOString(),
      ...fileData
    };

    // Check if file already exists
    const existingIndex = this.registry.files.findIndex(f => f.id === fileData.id);
    if (existingIndex >= 0) {
      this.registry.files[existingIndex] = fileEntry;
      console.log(`✅ Updated file in registry: ${fileData.filename}`);
    } else {
      this.registry.files.push(fileEntry);
      console.log(`✅ Added file to registry: ${fileData.filename}`);
    }

    this.save();
    return fileEntry;
  }

  /**
   * Get file by ID
   * @param {string} fileId - Claude file ID
   * @returns {Object|null} File metadata
   */
  getFileById(fileId) {
    return this.registry.files.find(f => f.id === fileId) || null;
  }

  /**
   * Remove file from registry
   * @param {string} fileId - Claude file ID
   */
  removeFile(fileId) {
    const initialLength = this.registry.files.length;
    this.registry.files = this.registry.files.filter(f => f.id !== fileId);
    
    if (this.registry.files.length < initialLength) {
      // If this was the base file, clear it
      if (this.registry.baseFileId === fileId) {
        this.registry.baseFileId = null;
      }
      this.save();
      console.log(`✅ Removed file from registry: ${fileId}`);
      return true;
    }
    return false;
  }
}

module.exports = new FileRegistry();

