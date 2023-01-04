import * as holiday_jp from "@holiday-jp/holiday_jp"
import dayjs from "dayjs"
import { isHoliday, JST_TIMEZONE } from "../index"

// check all the days in this year
const year = 2022

type TestCase = [dayjs.Dayjs, boolean]

describe("isHoliday", () => {
  // ${year}-01-01T00:00:00
  const start = dayjs.tz(`${year}-01-01T00:00:00`, JST_TIMEZONE)
  // ${year+1}-01-01T00:00:00
  const end = dayjs.tz(`${year + 1}-01-01T00:00:00`, JST_TIMEZONE)

  const cases: TestCase[] = []

  for (let d = start; d.isBefore(end); d = d.add(1, "day")) {
    cases.push([
      d,
      holiday_jp.isHoliday(new Date(d.valueOf()))
    ])
  }

  test("init", () => {
    expect(cases.length).toBe(365)
    expect(cases[0][0].format("YYYY-MM-DD")).toBe(`${year}-01-01`)
    expect(cases[364][0].format("YYYY-MM-DD")).toBe(`${year}-12-31`)
  })

  test.each(cases)("check %s is %s", (date, expected) => {
    // dayjs.Dayjs
    expect(isHoliday(date)).toBe(expected)
    // Unix timestamp
    expect(isHoliday(date.valueOf())).toBe(expected)
    // Date
    expect(isHoliday(new Date(date.valueOf()))).toBe(expected)
    // ISO 8601 string parsed as JST
    expect(isHoliday(date.format("YYYY-MM-DD"))).toBe(expected)
  })
})