import * as holiday_jp from "@holiday-jp/holiday_jp"

describe("Check process.env.TZ", () => {

  test("Date is computed in +0900", () => {
    // holiday_jp depends on timezone
    // https://github.com/holiday-jp/holiday_jp-js/blob/master/lib/format.js
    expect(new Date().getTimezoneOffset()).toBe(-9 * 60)
  })

  test("01/01 is holiday", () => {
    expect(holiday_jp.isHoliday(new Date("2022-01-01T00:00:00"))).toBe(true)
  })

})