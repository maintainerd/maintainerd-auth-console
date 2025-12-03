/**
 * Get status color for badge
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'inactive':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

/**
 * Get status text for display
 */
export function getStatusText(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

/**
 * Get provider display name
 */
export function getProviderDisplayName(provider: string): string {
  const providerNames: Record<string, string> = {
    google: 'Google',
    facebook: 'Facebook',
    github: 'GitHub'
  }
  
  return providerNames[provider] || provider
}

