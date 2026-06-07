/**
 * Client-side filter state for the User Pools listing. Kept in its own module
 * (not the toolbar component file) so the shared default can be imported by both
 * the toolbar and the listing without tripping react-refresh's component rule.
 */
export interface FilterState {
  status: string[]
  isSystem: string
}

export const DEFAULT_USER_POOL_FILTERS: FilterState = {
  status: [],
  isSystem: "all",
}
