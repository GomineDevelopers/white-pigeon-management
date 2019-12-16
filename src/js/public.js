//时间格式转换
export function timeFormat(time) {
  // 时间格式化 2019-09-08
  var datetime = new Date();
  datetime.setTime(time);
  var year = datetime.getFullYear();
  var month =
    datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  var day = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  return year + "-" + month + "-" + day;
}

//时间格式转换  2019-09-08 14：50：00
export function minutesTimeFormat(time) {
  var datetime = new Date();
  datetime.setTime(time);
  var year = datetime.getFullYear();
  var month =
    datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
  var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
  return year + "-" + month + "-" + date + "  " + hour + ":" + minute + ":" + "00";
}

// 设置结束时间为当前时间的后5分钟
export function endTime(time) {
  var startTime = new Date(time);
  endTime = new Date(startTime.valueOf() + 5 * 60 * 1000); // 当前时间加上5分钟
  return endTime;
}
