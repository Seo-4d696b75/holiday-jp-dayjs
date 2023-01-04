import { Holiday, holidays } from "@holiday-jp/holiday_jp";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
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


function formatFn(timezone: string): ((arg: DateLike) => string) {
  return (arg) => dayjs(arg).tz(timezone).format("YYYY-MM-DD")
}

/**
 * Checks whether the given date is holiday in Japan.
 * 
 * The given date will be formatted in "YYYY-MM-DD" with "Asia/Tokyo"(+0900) timezone,
 * then used as key value in searching for holidays.
 * 
 * @param date A Date-like value to be checked
 * @returns True if the given date is holiday otherwise false
 */
export const isHoliday = isHolidayFn("Asia/Tokyo")

/**
 * Creates a new function which checks the given date is holiday in Japan.
 * 
 * The difference with {@link isHoliday} is that; 
 * the given date will be formatted in "YYYY-MM-DD" with the specified timezone before searching.
 * 
 * @param timezone Which timezone the given date should be converted in
 * @returns True if the given date is holiday otherwise false
 */
export function isHolidayFn(timezone: string): (date: DateLike) => boolean {
  const format = formatFn(timezone)
  return (arg) => {
    const key = format(arg)
    if (holidays[key]) {
      return true
    }
    return false
  }
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