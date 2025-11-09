import { useEffect, useRef, useState, useCallback } from "react"
import { FormFileUploadField, FormLoginCard } from "@/components/form"
import { useToast } from "@/hooks/useToast"
import type { CreateProfileRequest } from "@/services/api/types/setup"

interface ProfilePictureStepProps {
  data: Partial<CreateProfileRequest>
  onDataChange: (data: Partial<CreateProfileRequest>) => void
  onValidationChange: (isValid: boolean) => void
}

const ProfilePictureStep = ({ data, onDataChange, onValidationChange }: ProfilePictureStepProps) => {
  const { showError, showSuccess } = useToast()
  const [uploading, setUploading] = useState(false)
  const [profileUrl, setProfileUrl] = useState<string | undefined>(data.profile_url)
  
  // Track previous validation state to prevent unnecessary calls
  const prevValidationRef = useRef(true)
  
  // Update validation state - this step is optional, so always valid
  useEffect(() => {
    if (prevValidationRef.current !== true) {
      prevValidationRef.current = true
      onValidationChange(true)
    }
  }, [onValidationChange])

  // Update parent component when profile URL changes
  useEffect(() => {
    onDataChange({ profile_url: profileUrl })
  }, [profileUrl, onDataChange])

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) {
      setProfileUrl(undefined)
      return
    }
    
    // For now, just create a preview URL
    // In a real app, you would upload the file here
    const previewUrl = URL.createObjectURL(file)
    setProfileUrl(previewUrl)
  }, [])

  const handleUpload = useCallback(async (file: File): Promise<string> => {
    setUploading(true)
    
    try {
      // Simulate API call - replace with actual upload logic
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would:
      // 1. Create FormData with the file
      // 2. Call your upload API endpoint
      // 3. Return the uploaded file URL
      
      // For demo purposes, return a mock URL
      const mockUploadedUrl = `https://api.example.com/uploads/${Date.now()}-${file.name}`
      
      showSuccess("Profile picture uploaded successfully!")
      return mockUploadedUrl
      
    } catch (error) {
      showError("Failed to upload profile picture. Please try again.")
      throw error
    } finally {
      setUploading(false)
    }
  }, [showError, showSuccess])

  const handleRemove = useCallback(() => {
    setProfileUrl(undefined)
  }, [])

  return (
    <FormLoginCard
      title="Profile Picture"
      description="Upload a profile picture to personalize your account"
    >
      <div className="space-y-6">
        <FormFileUploadField
          label="Profile Picture"
          description="Upload a clear photo of yourself. This will be visible to other users."
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
          preview={true}
          value={profileUrl}
          onChange={handleFileChange}
          onUpload={handleUpload}
          uploading={uploading}
        />
        
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Tips for a great profile picture:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use a clear, well-lit photo of your face</li>
              <li>• Square images work best (1:1 aspect ratio)</li>
              <li>• Keep the file size under 5MB</li>
              <li>• Supported formats: PNG, JPG, GIF</li>
            </ul>
          </div>
        </div>
      </div>
    </FormLoginCard>
  )
}

export default ProfilePictureStep
