/**
 * Invitation API types
 */

export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked'

/** An invitation as returned by the admin list endpoint. */
export interface Invite {
  invite_id: string
  invited_email: string
  status: InviteStatus
  expires_at: string | null
  used_at: string | null
  created_at: string
  // Optional auth flow attached to the invite (absent = default registration).
  auth_flow_id?: string
  auth_flow_name?: string
}

/** Payload to send an invitation. auth_flow_uuid is optional — when omitted the
 * invitee onboards with only the default registered role and the active branding. */
export interface SendInviteRequest {
  email: string
  auth_flow_uuid?: string
}
