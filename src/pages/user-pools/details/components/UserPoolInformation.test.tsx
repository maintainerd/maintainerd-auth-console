import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { UserPoolInformation } from "./UserPoolInformation"

const baseInfo = {
  identifier: "cust",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
}

describe("UserPoolInformation", () => {
  it("renders identifier and dates for a custom pool", () => {
    render(<UserPoolInformation userPool={{ ...baseInfo, is_system: false }} />)
    expect(screen.getByText("cust")).toBeInTheDocument()
    expect(screen.getByText("Custom Pool")).toBeInTheDocument()
    expect(screen.getByText("Identifier")).toBeInTheDocument()
    expect(screen.getByText("Created")).toBeInTheDocument()
    expect(screen.getByText("Last Updated")).toBeInTheDocument()
  })

  it("labels system pools", () => {
    render(<UserPoolInformation userPool={{ ...baseInfo, is_system: true }} />)
    expect(screen.getByText("System Pool")).toBeInTheDocument()
  })
})
