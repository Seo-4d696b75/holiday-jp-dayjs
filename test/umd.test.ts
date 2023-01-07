/**
 * @jest-environment puppeteer
 */

describe("load umd from HTML", () => {


  beforeAll(async () => {
    // await page.goto('https://google.com')

    //await page.goto(`file://${__dirname}/index.html`)
  })

  test("check console output", async () => {
    const output: string[] = []
    page.on("console", (m) => output.push(m.text()))
    await page.goto(`file://${__dirname}/index.html`)

    expect(output.length).toBe(3)
    expect(output[0]).toBe("敬老の日")
    expect(output[1]).toBe("true")
    expect(output[2]).toBe("false")
  })
})
