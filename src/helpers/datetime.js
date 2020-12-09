export const toHumanDuration = duration => {
  let hours, minutes, result;
  if (3600 <= duration) {
    hours = Math.floor(duration / 3600);
    result = hours + " h";
  } else if (60 <= duration) {
    minutes = Math.ceil(duration / 60);
    result = minutes + " min";
  } else {
    result = duration + " sec";
  }
  return result;
};
import {
  format,
  differenceInMilliseconds,
  formatDistanceToNow,
  isSameYear
} from "date-fns";

export const fromNow = time => {
  const today = new Date();
  let day = new Date(time);
  if (day.toString() === "Invalid Date") {
    day = new Date();
  }

  if (Math.abs(differenceInMilliseconds(today, day)) / 1000 / 60 / 60 < 24) {
    return formatDistanceToNow(day, { addSuffix: true, includeSeconds: false });
  }

  if (isSameYear(new Date(), day)) {
    return format(day, "MMMM d");
  }

  return format(day, "MMMM d yyyy");
};

export default {};
