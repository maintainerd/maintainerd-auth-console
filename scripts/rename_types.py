#!/usr/bin/env python3
"""Rename Interface/Type/Enum-suffixed type identifiers across the codebase.

Strategy:
  1. Build a deterministic map of old-name -> new-name (longest first).
  2. Walk every src/**/*.{ts,tsx} file.
  3. For each file, replace every occurrence of each identifier using
     a word-boundary regex.

This handles definition sites, import statements, and usage sites in one pass.
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

ROOT = Path("src")

RENAMES: dict[str, str] = {}

# Interface suffix: simply drop 'Interface'. 88 names.
INTERFACE_NAMES = """
AddApiKeyApiPermissionsRequestInterface
AddApiKeyApisRequestInterface
AddClientApiPermissionsRequestInterface
AddClientApisRequestInterface
AddRolePermissionsRequestInterface
ApiKeyApiPermissionsResponseInterface
ApiKeyApisResponseInterface
ApiKeyListResponseInterface
ApiKeyQueryParamsInterface
ApiKeyResponseInterface
ApiListResponseInterface
ApiQueryParamsInterface
ApiResponseInterface
AuthStateInterface
ClientApisResponseInterface
ClientListResponseInterface
ClientQueryParamsInterface
ClientResponseInterface
ClientUrisResponseInterface
CreateApiKeyRequestInterface
CreateApiKeyResponseInterface
CreateApiRequestInterface
CreateClientRequestInterface
CreateClientUriRequestInterface
CreateIdentityProviderRequestInterface
CreatePermissionRequestInterface
CreatePolicyRequestInterface
CreateRoleRequestInterface
CreateServiceRequestInterface
CreateSignupFlowRequestInterface
CreateUserProfileRequestInterface
CreateUserRequestInterface
GeneralSecuritySettingsResponseInterface
IdentityProviderDetailResponseInterface
IdentityProviderListResponseInterface
IdentityProviderQueryParamsInterface
IdentityProviderResponseInterface
IpRestrictionSettingsResponseInterface
PasswordPoliciesResponseInterface
PermissionListResponseInterface
PermissionQueryParamsInterface
PermissionResponseInterface
PolicyListResponseInterface
PolicyQueryParamsInterface
PolicyResponseInterface
RoleListResponseInterface
RolePermissionsListResponseInterface
RoleQueryParamsInterface
RoleResponseInterface
ServiceListResponseInterface
ServiceQueryParamsInterface
ServiceResponseInterface
SessionSettingsResponseInterface
SignupFlowListResponseInterface
SignupFlowQueryParamsInterface
SignupFlowRolesResponseInterface
TenantStateInterface
ThreatDetectionSettingsResponseInterface
UpdateApiKeyRequestInterface
UpdateApiKeyStatusRequestInterface
UpdateApiRequestInterface
UpdateApiStatusRequestInterface
UpdateClientRequestInterface
UpdateClientStatusRequestInterface
UpdateClientUriRequestInterface
UpdateIdentityProviderRequestInterface
UpdateIdentityProviderStatusRequestInterface
UpdatePermissionRequestInterface
UpdatePermissionStatusRequestInterface
UpdatePolicyRequestInterface
UpdatePolicyStatusRequestInterface
UpdateRoleRequestInterface
UpdateRoleStatusRequestInterface
UpdateServiceRequestInterface
UpdateServiceStatusRequestInterface
UpdateSignupFlowRequestInterface
UpdateSignupFlowStatusRequestInterface
UpdateUserProfileRequestInterface
UpdateUserRequestInterface
UpdateUserStatusRequestInterface
UserIdentitiesQueryParamsInterface
UserIdentitiesResponseInterface
UserListResponseInterface
UserProfilesQueryParamsInterface
UserProfilesResponseInterface
UserQueryParamsInterface
UserRolesQueryParamsInterface
UserRolesResponseInterface
""".split()

for name in INTERFACE_NAMES:
    RENAMES[name] = name[: -len("Interface")]

# Type suffix: drop 'Type' from resource shapes and status discriminators.
TYPE_DROP_NAMES = """
ApiKeyApiItemType
ApiKeyApiPermissionType
ApiKeyApiType
ApiKeyConfigType
ApiKeyStatusType
ApiKeyType
ApiStatusType
ApiType
ClientApiAssociationType
ClientApiPermissionType
ClientApiType
ClientConfigType
ClientIdentityProviderType
ClientSecretType
ClientStatusType
ClientType
ClientUriType
EmailTemplateStatusType
GeneralSecuritySettingsType
IdentityProviderDetailType
IdentityProviderStatusType
IdentityProviderType
IpRestrictionSettingsType
LoginAsyncResponseType
LoginTemplateStatusType
PasswordPoliciesType
PermissionStatusType
PolicyDetailType
PolicyDocumentType
PolicyStatementType
PolicyStatusType
PolicyType
RoleStatusType
RoleType
ServiceStatusType
ServiceType
SessionSettingsType
SignupFlowRoleType
SignupFlowStatusType
SignupFlowType
SmsTemplateStatusType
StatusType
TenantStatusType
TenantType
ThreatDetectionSettingsType
UriType
UserIdentityType
UserProfileType
UserRoleType
UserStatusType
UserType
""".split()

# Reserved: keep the 'Type' suffix; these are categorical discriminators and
# 'Type' carries semantic meaning ("kind/category").
KEEP_TYPE_NAMES = {"ProviderType", "TemplateType", "OnboardingType"}

for name in TYPE_DROP_NAMES:
    if name in KEEP_TYPE_NAMES:
        continue
    RENAMES[name] = name[: -len("Type")]

# Enum suffix: drop 'Enum'. After the resource shape `*Type` -> base rename
# above, names like `ClientType` are freed for the discriminator union to
# adopt via `ClientTypeEnum` -> `ClientType`.
ENUM_NAMES = ["ApiTypeEnum", "ClientTypeEnum", "ClientUriTypeEnum"]
for name in ENUM_NAMES:
    RENAMES[name] = name[: -len("Enum")]

# Sort keys longest-first so a prefix never matches before the longer name.
sorted_keys = sorted(RENAMES.keys(), key=len, reverse=True)
PATTERN = re.compile(r"\b(" + "|".join(re.escape(k) for k in sorted_keys) + r")\b")


def _replace(m: re.Match[str]) -> str:
    return RENAMES[m.group(1)]


def process_file(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    new_text, count = PATTERN.subn(_replace, text)
    if count:
        path.write_text(new_text, encoding="utf-8")
    return count


def main() -> int:
    if not ROOT.is_dir():
        print(f"error: {ROOT} not found", file=sys.stderr)
        return 1
    total_files = 0
    total_subs = 0
    for dirpath, _, filenames in os.walk(ROOT):
        for fn in filenames:
            if not (fn.endswith(".ts") or fn.endswith(".tsx")):
                continue
            p = Path(dirpath) / fn
            n = process_file(p)
            if n:
                total_files += 1
                total_subs += n
                print(f"  {p}: {n} substitutions")
    print(f"\n{total_files} files modified, {total_subs} substitutions total")
    print(f"Total identifiers in rename map: {len(RENAMES)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
