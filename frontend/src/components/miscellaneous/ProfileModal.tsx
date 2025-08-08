/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import { Mail, Camera, X, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { toast } from "sonner";
import { api } from "../../utils/api";
import { useUserStore } from "../../state/userStore";
import { useUpdateProfileMutation } from "@/api/profile";

interface ProfileModalProps {
  user: {
    _id: string;
    name: string;
    email?: string; // allow undefined
    pic?: string;
  };
  children?: React.ReactNode;
  onProfileUpdate?: (updatedUser: any) => void;
  isOwnProfile?: boolean;
}

const ProfileModal = ({
  user,
  children,
  onProfileUpdate,
  isOwnProfile = false,
}: ProfileModalProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const { user: currentUserFromStore, setUser } = useUserStore();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        toast.error("Please select a valid image file");
      }
    }
  };

  const updateProfileMutation = useUpdateProfileMutation({
    onSuccess: (data: { pic: any; name: any; email: any; }) => {
      const updatedUser = { ...currentUser, pic: data.pic };
      setCurrentUser(updatedUser);
      if (isOwnProfile && currentUserFromStore) {
        setUser({
          ...currentUserFromStore,
          pic: data.pic,
          name: data.name,
          email: data.email,
        });
      }
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
      toast.success("Profile picture updated successfully!");
      setSelectedFile(null);
      setPreviewUrl(null);
    },
    onError: (error: { message: any; }) => {
      toast.error(error.message || 'Failed to update profile picture');
    },
  });

  const handleUpdateProfile = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setUploading(true);
    try {
      // Step 1: Upload new image to Cloudinary
      const uploadResult = await api.uploadImage(selectedFile);
      if (!uploadResult.success || !uploadResult.data) {
        throw new Error(uploadResult.error || "Image upload failed");
      }

      if (!currentUserFromStore?.token) {
        throw new Error("User token is missing. Please log in again.");
      }
      updateProfileMutation.mutate({ pic: uploadResult.data.url, token: currentUserFromStore.token });

    } catch (error: any) {
      toast.error(error.message || "Failed to update profile picture");
    } finally {
      setUploading(false);
    }
  };

  const cancelEdit = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setSelectedFile(null);
          setPreviewUrl(null);
        }
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <div className="focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none w-full hover:bg-muted">
            <User className="w-4 h-4 mr-2 text-muted-foreground" />
            View Profile
          </div>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            View and update your profile picture.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Avatar */}
          <div className="relative group cursor-pointer">
            <Avatar className="w-32 h-32 border-4 shadow-md">
              <AvatarImage
                src={previewUrl || currentUser.pic || "/placeholder.svg"}
                alt={currentUser.name}
                className="w-full h-full object-contain object-top"
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl">
                {currentUser.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <input
              type="file"
              id="profile-pic-input"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isOwnProfile && (
              <div
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full"
                onClick={() =>
                  document.getElementById("profile-pic-input")?.click()
                }
              >
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <div className="text-center space-y-1 typography">
            <h3 className="text-lg font-semibold">
              {currentUser.name}
            </h3>
            <span className="flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{currentUser.email ?? "No email provided"}</span>
            </span>
          </div>

          {selectedFile && (
            <div className="flex justify-end w-full gap-2 mt-4">
              <Button onClick={handleUpdateProfile} disabled={uploading}>
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={cancelEdit}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
