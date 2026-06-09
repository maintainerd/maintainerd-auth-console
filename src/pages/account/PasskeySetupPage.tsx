import { useState } from "react"
import { Key, Plus, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmationDialog } from "@/components/dialog"
import { useToast } from "@/hooks/useToast"
import { beginWebAuthnRegistration, finishWebAuthnRegistration, deleteWebAuthnCredential, downloadWebAuthnCredential, fetchMFAStatus, type MFAWebAuthnKey } from "@/services/api/mfa"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/")
  const padding = "=".repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(base64 + padding)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

function arrayBufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function serializeCredential(cred: PublicKeyCredential) {
  const response = cred.response as AuthenticatorAttestationResponse
  return {
    id: cred.id, rawId: arrayBufferToBase64url(cred.rawId), type: cred.type,
    response: { clientDataJSON: arrayBufferToBase64url(response.clientDataJSON), attestationObject: arrayBufferToBase64url(response.attestationObject) },
  }
}

export default function PasskeySetupPage() {
  const { showSuccess, showError } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey: ["mfa", "status"], queryFn: fetchMFAStatus, retry: false })
  const keys = data?.webauthn_keys ?? []

  const [name, setName] = useState("")
  const [pendingDelete, setPendingDelete] = useState<MFAWebAuthnKey | null>(null)

  const registerMutation = useMutation({
    mutationFn: async () => {
      const result = await beginWebAuthnRegistration()
      const pk = result.publicKey
      try {
        const credential = await navigator.credentials.create({
          publicKey: { ...pk, challenge: base64urlToBuffer(pk.challenge), user: { ...pk.user, id: base64urlToBuffer(pk.user.id) } } as PublicKeyCredentialCreationOptions,
        })
        if (!credential) throw new Error("Registration cancelled")
        return finishWebAuthnRegistration(name || "Security Key", serializeCredential(credential as PublicKeyCredential))
      } catch (err) {
        if (err instanceof DOMException && err.name === "NotAllowedError") throw new Error("Registration was cancelled")
        throw err
      }
    },
    onSuccess: (res) => { showSuccess(`Passkey "${res.name}" registered`); setName(""); queryClient.invalidateQueries({ queryKey: ["mfa", "status"] }) },
    onError: (e) => showError(e),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteWebAuthnCredential,
    onSuccess: () => { showSuccess("Passkey removed"); setPendingDelete(null); queryClient.invalidateQueries({ queryKey: ["mfa", "status"] }) },
    onError: (e) => { showError(e); setPendingDelete(null) },
  })

  const downloadMutation = useMutation({
    mutationFn: async (credentialUuid: string) => {
      const dto = await downloadWebAuthnCredential(credentialUuid)
      const blob = new Blob([JSON.stringify(dto, null, 2)], { type: "application/json" })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `passkey-${dto.credential_uuid}.json`
      a.click()
    },
    onSuccess: () => showSuccess("Passkey downloaded"),
    onError: (e) => showError(e),
  })

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />

  return (
    <div className="space-y-6">
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted"><Key className="size-5 text-muted-foreground" /></div>
            <div>
              <CardTitle className="text-base">Register a passkey</CardTitle>
              <CardDescription>Use Face ID, Touch ID, Windows Hello, or a physical security key.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key-name">Passkey name (optional)</Label>
            <Input id="key-name" placeholder="My YubiKey" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => registerMutation.mutate()} disabled={registerMutation.isPending}>
              <Plus className="size-4 mr-2" />{registerMutation.isPending ? "Waiting for device..." : "Register passkey"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Your passkeys</CardTitle>
          <CardDescription>{keys.length > 0 ? `${keys.length} registered passkey${keys.length !== 1 ? "s" : ""}.` : "You haven't registered any passkeys yet."}</CardDescription>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
              <Key className="size-8 text-muted-foreground/40" />
              <p>Register a passkey above to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {keys.map((key) => (
                <div key={key.credential_uuid} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted"><Key className="size-4 text-muted-foreground" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{key.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{key.transport || "Unknown transport"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => downloadMutation.mutate(key.credential_uuid)} disabled={downloadMutation.isPending} title="Download passkey"><Download className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => setPendingDelete(key)} title="Remove passkey"><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => { if (!open) setPendingDelete(null) }}
        onConfirm={() => { if (pendingDelete) deleteMutation.mutate(pendingDelete.credential_uuid) }}
        title="Remove passkey"
        description={pendingDelete ? `"${pendingDelete.name}" will no longer be able to sign in to your account.` : ""}
        confirmText="Remove"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
