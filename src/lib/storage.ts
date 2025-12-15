import { supabase } from '@/integrations/supabase/client';

const AVATARS_BUCKET = 'avatars';

export const storageService = {
  async uploadAvatar(file: File, userId: string): Promise<string> {
    // Create unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(AVATARS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
      .from(AVATARS_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async deleteAvatar(url: string): Promise<void> {
    if (!url) return;

    // Extract file path from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from(AVATARS_BUCKET)
      .remove([fileName]);

    if (error) {
      console.error('Error deleting avatar:', error);
      // Don't throw error, just log it
    }
  },
};

// Helper function to validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, or WebP)',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 5MB',
    };
  }

  return { valid: true };
};
