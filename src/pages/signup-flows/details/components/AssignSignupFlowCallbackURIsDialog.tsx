import { useState, useEffect, useMemo } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useClientUris } from "@/hooks/useClients"
import { useAssignSignupFlowCallbackURIs } from "@/hooks/useSignupFlows"
import { useToast } from "@/hooks/useToast"
import { SelectableOptionRow } from "../../components/SelectableOptionRow"

interface AssignSignupFlowCallbackURIsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  signupFlowId: string
  clientId: string
  existingClientUriIds: string[]
}

export function AssignSignupFlowCallbackURIsDialog({
  open,
  onOpenChange,
  signupFlowId,
  clientId,
  existingClientUriIds,
}: AssignSignupFlowCallbackURIsDialogProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const { showSuccess, showError } = useToast()
  const assignMutation = useAssignSignupFlowCallbackURIs()

  // Only redirect-uris from the flow's client are eligible as callbacks.
  const { data: urisData, isLoading } = useClientUris(clientId)
  const redirectUris = useMemo(
    () => (urisData?.uris ?? []).filter((u) => u.type === "redirect-uri"),
    [urisData],
  )

  useEffect(() => {
    if (!open) {
      setSelected([])
      setSearchQuery("")
    }
  }, [open])

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const available = redirectUris.filter((u) => !existingClientUriIds.includes(u.uri_id))
  const filtered = available.filter((u) =>
    u.uri.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectAll = () => {
    const ids = available.map((u) => u.uri_id)
    setSelected(selected.length === ids.length ? [] : ids)
  }

  const handleSubmit = async () => {
    if (selected.length === 0) {
      showError("Please select at least one callback URI")
      return
    }
    try {
      await assignMutation.mutateAsync({
        signupFlowId,
        data: { client_uri_uuids: selected },
      })
      showSuccess(
        `${selected.length} callback URI${selected.length !== 1 ? "s" : ""} added successfully`,
      )
      onOpenChange(false)
    } catch (error) {
      showError(error)
    }
  }

  const isSubmitting = assignMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Callback URIs</DialogTitle>
          <DialogDescription>
            Select from the client's registered redirect URIs. Already-added URIs are not shown.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select callback URIs</Label>
              {available.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7 text-xs"
                >
                  {selected.length === available.length ? "Deselect All" : "Select All"}
                </Button>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search URIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading URIs...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery
                  ? "No URIs found matching your search"
                  : available.length === 0
                  ? "All of the client's redirect URIs are already added"
                  : "The client has no registered redirect URIs"}
              </div>
            ) : (
              filtered.map((u) => (
                <SelectableOptionRow
                  key={u.uri_id}
                  selected={selected.includes(u.uri_id)}
                  onToggle={() => toggle(u.uri_id)}
                  title={u.uri}
                  mono
                />
              ))
            )}
          </div>

          {selected.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selected.length} URI{selected.length !== 1 ? "s" : ""} selected
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || selected.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add URIs"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
