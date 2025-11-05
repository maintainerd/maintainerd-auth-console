import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { format } from "date-fns"
import { ArrowLeft, Edit, Shield, Users, Key, Activity, Settings, CheckCircle, XCircle, Clock, AlertTriangle, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MOCK_ROLES, PERMISSION_CATEGORIES } from "../constants"
import { MOCK_USERS } from "../../users/constants"
import type { Role } from "../components/RoleColumns"

export default function RoleDetailsPage() {
  const { tenantId, roleId } = useParams<{ tenantId: string; roleId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['overview', 'permissions', 'users'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])
  
  const role = MOCK_ROLES.find(r => r.id === roleId)
  
  // Get users with this role
  const usersWithRole = MOCK_USERS.filter(user => user.roles.includes(role?.displayName || ""))

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Role Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The role you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/roles`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Roles
        </Button>
      </div>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      )
    }
  }

  const getSystemBadge = (isSystem: boolean) => {
    if (!isSystem) return null

    return (
      <Badge variant="secondary" className="text-xs">
        <Shield className="h-3 w-3 mr-1" />
        System
      </Badge>
    )
  }

  // Group permissions by category
  const groupedPermissions = Object.entries(PERMISSION_CATEGORIES).reduce((acc, [category, categoryPermissions]) => {
    const rolePermissions = role.permissions.filter(permission => 
      categoryPermissions.includes(permission as any)
    )
    if (rolePermissions.length > 0) {
      acc[category] = rolePermissions
    }
    return acc
  }, {} as Record<string, string[]>)

  // Get permissions that don't fit into any category
  const uncategorizedPermissions = role.permissions.filter(permission => 
    !Object.values(PERMISSION_CATEGORIES).flat().includes(permission as any)
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/roles`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roles
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{role.displayName}</h1>
              {getStatusBadge(role.isActive)}
              {getSystemBadge(role.isSystem)}
            </div>
            <p className="text-muted-foreground">{role.description}</p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate(`/${tenantId}/roles/${roleId}/edit`)}
            disabled={role.isSystem}
          >
            <Edit className="h-4 w-4" />
            Edit Role
          </Button>
        </div>



        {/* Role Information */}
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Display Name</p>
                <p className="text-sm">{role.displayName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role Name</p>
                <p className="text-sm font-mono">{role.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{format(new Date(role.createdAt), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="text-sm">{role.createdBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p className="text-sm">{role.isSystem ? "System Role" : "Custom Role"}</p>
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
              <TabsTrigger value="permissions" className="gap-2">
                <Key className="h-4 w-4" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>


          </div>

          {/* Tab Content */}
          <div className="space-y-6">

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Users & Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Users & Access
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">User assignments and access control</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Users</span>
                      <span className="text-sm text-muted-foreground">
                        {role.userCount} assigned
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Users</span>
                      <span className="text-sm text-muted-foreground">
                        {usersWithRole.filter(u => u.status === 'active').length} active
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Role Status</span>
                      <span className="text-sm text-muted-foreground">
                        {role.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Role Type</span>
                      <span className="text-sm text-muted-foreground">
                        {role.isSystem ? 'System Role' : 'Custom Role'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions & Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Permissions & Security
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Permission assignments and security settings</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Permissions</span>
                      <span className="text-sm text-muted-foreground">
                        {role.permissions.length} granted
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Permission Categories</span>
                      <span className="text-sm text-muted-foreground">
                        {Object.keys(groupedPermissions).length} categories
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">System Access</span>
                      <span className="text-sm text-muted-foreground">
                        {role.isSystem ? 'System Level' : 'Standard Level'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Last Modified</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(role.updatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>


          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Role Permissions</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      All permissions granted to users with this role
                    </p>
                  </div>
                  <Button
                    className="gap-2"
                    onClick={() => navigate(`/${tenantId}/roles/${roleId}/edit`)}
                    disabled={role.isSystem}
                  >
                    <Plus className="h-4 w-4" />
                    Add Permission
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {role.permissions.length > 0 ? (
                  <div className="space-y-4">
                    {role.permissions.map((permission) => (
                      <div key={permission} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono font-medium">{permission}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {permission.split(':')[0]} access permission
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Permissions</h3>
                    <p className="text-muted-foreground mb-4">
                      This role doesn't have any permissions assigned yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Users with this Role</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Users who have been assigned the {role.displayName} role
                    </p>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usersWithRole.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No users assigned</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      No users have been assigned the {role.displayName} role yet.
                    </p>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersWithRole.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>
                                  {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.status === 'active'
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : user.status === 'inactive'
                                  ? "bg-gray-100 text-gray-800 border-gray-200"
                                  : user.status === 'pending'
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {user.lastLogin ? format(new Date(user.lastLogin), "MMM d, yyyy") : "Never"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/${tenantId}/users/${user.id}`)}
                              className="gap-2"
                            >
                              <User className="h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
