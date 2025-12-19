import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Calendar, Mail, Phone, MapPin, Globe, Clock, Languages, Check, Plus } from "lucide-react"
import { format } from "date-fns"
import { InformationCard } from "@/components/card"
import { DataTablePagination } from "@/components/data-table"
import { ConfirmationDialog, DeleteConfirmationDialog } from "@/components/dialog"
import { useUserProfiles, useDeleteUserProfile, useSetUserProfileAsDefault } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import type { UserProfileType } from "@/services/api/user/types"
import { ProfileFormDialog } from "./ProfileFormDialog"
import { ProfileActions } from "./ProfileActions"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

interface UserProfilesProps {
  userId: string
}

export function UserProfiles({ userId }: UserProfilesProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isSetDefaultOpen, setIsSetDefaultOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<UserProfileType | undefined>()

  const { showSuccess, showError } = useToast()
  const deleteProfileMutation = useDeleteUserProfile()
  const setAsDefaultMutation = useSetUserProfileAsDefault()

  const { data, isLoading, isError } = useUserProfiles(userId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  const handleCreateProfile = () => {
    setSelectedProfile(undefined)
    setIsFormOpen(true)
  }

  const handleEditProfile = (profile: UserProfileType) => {
    setSelectedProfile(profile)
    setIsFormOpen(true)
  }

  const handleDeleteProfile = (profile: UserProfileType) => {
    setSelectedProfile(profile)
    setIsDeleteOpen(true)
  }

  const handleSetAsDefault = async (profile: UserProfileType) => {
    setSelectedProfile(profile)
    setIsSetDefaultOpen(true)
  }

  const handleConfirmSetAsDefault = async () => {
    if (!selectedProfile) return

    try {
      await setAsDefaultMutation.mutateAsync({
        userId,
        profileId: selectedProfile.profile_id,
      })
      showSuccess("Profile set as default successfully")
      setIsSetDefaultOpen(false)
    } catch (error) {
      showError(error)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedProfile) return

    try {
      await deleteProfileMutation.mutateAsync({
        userId,
        profileId: selectedProfile.profile_id,
      })
      showSuccess("Profile deleted successfully")
      setIsDeleteOpen(false)
    } catch (error) {
      showError(error)
    }
  }

  // Create a simple table instance for pagination
  const columns = useMemo(() => [], [])
  const tableData = data?.rows || []

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: data?.total_pages || 0,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return 'Invalid date'
    }
  }

  const getGenderBadge = (gender: string) => {
    if (!gender) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          Not specified
        </Badge>
      )
    }

    const colors: Record<string, string> = {
      male: "bg-blue-100 text-blue-800 border-blue-200",
      female: "bg-pink-100 text-pink-800 border-pink-200",
      other: "bg-purple-100 text-purple-800 border-purple-200",
    }

    return (
      <Badge variant="outline" className={colors[gender] || colors.other}>
        {gender.charAt(0).toUpperCase() + gender.slice(1)}
      </Badge>
    )
  }

  return (
    <>
      <InformationCard
        title="User Profiles"
        description="User profile information including personal details and preferences"
        icon={User}
        action={
          <Button onClick={handleCreateProfile} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Profile
          </Button>
        }
      >
      <div className="space-y-4">
        {/* Horizontal line */}
        <div className="border-t" />

        {/* Scrollable content area */}
        <div className="max-h-[600px] overflow-y-auto pr-2">
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading profiles...
            </div>
          )}

          {isError && (
            <div className="text-center py-8 text-destructive">
              Failed to load profiles
            </div>
          )}

          {data && data.rows.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No profiles found for this user
            </div>
          )}

          {data && data.rows.length > 0 && (
            <div className="space-y-4">
              {data.rows.map((profile: UserProfileType) => (
                <div
                  key={profile.profile_id}
                  className="p-4 border rounded-lg space-y-4"
                >
                  {/* Header with name and default badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-base">
                            {profile.display_name || `${profile.first_name} ${profile.last_name}`}
                          </h4>
                          {profile.is_default && (
                            <Badge variant="default" className="gap-1">
                              <Check className="h-3 w-3" />
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {profile.first_name} {profile.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getGenderBadge(profile.gender)}
                      <ProfileActions
                        profile={profile}
                        onEdit={handleEditProfile}
                        onDelete={handleDeleteProfile}
                        onSetAsDefault={handleSetAsDefault}
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground italic">{profile.bio}</p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {profile.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{profile.email}</span>
                      </div>
                    )}

                    {profile.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{profile.phone}</span>
                      </div>
                    )}

                    {profile.birthdate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Birthdate:</span>
                        <span className="font-medium">{formatDate(profile.birthdate)}</span>
                      </div>
                    )}

                    {profile.timezone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Timezone:</span>
                        <span className="font-medium">{profile.timezone}</span>
                      </div>
                    )}

                    {profile.language && (
                      <div className="flex items-center gap-2 text-sm">
                        <Languages className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Language:</span>
                        <span className="font-medium">{profile.language}</span>
                      </div>
                    )}
                  </div>

                  {/* Location Information */}
                  {(profile.address || profile.city || profile.country) && (
                    <div className="pt-2 border-t">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <span className="text-muted-foreground">Location:</span>
                          <div className="font-medium mt-1">
                            {profile.address && <div>{profile.address}</div>}
                            {(profile.city || profile.country) && (
                              <div>
                                {profile.city}
                                {profile.city && profile.country && ', '}
                                {profile.country}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  {profile.metadata && Object.keys(profile.metadata).length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Metadata:</span>
                        <div className="mt-2 space-y-1">
                          {Object.entries(profile.metadata).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                              <span className="font-medium">{key}:</span>
                              <span className="text-muted-foreground">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer with dates */}
                  <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {formatDate(profile.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span>Updated: {formatDate(profile.updated_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {data && data.rows.length > 0 && (
          <div className="border-t pt-4">
            <DataTablePagination table={table} />
          </div>
        )}
      </div>
    </InformationCard>

    <ProfileFormDialog
      open={isFormOpen}
      onOpenChange={setIsFormOpen}
      userId={userId}
      profile={selectedProfile}
    />

    <ConfirmationDialog
      open={isSetDefaultOpen}
      onOpenChange={setIsSetDefaultOpen}
      onConfirm={handleConfirmSetAsDefault}
      title="Set Profile as Default"
      description={`Are you sure you want to set "${selectedProfile?.display_name || `${selectedProfile?.first_name} ${selectedProfile?.last_name}`}" as the default profile?`}
      confirmText="Set as Default"
      isLoading={setAsDefaultMutation.isPending}
    />

    <DeleteConfirmationDialog
      open={isDeleteOpen}
      onOpenChange={setIsDeleteOpen}
      onConfirm={handleConfirmDelete}
      title="Delete Profile"
      description="Are you sure you want to delete this profile? This action cannot be undone."
      itemName={selectedProfile ? `${selectedProfile.first_name} ${selectedProfile.last_name}` : ""}
      confirmationText="DELETE"
      isDeleting={deleteProfileMutation.isPending}
    />
  </>
  )
}
