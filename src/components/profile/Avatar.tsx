"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface AvatarUploadProps {
  userId: string;
  url: string | null;
  onUpload: (url: string) => void;
  size?: number;
}

export default function AvatarUpload({ userId, url, onUpload, size = 150 }: AvatarUploadProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update profile with new avatar_url
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload">
      <div
        className="avatar-preview"
        onClick={() => fileInputRef.current?.click()}
        style={{ width: size, height: size }}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Avatar"
            width={size}
            height={size}
            className="avatar-image"
          />
        ) : (
          <div className="avatar-placeholder">
            <span>{uploading ? "⏳" : "📷"}</span>
          </div>
        )}
        {uploading && <div className="avatar-uploading">Uploading...</div>}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        style={{ display: "none" }}
      />
      <button
        className="avatar-upload-btn"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Change Avatar"}
      </button>
    </div>
  );
}