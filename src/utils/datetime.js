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
