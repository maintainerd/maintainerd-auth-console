import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { ArrowLeft, Edit, Shield, User, Key, Mail, Phone, Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Activity, Settings, Eye, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOCK_USERS, MOCK_USER_PROFILES } from "../constants"
import type { User as UserType, UserProfile } from "../components/UserColumns"

export default function UserDetailsPage() {
  const { containerId, userId } = useParams<{ containerId: string; userId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  
  const user = MOCK_USERS.find(u => u.id === userId)
  const userProfile = MOCK_USER_PROFILES.find(p => p.userId === userId)

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">User Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The user you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/c/${containerId}/users`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: UserType["status"]) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800 border-gray-200", icon: XCircle },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      suspended: { label: "Suspended", className: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle },
    }
    
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge className={`${config.className} text-xs`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getVerificationBadge = (verified: boolean) => {
    return (
      <Badge
        variant="outline"
        className={verified 
          ? "bg-green-100 text-green-800 border-green-200" 
          : "bg-red-100 text-red-800 border-red-200"
        }
      >
        {verified ? (
          <CheckCircle className="h-3 w-3 mr-1" />
        ) : (
          <XCircle className="h-3 w-3 mr-1" />
        )}
        {verified ? "Verified" : "Unverified"}
      </Badge>
    )
  }

  const get2FABadge = (enabled: boolean) => {
    return (
      <Badge
        variant="outline"
        className={enabled 
          ? "bg-green-100 text-green-800 border-green-200" 
          : "bg-gray-100 text-gray-800 border-gray-200"
        }
      >
        <Shield className="h-3 w-3 mr-1" />
        {enabled ? "Enabled" : "Disabled"}
      </Badge>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/c/${containerId}/users`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userProfile?.avatar} alt={userProfile?.displayName || user.username} />
              <AvatarFallback className="text-lg">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {userProfile?.displayName || user.username}
                </h1>
                {getStatusBadge(user.status)}
              </div>
              <p className="text-muted-foreground">@{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{user.roles.length} role{user.roles.length !== 1 ? 's' : ''} assigned</span>
                <span>•</span>
                <span>{userProfile?.department || 'No department'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate(`/c/${containerId}/users/${userId}/edit`)}
            >
              <Edit className="h-4 w-4" />
              Edit User
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate(`/c/${containerId}/users/${userId}/profile`)}
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="text-sm font-mono">{user.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                <p className="text-sm font-mono">@{user.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">{user.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(user.status)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email Verification</p>
                <div className="flex items-center gap-2">
                  {getVerificationBadge(user.emailVerified)}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Two-Factor Auth</p>
                <div className="flex items-center gap-2">
                  {get2FABadge(user.twoFactorEnabled)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Login Attempts</p>
                <Badge
                  variant={user.loginAttempts > 0 ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {user.loginAttempts}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{format(new Date(user.createdAt), "PPP")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                <p className="text-sm">
                  {user.lastLogin ? format(new Date(user.lastLogin), "PPP") : "Never"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Password Changed</p>
                <p className="text-sm">
                  {user.lastPasswordChange ? format(new Date(user.lastPasswordChange), "PPP") : "Never"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview" className="gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="roles" className="gap-2">
                <Shield className="h-4 w-4" />
                Roles & Permissions ({user.roles.length})
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Key className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <Clock className="h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userProfile ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Display Name</span>
                          <span className="text-sm font-medium">{userProfile.displayName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">First Name</span>
                          <span className="text-sm font-medium">{userProfile.firstName || "Not set"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Last Name</span>
                          <span className="text-sm font-medium">{userProfile.lastName || "Not set"}</span>
                        </div>

                        {userProfile.birthDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Birth Date</span>
                            <span className="text-sm font-medium">{format(new Date(userProfile.birthDate), "PPP")}</span>
                          </div>
                        )}
                        {userProfile.gender && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Gender</span>
                            <span className="text-sm font-medium capitalize">{userProfile.gender.replace('-', ' ')}</span>
                          </div>
                        )}
                        {userProfile.phoneNumber && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Phone</span>
                            <span className="text-sm font-medium">{userProfile.phoneNumber}</span>
                          </div>
                        )}
                        {userProfile.address && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Address</span>
                            <span className="text-sm font-medium">{userProfile.address}</span>
                          </div>
                        )}
                        {userProfile.city && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">City</span>
                            <span className="text-sm font-medium">{userProfile.city}</span>
                          </div>
                        )}
                        {userProfile.country && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Country</span>
                            <span className="text-sm font-medium">{userProfile.country}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Timezone</span>
                          <span className="text-sm font-medium">{userProfile.timezone || "Not set"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Language</span>
                          <span className="text-sm font-medium">{userProfile.language || "Not set"}</span>
                        </div>
                        {userProfile.bio && (
                          <div>
                            <span className="text-sm text-muted-foreground">Bio</span>
                            <p className="text-sm mt-1">{userProfile.bio}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <User className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No profile information available</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/c/${containerId}/users/${userId}/profile`)}
                          className="gap-2 mt-2"
                        >
                          <Settings className="h-4 w-4" />
                          Create Profile
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Details - Custom Fields */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Additional Details
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Custom fields and additional information set by developers
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-6 text-muted-foreground">
                      <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No custom fields configured</p>
                      <p className="text-sm">Custom fields can be added through the profile form</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Roles & Permissions Tab */}
            <TabsContent value="roles" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Roles & Permissions</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Roles and permissions assigned to this user
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Assign Role
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {user.roles.length > 0 ? (
                    <div className="space-y-4">
                      {user.roles.map((role) => (
                        <div key={role} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{role}</span>
                              <Badge variant="outline" className="text-xs">
                                Role
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {role === "Admin" && "Full system access with administrative privileges"}
                              {role === "User" && "Standard user access with basic permissions"}
                              {role === "Manager" && "Management access with team oversight capabilities"}
                              {role === "Developer" && "Development access with code and deployment permissions"}
                              {role === "Security" && "Security-focused access with audit and monitoring permissions"}
                              {role === "Viewer" && "Read-only access with limited viewing permissions"}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Assigned {format(new Date(user.createdAt), "MMM d, yyyy")}</span>
                              <span>by system</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              View Permissions
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Roles Assigned</h3>
                      <p className="text-muted-foreground mb-4">
                        This user doesn't have any roles assigned yet. Assign roles to grant access permissions.
                      </p>
                      <Button
                        className="gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Assign First Role
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Security Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Two-Factor Authentication</span>
                      {get2FABadge(user.twoFactorEnabled)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Failed Login Attempts</span>
                      <Badge 
                        variant={user.loginAttempts > 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {user.loginAttempts}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Password Last Changed</span>
                      <span className="text-sm">
                        {user.lastPasswordChange 
                          ? format(new Date(user.lastPasswordChange), "MMM d, yyyy")
                          : "Never"
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Key className="h-4 w-4" />
                      Reset Password
                    </Button>
                    {!user.emailVerified && (
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                        <Mail className="h-4 w-4" />
                        Resend Verification Email
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Shield className="h-4 w-4" />
                      {user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                    </Button>
                    {user.loginAttempts > 0 && (
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Reset Login Attempts
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
                    <p className="text-muted-foreground">
                      User activity and audit logs will appear here when available.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
