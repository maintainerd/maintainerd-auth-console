import { useState, useEffect, useCallback } from "react"

export interface MetadataField {
  id: string
  key: string
  value: string
}

const KEY_PATTERN = /^[a-z0-9-]+$/

export function useMetadataFields() {
  const [customFields, setCustomFields] = useState<MetadataField[]>([])
  const [metadataError, setMetadataError] = useState<string>("")

  useEffect(() => {
    const errors: string[] = []
    const keys: string[] = []

    for (const field of customFields) {
      const key = field.key.trim()
      if (key === "") continue

      if (key.length > 25) {
        errors.push(`"${key}" — key must not exceed 25 characters`)
      } else if (!KEY_PATTERN.test(key)) {
        errors.push(`"${key}" — only lowercase letters, numbers, and hyphens allowed`)
      }
      keys.push(key)
    }

    const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index)
    if (duplicateKeys.length > 0) {
      const uniqueDuplicates = [...new Set(duplicateKeys)]
      errors.push(`Duplicate keys: ${uniqueDuplicates.join(", ")}`)
    }

    setMetadataError(errors.length > 0 ? errors[0] : "")
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

  const sanitizeKey = useCallback((raw: string) => {
    return raw.replace(/[^a-z0-9-]/g, '').toLowerCase().slice(0, 25)
  }, [])

  const updateCustomField = useCallback(
    (id: string, key: string, value: string) => {
      setCustomFields((prev) =>
        prev.map((field) => (field.id === id ? { ...field, key: sanitizeKey(key), value } : field)),
      )
    },
    [sanitizeKey],
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
