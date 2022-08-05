import { PlaywrightTestConfig, devices } from "@playwright/test"
import path from "path"

const PORT = process.env.PORT || 3000
const baseURL = `http://localhost:${PORT}`
const config: PlaywrightTestConfig = {
  timeout: 30_000,
  testDir: path.join(__dirname, "test"),
  retries: 2,
  outputDir: "test-results/",

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  webServer: {
    command: "npm run dev",
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL,
    trace: "retry-with-trace",
  },

  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
}
export default config
