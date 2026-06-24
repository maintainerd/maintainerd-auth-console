/**
 * Provider Configuration
 * Shared, provider-aware config UI for identity and social provider forms.
 */

export {
  PROVIDER_CONFIG_SCHEMAS,
  PROVIDER_LABELS,
  PROVIDER_ORDER,
  PROVIDER_SELECT_OPTIONS,
  getPromotedProviderFieldKeys,
  getProviderConnectionSchema,
  getProviderConfigSchema,
  getProviderFieldKeys,
  getProviderKind,
  type ProviderConnectionField,
  type ProviderConnectionFieldKey,
  type ProviderConnectionSchema,
  type ProviderConfigField,
  type ProviderConfigGroup,
  type ProviderConfigSchema,
  type ProviderFieldType,
  type ProviderKind,
} from "./providerConfigSchemas"
export { useProviderConfig, type ProviderConfigController, type CustomConfigField } from "./useProviderConfig"
export { ProviderConfigSection, type ProviderConfigSectionProps } from "./ProviderConfigSection"
export { ProviderLogo, type ProviderLogoProps } from "./ProviderLogo"
export { getProviderBrand, type ProviderBrand } from "./providerBrand"
