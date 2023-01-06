# holiday-jp-dayjs

![npm version](https://img.shields.io/npm/v/holiday-jp-dayjs)
![npm license](https://img.shields.io/npm/l/holiday-jp-dayjs)
![test workflow](https://github.com/Seo-4d696b75/holiday-jp-dayjs/actions/workflows/test.yaml/badge.svg)

Wrapper of [@holiday-jp/holiday_jp](https://www.npmjs.com/package/@holiday-jp/holiday_jp) with [Day.js](https://day.js.org/en/)

# 1. Features

✅ Gets holidays in Japan utilizing [@holiday-jp/holiday_jp](https://www.npmjs.com/package/@holiday-jp/holiday_j)  
✅ Checks the given date in fixed timezone "Asia/Tokyo", independent of running environment  
✅ Fixes [bug of function: `between`](https://github.com/holiday-jp/holiday_jp-js/issues/36)  
❌ Unable to load specific years only, but all the years automatically

# 2. Install & Usage

### In HTML

```html
<script src="https://cdn.jsdelivr.net/npm/holiday-jp-dayjs@^0.0.4/umd/min.js"></script>
<script>
    let date = new Date("2010-09-20T00:00+0900")
    console.log(holiday_jp_dayjs.isHoliday(date)); // true; 敬老の日
</script>
```

### In Node

```bash
npm install holiday-jp-dayjs
```

```ts
import { between } from "holiday-jp-dayjs";

const days = between(
    new Date('2010-09-14T00:00+0900'), 
    new Date('2010-09-21T00:00+0900'),
)
console.log(days[0].name) // 敬老の日
```

# 3. Motivation

### Timezone Affected

The original implementation of [@holiday-jp/holiday_jp](https://www.npmjs.com/package/@holiday-jp/holiday_j) is affected by timezone. When run on an environment in timezone except "Asia/Tokyo", output may be ambiguous 😵

The following simple code runs as expected in "Asia/Tokyo". But in other timezone, for example "UTC", the result is `false` because its local date-time is "2021-12-31T15:00:00+0000". What we want to know is whether the given datetime is holiday is Japan, not in UTC 🤣 

```js
import { isHoliday } from "@holiday-jp/holiday_jp"

let date = new Date("2022-01-01T00:00:00+0900")
isHoliday(date) // expected true, as "New Year's Day"
```

### Fixed Timezone

In this library, all the date values are manipulated in "Asia/Tokyo" using [Day.js](https://day.js.org/en/), which is light and modern date-operation library 👍

# 4. Update

This library uses [data file of all the holiday](https://github.com/holiday-jp/holiday_jp-js/blob/master/lib/holidays.js) provided by @holiday-jp/holiday_jp. [GithubAction workflow](https://github.com/Seo-4d696b75/holiday-jp-dayjs/actions?query=workflow%3Aupdate-dependencies) runs periodically and checks updates of dependencies including @holiday-jp/holiday_jp.  

[workflow file](./.github/workflows/update.yaml)  

1. Check update of dependencies
2. Publish PR if any update 
3. Build & Publish to npm when PR merged
