/**
 * Geo-blocking Component
 */

import { Controller } from 'react-hook-form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { MapPin } from 'lucide-react'
import type { BaseIpRestrictionSettingsProps } from './types'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

export function GeoBlocking({ control, watch }: BaseIpRestrictionSettingsProps) {
  const geoBlockingEnabled = watch('geoBlockingEnabled')
  const [newBlockedCountry, setNewBlockedCountry] = useState('')
  const [newAllowedCountry, setNewAllowedCountry] = useState('')

  return (
    <SettingsCard
      icon={MapPin}
      title="Geo-blocking"
      description="Control access based on geographic location"
    >
      <Controller
        name="geoBlockingEnabled"
        control={control}
        render={({ field }) => (
          <FormSwitchField
            label="Enable geo-blocking"
            description="Restrict access by country"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />

      {geoBlockingEnabled && (
        <div className="space-y-4 pl-4 border-l-2 border-muted">
          {/* Blocked Countries */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Blocked Countries</Label>
            <Controller
              name="blockedCountries"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Country code (e.g., CN)"
                      value={newBlockedCountry}
                      onChange={(e) => setNewBlockedCountry(e.target.value.toUpperCase())}
                      className="max-w-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (newBlockedCountry && !field.value.includes(newBlockedCountry)) {
                          field.onChange([...field.value, newBlockedCountry])
                          setNewBlockedCountry('')
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((country) => (
                      <Badge
                        key={country}
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => {
                          field.onChange(field.value.filter((c) => c !== country))
                        }}
                      >
                        {country} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            />
          </div>

          {/* Allowed Countries */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Allowed Countries (Optional)</Label>
            <Controller
              name="allowedCountries"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Country code (e.g., US)"
                      value={newAllowedCountry}
                      onChange={(e) => setNewAllowedCountry(e.target.value.toUpperCase())}
                      className="max-w-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (newAllowedCountry && !field.value.includes(newAllowedCountry)) {
                          field.onChange([...field.value, newAllowedCountry])
                          setNewAllowedCountry('')
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((country) => (
                      <Badge
                        key={country}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => {
                          field.onChange(field.value.filter((c) => c !== country))
                        }}
                      >
                        {country} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )}
    </SettingsCard>
  )
}
