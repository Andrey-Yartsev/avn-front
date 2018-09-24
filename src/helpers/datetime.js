export default time => {
  var date = new Date(time),
    locale = "en-us",
    today = new Date(),
    day = ("00" + date.getDate()).slice(-2),
    // month = ('00' + (date.getMonth() + 1)).slice(-2),
    month = date.toLocaleString(locale, { month: "short" }),
    year = date.getFullYear(),
    // hour = ('00' + date.getHours()).slice(-2),
    hours = date.getHours(),
    minute = ("00" + date.getMinutes()).slice(-2);

  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  var dayToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  var result = hours + ":" + minute + " " + ampm;
  if (dayToday.getTime() > date.getTime()) {
    //TODO can be perfected
    // result = month + dateDelimiter + day + dateDelimiter + year + dateAndHourDelimiter + result;
    result = month + " " + day + ", " + year + " " + result;
  }
  return result;
};
