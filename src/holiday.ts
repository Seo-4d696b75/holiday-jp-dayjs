import * as holiday_jp from "@holiday-jp/holiday_jp";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)
dayjs.extend(timezone)

export type Holiday = Readonly<{
  /**
   * Expression of date formatted in "YYYY-MM-DD"
   */
  date: string
} & Omit<holiday_jp.Holiday, "date">>

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
 * then used as key when searching for holidays.
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
 * in unit of date, where all the date values are manipulated "Asia/Tokyo".
 * Both `start` and `end` are inclusive. 
 * 
 * @param start Start date to find holiday
 * @param end End date to find holiday
 * @returns The holidays list between start and end, or empty list if none.
 */
export function between(start: DateLike, end: DateLike): Holiday[] {
  const after = format(start)
  const before = format(end)
  return Object.keys(holidays)
    .filter(key => {
      // new dayjs instance for each holiday too slow!
      // this implementation use string comparison formatted in "YYYY-MM-DD"
      // const d = dayjs.tz(key, JST_TIMEZONE)
      return after <= key && key <= before
    }).map(key => holidays[key])
}

// As mentioned in [issue 36](https://github.com/holiday-jp/holiday_jp-js/issues/36),
// calling `between` destroys the original `holidays` records.
/**
 * All the holidays
 * 
 * This is a reference to the original record defined in @holiday-jp/holiday_jp
 */
export const holidays: Readonly<Record<string, Holiday>> = holiday_jp.holidays