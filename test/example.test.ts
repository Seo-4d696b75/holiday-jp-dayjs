import { between, isHoliday } from "../src/holiday"

describe("敬老の日 2010", () => {
  test("isHoliday", () => {
    let date = new Date("2010-09-20T00:00+0900")
    expect(isHoliday(date)).toBe(true)
  })

  test("between", () => {
    const days = between(
      new Date('2010-09-14T00:00+0900'),
      new Date('2010-09-21T00:00+0900'),
    )
    expect(days[0].name).toBe("敬老の日")
  })
})