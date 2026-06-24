/**
 * useProviderConfig
 *
 * Owns the editable state behind a provider's `config` JSON. It splits an
 * incoming config into the provider's well-known fields and a list of free-form
 * "additional" key/value pairs, keeps both in sync as the operator switches
 * providers, and recombines them into a single object on save.
 *
 * Field values are held as display strings regardless of their JSON type; the
 * field's declared `type` decides how they are parsed back out in `buildConfig`:
 *   - list   → comma/newline separated string ⇄ string[]
 *   - switch → "true"/"false" ⇄ boolean
 *   - password → write-only config fields, if a provider ever declares one.
 *
 * Shared broker connection fields such as issuer/client ID/secret/JIT/domains
 * are top-level provider columns and are handled by the identity provider form,
 * not by this config JSON controller.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  getProviderConfigSchema,
  getProviderFields,
  type ProviderConfigField,
} from "./providerConfigSchemas"

export interface CustomConfigField {
  id: string
  key: string
  value: string
}

let fieldIdCounter = 0
const nextFieldId = () => `pc-${fieldIdCounter++}`

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (Array.isArray(value)) return value.map(String).join(", ")
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

/** Parse a comma/newline separated string into a trimmed, non-empty list. */
function parseList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function fieldByKey(provider: string): Map<string, ProviderConfigField> {
  return new Map(getProviderFields(provider).map((field) => [field.key, field]))
}

interface SplitResult {
  known: Record<string, string>
  custom: CustomConfigField[]
  /** Password keys that already have a stored secret (shown as "leave blank to keep"). */
  presetSecrets: Record<string, boolean>
}

/** Split a raw config object into the provider's known fields and the rest. */
function splitConfig(config: Record<string, unknown> | null | undefined, provider: string): SplitResult {
  const fields = fieldByKey(provider)
  const known: Record<string, string> = {}
  const custom: CustomConfigField[] = []
  const presetSecrets: Record<string, boolean> = {}

  Object.entries(config || {}).forEach(([key, value]) => {
    const field = fields.get(key)
    if (!field) {
      custom.push({ id: nextFieldId(), key, value: stringifyValue(value) })
      return
    }

    if (field.type === "password") {
      // Write-only: never surface the stored/redacted secret in the input.
      known[key] = ""
      presetSecrets[key] = stringifyValue(value).trim() !== ""
      return
    }

    if (field.type === "switch") {
      known[key] = value === true || value === "true" ? "true" : "false"
      return
    }

    known[key] = stringifyValue(value)
  })

  return { known, custom, presetSecrets }
}

export function useProviderConfig(provider: string) {
  const schema = useMemo(() => getProviderConfigSchema(provider), [provider])

  const [values, setValues] = useState<Record<string, string>>({})
  const [customFields, setCustomFields] = useState<CustomConfigField[]>([])
  const [presetSecrets, setPresetSecrets] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [customError, setCustomError] = useState("")

  const prevProviderRef = useRef(provider)

  /** Hydrate from an existing config (edit mode). */
  const load = useCallback(
    (config: Record<string, unknown> | null | undefined, providerForSplit: string = provider) => {
      const { known, custom, presetSecrets: secrets } = splitConfig(config, providerForSplit)
      setValues(known)
      setCustomFields(custom)
      setPresetSecrets(secrets)
      setErrors({})
      setCustomError("")
      prevProviderRef.current = providerForSplit
    },
    [provider]
  )

  // When the provider changes, re-bucket the current values under the new
  // provider's field set so shared config keys (scopes, endpoint overrides, …)
  // carry over and the rest fall back to additional fields. Values are already display strings,
  // so this is a straight key re-bucketing — no type coercion needed.
  useEffect(() => {
    if (prevProviderRef.current === provider) return
    prevProviderRef.current = provider

    const fields = fieldByKey(provider)
    setValues((prevValues) => {
      const combined: Record<string, string> = { ...prevValues }
      customFields.forEach((field) => {
        const key = field.key.trim()
        if (key) combined[key] = field.value
      })

      const nextKnown: Record<string, string> = {}
      const nextCustom: CustomConfigField[] = []
      Object.entries(combined).forEach(([key, value]) => {
        if (fields.has(key)) {
          nextKnown[key] = value
        } else {
          nextCustom.push({ id: nextFieldId(), key, value })
        }
      })
      setCustomFields(nextCustom)
      return nextKnown
    })
    setPresetSecrets({})
    setErrors({})
    setCustomError("")
    // customFields is read via the functional update; provider is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  // Live feedback for duplicate / colliding additional keys.
  useEffect(() => {
    const knownKeys = getProviderFields(provider).map((f) => f.key)
    const customKeys = customFields.map((f) => f.key.trim()).filter(Boolean)
    const duplicates = customKeys.filter((key, index) => customKeys.indexOf(key) !== index)
    const collisions = customKeys.filter((key) => knownKeys.includes(key))

    if (duplicates.length > 0) {
      setCustomError(`Duplicate configuration keys: ${[...new Set(duplicates)].join(", ")}`)
    } else if (collisions.length > 0) {
      setCustomError(`These keys are already managed in the section above: ${[...new Set(collisions)].join(", ")}`)
    } else {
      setCustomError("")
    }
  }, [customFields, provider])

  const setFieldValue = useCallback((key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev))
  }, [])

  const addCustomField = useCallback(() => {
    setCustomFields((prev) => [...prev, { id: nextFieldId(), key: "", value: "" }])
  }, [])

  const removeCustomField = useCallback((id: string) => {
    setCustomFields((prev) => prev.filter((field) => field.id !== id))
  }, [])

  const updateCustomField = useCallback((id: string, key: string, value: string) => {
    setCustomFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, key, value } : field))
    )
  }, [])

  /** Validate required known fields and additional-key integrity. */
  const validate = useCallback((): boolean => {
    const nextErrors: Record<string, string> = {}
    if (schema) {
      schema.groups.forEach((group) =>
        group.fields.forEach((field) => {
          if (!field.required) return
          const value = (values[field.key] ?? "").trim()
          if (field.type === "password") {
            // Satisfied by a newly typed secret or an already-stored one.
            if (value === "" && !presetSecrets[field.key]) {
              nextErrors[field.key] = `${field.label} is required`
            }
          } else if (field.type === "list") {
            if (parseList(values[field.key] ?? "").length === 0) {
              nextErrors[field.key] = `${field.label} is required`
            }
          } else if (field.type !== "switch") {
            if (value === "") {
              nextErrors[field.key] = `${field.label} is required`
            }
          }
        })
      )
    }
    setErrors(nextErrors)

    const knownKeys = getProviderFields(provider).map((f) => f.key)
    const customKeys = customFields.map((f) => f.key.trim()).filter(Boolean)
    const hasDuplicates = customKeys.some((key, index) => customKeys.indexOf(key) !== index)
    const hasCollisions = customKeys.some((key) => knownKeys.includes(key))

    return Object.keys(nextErrors).length === 0 && !hasDuplicates && !hasCollisions
  }, [schema, values, presetSecrets, customFields, provider])

  /** Merge known fields and additional fields into the config object to persist. */
  const buildConfig = useCallback((): Record<string, unknown> => {
    const config: Record<string, unknown> = {}

    if (schema) {
      schema.groups.forEach((group) =>
        group.fields.forEach((field) => {
          const raw = values[field.key] ?? ""

          switch (field.type) {
            case "password": {
              // Write-only: only send when a new secret was typed; otherwise the
              // backend preserves the stored value.
              const trimmed = raw.trim()
              if (trimmed !== "") config[field.key] = trimmed
              break
            }
            case "list": {
              const list = parseList(raw)
              if (list.length > 0) config[field.key] = list
              break
            }
            case "switch": {
              config[field.key] = raw === "true"
              break
            }
            default: {
              const trimmed = raw.trim()
              if (trimmed !== "") config[field.key] = trimmed
            }
          }
        })
      )
    }

    customFields.forEach((field) => {
      const key = field.key.trim()
      if (key) config[key] = field.value
    })

    return config
  }, [schema, values, customFields])

  return {
    schema,
    values,
    customFields,
    presetSecrets,
    errors,
    customError,
    setFieldValue,
    addCustomField,
    removeCustomField,
    updateCustomField,
    load,
    validate,
    buildConfig,
  }
}

export type ProviderConfigController = ReturnType<typeof useProviderConfig>
