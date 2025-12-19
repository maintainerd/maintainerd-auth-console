import { Mail, Phone, Calendar, CheckCircle, XCircle, Shield, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { UserType } from "@/services/api/user/types"

interface UserInformationProps {
  user: UserType
}

export function UserInformation({ user }: UserInformationProps) {
  const getVerificationBadge = (verified: boolean, label: string) => {
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
        {label} {verified ? "Verified" : "Unverified"}
      </Badge>
    )
  }

  const getCompletionBadge = (completed: boolean, label: string) => {
    return (
      <Badge
        variant="outline"
        className={completed 
          ? "bg-blue-100 text-blue-800 border-blue-200" 
          : "bg-gray-100 text-gray-800 border-gray-200"
        }
      >
        {completed ? (
          <CheckCircle className="h-3 w-3 mr-1" />
        ) : (
          <XCircle className="h-3 w-3 mr-1" />
        )}
        {label} {completed ? "Complete" : "Incomplete"}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-mono">{user.email}</p>
                {getVerificationBadge(user.is_email_verified, "Email")}
              </div>
            </div>

            {user.phone && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-mono">{user.phone}</p>
                  {getVerificationBadge(user.is_phone_verified, "Phone")}
                </div>
              </div>
            )}

            {user.tenant && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Building2 className="h-4 w-4" />
                  Tenant
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{user.tenant.name}</p>
                  <p className="text-xs text-muted-foreground">{user.tenant.description}</p>
                  <Badge variant="outline" className="w-fit text-xs mt-1">
                    {user.tenant.identifier}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Account Status */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Shield className="h-4 w-4" />
                Account Status
              </div>
              <div className="flex flex-col gap-2">
                {getCompletionBadge(user.is_profile_completed, "Profile")}
                {getCompletionBadge(user.is_account_completed, "Account")}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                Created
              </div>
              <p className="text-sm">
                {format(new Date(user.created_at), "PPP 'at' p")}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                Last Updated
              </div>
              <p className="text-sm">
                {format(new Date(user.updated_at), "PPP 'at' p")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
