import * as holiday_jp from "@holiday-jp/holiday_jp"
import dayjs from "dayjs"
import { isHoliday, JST_TIMEZONE } from "../index"

// check all the days in this year
const year = 2022

interface TestCase {
  date: dayjs.Dayjs
  isHoliday: boolean
}

describe("isHoliday", () => {
  // ${year}-01-01T00:00:00
  const start = dayjs.tz(`${year}-01-01T00:00:00`, JST_TIMEZONE)
  // ${year+1}-01-01T00:00:00
  const end = dayjs.tz(`${year + 1}-01-01T00:00:00`, JST_TIMEZONE)


  // holiday_jp depends on timezone
  // https://github.com/holiday-jp/holiday_jp-js/blob/master/lib/format.js
  process.env.TZ = JST_TIMEZONE

  const cases: TestCase[] = []

  for (let d = start; d.isBefore(end); d = d.add(1, "day")) {
    cases.push({
      date: d,
      isHoliday: holiday_jp.isHoliday(new Date(d.valueOf()))
    })
  }

  process.env.TZ = "UTC"

  test("init", () => {
    expect(cases.length).toBe(365)
    expect(cases[0].date.format("YYYY-MM-DD")).toBe(`${year}-01-01`)
    expect(cases[364].date.format("YYYY-MM-DD")).toBe(`${year}-12-31`)
  })

  test.each(cases)("check %s", (c) => {
    // dayjs.Dayjs
    expect(isHoliday(c.date)).toBe(c.isHoliday)
    // Unix timestamp
    expect(isHoliday(c.date.valueOf())).toBe(c.isHoliday)
    // Date in UTC
    expect(isHoliday(new Date(c.date.valueOf()))).toBe(c.isHoliday)
    // ISO 8601 string parsed as JST
    expect(isHoliday(c.date.format("YYYY-MM-DD"))).toBe(c.isHoliday)
  })
})