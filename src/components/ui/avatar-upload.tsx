import React, { useRef, useState } from 'react';
import { Button } from './button';
import { Camera, Loader2 } from 'lucide-react';
import { storageService, validateImageFile } from '@/lib/storage';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatar?: string;
  onUploadComplete: (url: string) => void;
  userId: string;
  name: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onUploadComplete,
  userId,
  name,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatar);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      setIsUploading(true);

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to storage
      const url = await storageService.uploadAvatar(file, userId);

      // Clean up preview URL
      URL.revokeObjectURL(objectUrl);

      onUploadComplete(url);
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
      setPreviewUrl(currentAvatar);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <img
          src={previewUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`}
          alt={name}
          className="w-32 h-32 rounded-full object-cover border-4 border-border"
        />
        <div
          className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={handleClick}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <Camera className="h-8 w-8 text-white" />
          )}
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Camera className="h-4 w-4 mr-2" />
            Change Photo
          </>
        )}
      </Button>
    </div>
  );
};
