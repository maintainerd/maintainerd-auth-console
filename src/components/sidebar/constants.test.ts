import { describe, expect, it } from "vitest"
import { data } from "./constants"

describe("sidebar navigation data", () => {
  it("keeps monitoring as one sidenav item with page-level tabs", () => {
    const operations = data.navSections.find((section) => section.label === "Operations")
    const monitoring = operations?.items.find((item) => item.title === "Monitoring")

    expect(monitoring).toMatchObject({
      title: "Monitoring",
      route: "/monitoring",
    })
    expect(monitoring?.items).toBeUndefined()

    const itemTitles = data.navSections.flatMap((section) =>
      section.items.flatMap((item) => [item.title, ...(item.items?.map((subItem) => subItem.title) ?? [])]),
    )

    expect(itemTitles).not.toContain("Sign-in Logs")
    expect(itemTitles).not.toContain("Audit Log")
  })
})
