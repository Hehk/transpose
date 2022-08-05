import { test, expect } from "@playwright/test"

test("should navigate to none", async ({ page }) => {
  await page.goto("/")
})
