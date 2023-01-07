/**
 * @jest-environment puppeteer
 */

describe("load umd from HTML", () => {

  test("check console output", async () => {
    const output: string[] = []
    page.on("console", (m) => output.push(m.text()))
    await Promise.all([
      page.goto(`file://${__dirname}/index.html`),
      page.waitForFunction("window.status === 'done'")
    ]) 

    expect(output.length).toBe(3)
    expect(output[0]).toBe("敬老の日")
    expect(output[1]).toBe("true")
    expect(output[2]).toBe("false")
  })
})
