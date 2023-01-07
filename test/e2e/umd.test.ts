/**
 * @jest-environment puppeteer
 */
import { join } from "path"

describe("load umd from HTML", () => {

  test("check console output", async () => {
    const output: string[] = []
    page.on("console", (m) => output.push(m.text()))

    console.log(__dirname)

    const path = `file://${join(__dirname, "index.html")}`
    console.log(path)

    await page.goto(path, {
      waitUntil: "networkidle0"
    })

    console.log(output)
    expect(output.length).toBe(3)
    expect(output[0]).toBe("敬老の日")
    expect(output[1]).toBe("true")
    expect(output[2]).toBe("false")
  })
})
