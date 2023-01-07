import { between } from "holiday-jp-dayjs";

const days = between(
    new Date('2010-09-14T00:00+0900'), 
    new Date('2010-09-21T00:00+0900'),
)
console.log(days[0].name) // 敬老の日