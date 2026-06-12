/**
 * ProviderConfigSection
 *
 * Renders the dynamic, provider-aware configuration UI shared by the identity
 * and social provider forms:
 *   1. A "{Provider} Configuration" card whose fields change with the selected
 *      provider (driven by the provider config schemas).
 *   2. An "Additional Configuration" card for free-form key/value pairs.
 *
 * Both write into the same `config` JSON via the supplied controller.
 */

import { ExternalLink, Info, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormInputField, FormPasswordField, FormSwitchField } from "@/components/form"
import { PROVIDER_LABELS } from "./providerConfigSchemas"
import type { ProviderConfigController } from "./useProviderConfig"

export interface ProviderConfigSectionProps {
  provider: string
  controller: ProviderConfigController
  disabled?: boolean
}

export function ProviderConfigSection({ provider, controller, disabled }: ProviderConfigSectionProps) {
  const {
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
  } = controller

  const providerLabel = PROVIDER_LABELS[provider] ?? "Provider"
  const hasFields = Boolean(schema && schema.groups.length > 0)

  return (
    <>
      {/* Provider-specific configuration */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">{providerLabel} Configuration</CardTitle>
          {schema?.summary && (
            <p className="text-sm text-muted-foreground">{schema.summary}</p>
          )}
          {schema?.docsUrl && (
            <a
              href={schema.docsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {schema.docsLabel ?? "Setup documentation"}
            </a>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {hasFields ? (
            schema!.groups.map((group, groupIndex) => (
              <div key={group.title} className="space-y-4">
                {groupIndex > 0 && <div className="border-t" />}
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold">{group.title}</h4>
                  {group.description && (
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {group.fields.map((field) => {
                    const commonProps = {
                      label: field.label,
                      placeholder: field.placeholder,
                      description: field.description,
                      required: field.required,
                      error: errors[field.key],
                      disabled,
                      value: values[field.key] ?? "",
                    }

                    if (field.type === "switch") {
                      return (
                        <FormSwitchField
                          key={field.key}
                          id={`pc-${field.key}`}
                          label={field.label}
                          description={field.description}
                          checked={values[field.key] === "true"}
                          onCheckedChange={(checked) => setFieldValue(field.key, String(checked))}
                          disabled={disabled}
                        />
                      )
                    }

                    if (field.type === "password") {
                      return (
                        <FormPasswordField
                          key={field.key}
                          {...commonProps}
                          // Required is satisfied by an already-stored secret, so
                          // don't show the asterisk once one exists.
                          required={field.required && !presetSecrets[field.key]}
                          description={
                            presetSecrets[field.key]
                              ? "A secret is stored. Leave blank to keep it, or enter a new value to replace it."
                              : field.description
                          }
                          placeholder={presetSecrets[field.key] ? "••••••••" : field.placeholder}
                          onChange={(e) => setFieldValue(field.key, e.target.value)}
                        />
                      )
                    }

                    return (
                      <FormInputField
                        key={field.key}
                        {...commonProps}
                        type={field.type === "url" ? "url" : "text"}
                        onChange={(e) => setFieldValue(field.key, e.target.value)}
                      />
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {schema?.summary ??
                  "This provider has no built-in configuration fields. Use the additional configuration below if your setup requires extra values."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Free-form additional configuration */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Additional Configuration</CardTitle>
          <p className="text-sm text-muted-foreground">
            Optional extra key/value pairs merged into the same configuration. Use this for
            provider settings not covered by the fields above.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {customError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {customError}
            </div>
          )}

          {customFields.length > 0 && (
            <div className="space-y-3">
              {customFields.map((field) => (
                <div key={field.id} className="flex items-start gap-3">
                  <div className="grid flex-1 gap-3 md:grid-cols-2">
                    <Input
                      value={field.key}
                      onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                      placeholder="Key (e.g. token_endpoint)"
                      disabled={disabled}
                    />
                    <Input
                      value={field.value}
                      onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                      placeholder="Value"
                      disabled={disabled}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomField(field.id)}
                    className="text-destructive hover:text-destructive"
                    disabled={disabled}
                    aria-label="Remove field"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={addCustomField}
            disabled={disabled}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
