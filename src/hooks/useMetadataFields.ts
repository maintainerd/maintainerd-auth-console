import { useState, useEffect, useCallback } from "react"

export interface MetadataField {
  id: string
  key: string
  value: string
}

export function useMetadataFields() {
  const [customFields, setCustomFields] = useState<MetadataField[]>([])
  const [metadataError, setMetadataError] = useState<string>("")

  useEffect(() => {
    const keys = customFields
      .map((field) => field.key.trim())
      .filter((key) => key !== "")
    const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index)

    if (duplicateKeys.length > 0) {
      const uniqueDuplicates = [...new Set(duplicateKeys)]
      setMetadataError(`Duplicate metadata keys: ${uniqueDuplicates.join(", ")}`)
    } else {
      setMetadataError("")
    }
  }, [customFields])

  const addCustomField = useCallback(() => {
    setCustomFields((prev) => [
      ...prev,
      { id: `field-${Date.now()}`, key: "", value: "" },
    ])
  }, [])

  const removeCustomField = useCallback((id: string) => {
    setCustomFields((prev) => prev.filter((field) => field.id !== id))
  }, [])

  const updateCustomField = useCallback(
    (id: string, key: string, value: string) => {
      setCustomFields((prev) =>
        prev.map((field) => (field.id === id ? { ...field, key, value } : field)),
      )
    },
    [],
  )

  const buildPayload = useCallback((): Record<string, string> | undefined => {
    const metadata: Record<string, string> = {}
    customFields.forEach((field) => {
      if (field.key.trim() && field.value.trim()) {
        metadata[field.key.trim()] = field.value.trim()
      }
    })
    return Object.keys(metadata).length > 0 ? metadata : undefined
  }, [customFields])

  const resetFields = useCallback(
    (metadata?: Record<string, unknown> | null) => {
      if (metadata) {
        const fields = Object.entries(metadata).map(([key, value], index) => ({
          id: `metadata-${index}`,
          key,
          value: String(value),
        }))
        setCustomFields(fields)
      } else {
        setCustomFields([])
      }
      setMetadataError("")
    },
    [],
  )

  return {
    customFields,
    metadataError,
    addCustomField,
    removeCustomField,
    updateCustomField,
    buildPayload,
    resetFields,
  }
}
