/**
 * @jest-environment puppeteer
 */

describe("load umd from HTML", () => {

  test("check console output", async () => {
    const output: string[] = []
    page.on("console", (m) => output.push(m.text()))

    await page.goto(`file://${__dirname}/index.html`, {
      waitUntil: "networkidle0"
    })

    expect(output.length).toBeGreaterThan(0)
    expect(output[0]).toBe("true")
  })
})
