import * as holiday_jp from "@holiday-jp/holiday_jp"
import dayjs from "dayjs"
import { between, JST_TIMEZONE } from "../holiday"

describe("between", () => {
  // test with each year
  const years = Array(20).fill(2000).map((start,i) => start + i)

  // holiday_jp depends on timezone
  // https://github.com/holiday-jp/holiday_jp-js/blob/master/lib/format.js
  process.env.TZ = JST_TIMEZONE

  test.each(years)("year: %d", (year) => {
    const start = dayjs.tz(`${year}-01-01T00:00:00`, JST_TIMEZONE)
    const end = dayjs.tz(`${year}-12-31T23:59:59`, JST_TIMEZONE)
  
    // this call destroys holidays[idx].date string => Date
    const expected = holiday_jp.between(
      new Date(start.valueOf()),
      new Date(end.valueOf()),
    )

    // dayjs.Dayjs
    expect(between(start, end)).toEqual(expected)
    // Unix timestamp
    expect(between(start.valueOf(), end.valueOf())).toEqual(expected)
    // Date 
    expect(between(
      new Date(start.valueOf()),
      new Date(end.valueOf()),
    )).toEqual(expected)
    // ISO 8601 string parsed as JST
    expect(between(
      start.format("YYYY-MM-DD"),
      end.format("YYYY-MM-DD")
    )).toEqual(expected)
    
  })

  test.each([
    "00:00",
    "12:00",
    "23:00",
    "23:59"
  ])("start: %s is inclusive", (time) => {
    const start = dayjs.tz(`2022-01-01T${time}`, JST_TIMEZONE)
    const end = dayjs.tz(`2022-01-02T00:00:00`, JST_TIMEZONE)
  
    const days = between(start, end)
    expect(days.length).toBe(1)
    expect(days[0].date).toBe("2022-01-01")
    expect(days[0].name).toBe("元日")
  })
})