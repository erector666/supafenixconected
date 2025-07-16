import { supabase } from '../supabase-config'

export class FileService {
  // Upload a file to Supabase Storage
  static async uploadFile(file, path, metadata = {}) {
    try {
      const fileName = `${Date.now()}-${file.name}`
      const filePath = `${path}/${fileName}`

      const { data, error } = await supabase.storage
        .from('work-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          metadata: {
            ...metadata,
            originalName: file.name,
            size: file.size,
            type: file.type
          }
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('work-files')
        .getPublicUrl(filePath)

      return { 
        success: true, 
        data: {
          ...data,
          publicUrl: urlData.publicUrl,
          fileName: fileName,
          originalName: file.name
        }
      }
    } catch (error) {
      console.error('Upload file error:', error)
      return { success: false, error: error.message }
    }
  }

  // Download a file
  static async downloadFile(path) {
    try {
      const { data, error } = await supabase.storage
        .from('work-files')
        .download(path)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Download file error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get file URL
  static getFileUrl(path) {
    const { data } = supabase.storage
      .from('work-files')
      .getPublicUrl(path)
    return data.publicUrl
  }

  // List files in a directory
  static async listFiles(path = '') {
    try {
      const { data, error } = await supabase.storage
        .from('work-files')
        .list(path, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('List files error:', error)
      return { success: false, error: error.message }
    }
  }

  // Delete a file
  static async deleteFile(path) {
    try {
      const { error } = await supabase.storage
        .from('work-files')
        .remove([path])

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Delete file error:', error)
      return { success: false, error: error.message }
    }
  }

  // Update file metadata
  static async updateFileMetadata(path, metadata) {
    try {
      const { data, error } = await supabase.storage
        .from('work-files')
        .update(path, {
          metadata: metadata
        })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Update file metadata error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get file metadata
  static async getFileMetadata(path) {
    try {
      const { data, error } = await supabase.storage
        .from('work-files')
        .list(path.split('/').slice(0, -1).join('/'), {
          limit: 1,
          offset: 0,
          search: path.split('/').pop()
        })

      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Get file metadata error:', error)
      return { success: false, error: error.message }
    }
  }

  // Create a signed URL for private files
  static async createSignedUrl(path, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from('work-files')
        .createSignedUrl(path, expiresIn)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Create signed URL error:', error)
      return { success: false, error: error.message }
    }
  }
}

export default FileService 