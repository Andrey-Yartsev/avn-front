export const formatToPDT = date => {
  return new Date(date).toLocaleString("en-US", {
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
