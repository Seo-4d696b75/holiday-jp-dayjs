import { Holiday, holidays as _holidays } from "@holiday-jp/holiday_jp";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

/**
 * Union type of multiple values expressing date-time.
 * 
 * - `number` : Unix timestamp in milliseconds
 * - `Date` : Build-in type
 * - `Dayjs` : dayjs is also supported
 * - `string` : Parse the given string in ISO 8601 format. For more details, please see [Day.js - Parse](https://day.js.org/docs/en/parse/string)
 */
export type DateLike =
  number |
  Date |
  dayjs.Dayjs |
  string

export const JST_TIMEZONE = "Asia/Tokyo" as const

function format(date: DateLike): string {
  return dayjs.tz(date, JST_TIMEZONE).format("YYYY-MM-DD")
}

/**
 * Checks whether the given date is holiday in Japan.
 * 
 * The given date will be formatted in "YYYY-MM-DD" with "Asia/Tokyo"(+0900) timezone,
 * then used as key value in searching for holidays.
 * 
 * If ISO 8601 string given, parsed as "Asia/Tokyo" at first.
 * 
 * @param date A Date-like value to be checked
 * @returns True if the given date is holiday otherwise false
 */
export function isHoliday(date: DateLike): boolean {
  const key = format(date)
  if (holidays[key]) {
    return true
  }
  return false
}

/**
 * Finds all the holidays between the given dates
 * 
 * Each holiday "YYYY-MM-DD" will be compared with the given `start` and `end`
 * in unit of date, where all the date values are parsed in "Asia/Tokyo"(+0900) timezone. 
 * Both `start` and `end` are inclusive. 
 * For more detail of date comparison, please see [Day.js - Is Between](https://day.js.org/docs/en/query/is-between)
 * 
 * **Note** This implementation is different from [the original one](https://github.com/holiday-jp/holiday_jp-js/blob/f9069506682270319295102f289c958530edfefd/lib/holiday_jp.js#L8-L21).
 * 
 * The original implementation has some problems;  
 * - Calling `between` destroys `holidays` records, as mentioned in [issue 36](https://github.com/holiday-jp/holiday_jp-js/issues/36)
 * - Comparison of date is done precisely in milliseconds, so in point of date comparison, `start` is exclusive while `end` is inclusive.
 * 
 * @param start Start date to find holiday
 * @param end End date to find holiday
 * @returns The holidays list between start and end, or empty list if none.
 */
export function between(start: DateLike, end: DateLike): Holiday<string>[] {
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  return Object.keys(holidays)
    .filter(key => dayjs.tz(key, "Asia/Tokyo").isBetween(startDate, endDate, "date", "[]"))
    .map(key => holidays[key])
}

type ReadonlyHolidays = Readonly<Record<string, Readonly<Holiday<string>>>>

/**
 * All the holidays
 * 
 * This is a deep clone of the original record defined in @holiday-jp/holiday_jp
 * 
 * **Note** This record not changed when `between` called.  
 * 
 * As mentioned in [issue 36](https://github.com/holiday-jp/holiday_jp-js/issues/36),
 * calling `between` destroys the original `holidays` records, but not this `holidays`.
 *
 */
export const holidays: ReadonlyHolidays = Object.keys(_holidays).reduce((result, key) => {
  result[key] = { ..._holidays[key] }
  return result
}, {} as Record<string, Holiday<string>>)