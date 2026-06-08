import { useState } from "react"
import { describe, vi, expect, beforeEach, afterEach } from "vitest"
import { cleanup, fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/utils"
import { ProfileFormDialog } from "./ProfileFormDialog"
import type { UserProfile } from "@/services/api/users/types"

// Comprehensive validation-error coverage lives in its own file: editing a
// profile preloaded with invalid values and submitting once surfaces every
// field's yup error in a single render. Kept isolated because exercising all
// 16 fields + the date/calendar in one go is sensitive to other dialog tests
// sharing the same module/jsdom context.

const { createMutateAsync, updateMutateAsync, showSuccessMock, showErrorMock } = vi.hoisted(() => ({
  createMutateAsync: vi.fn(),
  updateMutateAsync: vi.fn(),
  showSuccessMock: vi.fn(),
  showErrorMock: vi.fn(),
}))

vi.mock("@/hooks/useUsers", () => ({
  useCreateUserProfile: () => ({ mutateAsync: createMutateAsync, isPending: false }),
  useUpdateUserProfile: () => ({ mutateAsync: updateMutateAsync, isPending: false }),
}))

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ showSuccess: showSuccessMock, showError: showErrorMock }),
}))

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    profile_id: "p1",
    first_name: "John",
    middle_name: "M",
    last_name: "Doe",
    suffix: "Jr",
    display_name: "Johnny",
    bio: "hi",
    birthdate: "1990-05-01T00:00:00Z",
    gender: "male",
    phone: "555",
    email: "john@example.com",
    address: "1 Main",
    city: "NYC",
    country: "US",
    timezone: "UTC",
    language: "en",
    profile_url: "https://example.com/a.png",
    is_default: false,
    metadata: { employee_id: "E1" },
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    ...overrides,
  }
}

/** Render with a real `open` state so onOpenChange(false) actually closes it. */
function renderForm(props: { profile?: UserProfile }) {
  function Host() {
    const [open, setOpen] = useState(true)
    return (
      <ProfileFormDialog open={open} onOpenChange={setOpen} userId="u1" profile={props.profile} />
    )
  }
  return renderWithProviders(<Host />)
}

describe("ProfileFormDialog validation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it("renders a validation error for every field loaded from an invalid profile", async () => {
    // Editing a profile whose stored values are all invalid loads them into the
    // form; one submit then surfaces every field's yup error. This covers the
    // error-message branch for the text inputs AND the option-only select/date
    // fields (which the pickers themselves can never make invalid). Editing
    // (rather than typing) avoids the native maxLength clamp and email-type block.
    const tooLong = (n: number) => "x".repeat(n + 1)
    const bad = makeProfile({
      // Unique name so this dialog's form is unambiguous.
      first_name: "Zelphie",
      middle_name: tooLong(100),
      last_name: tooLong(100),
      suffix: tooLong(50),
      display_name: tooLong(100),
      profile_url: "ftp://bad",
      bio: tooLong(1000),
      email: "not-an-email",
      phone: tooLong(20),
      address: tooLong(500),
      city: tooLong(100),
      gender: "not_a_gender",
      country: "USA",
      timezone: tooLong(50),
      language: tooLong(10),
      // Parseable by Date (so the calendar doesn't choke) but not YYYY-MM-DD.
      // Parseable by Date (so the calendar does not choke) but not YYYY-MM-DD.
      birthdate: "01/05/1990",
    })
    renderForm({ profile: bad })
    // Wait for the reset effect to load the values, then submit the form that
    // owns this dialog's first-name input.
    const firstName = await screen.findByDisplayValue("Zelphie", undefined, { timeout: 5000 })
    fireEvent.submit(firstName.closest("form")!)

    expect(await screen.findByText("Middle name must be at most 100 characters")).toBeInTheDocument()
    expect(screen.getByText("Last name must be at most 100 characters")).toBeInTheDocument()
    expect(screen.getByText("Suffix must be at most 50 characters")).toBeInTheDocument()
    expect(screen.getByText("Display name must be at most 100 characters")).toBeInTheDocument()
    expect(
      screen.getByText("Enter a valid URL starting with http:// or https://"),
    ).toBeInTheDocument()
    expect(screen.getByText("Bio must be at most 1000 characters")).toBeInTheDocument()
    expect(screen.getByText("Invalid email address")).toBeInTheDocument()
    expect(screen.getByText("Phone must be at most 20 characters")).toBeInTheDocument()
    expect(screen.getByText("Address must be at most 500 characters")).toBeInTheDocument()
    expect(screen.getByText("City must be at most 100 characters")).toBeInTheDocument()
    expect(screen.getByText("Invalid gender")).toBeInTheDocument()
    expect(screen.getByText("Country must be a 2-letter ISO code (e.g., US)")).toBeInTheDocument()
    expect(screen.getByText("Timezone must be at most 50 characters")).toBeInTheDocument()
    expect(screen.getByText("Language must be at most 10 characters")).toBeInTheDocument()
    expect(screen.getByText("Birthdate must be in YYYY-MM-DD format")).toBeInTheDocument()
    expect(updateMutateAsync).not.toHaveBeenCalled()
  })
})
