export const formatToPDT = date => {
  let newDate = new Date(date);
  // replace datetime string format "2020-07-31 07:00:00+00" to valid "2020-07-31T07:00:00+00:00";
  if (newDate.toString() === "Invalid Date" && typeof date === "string") {
    const formattedString = date.replace(" ", "T") + ":00";
    newDate = new Date(formattedString);
  }
  return newDate.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    hour12: true,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const monthsShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

// handle datetime string with format "2002-12-31" and "2002-12-31T11:30:00.000Z" and return "31 Dec 2002";
export const formatWithoutLocalization = str => {
  const [year, month, day] = str.split("T")[0].split("-");
  return `${day} ${monthsShort[month - 1]} ${year}`;
};
