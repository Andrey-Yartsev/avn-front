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
import moment from "moment";

export const fromNow = time => {
  const today = moment();
  const day = moment(time);

  if (today.diff(day) / 1000 / 60 / 60 < 24) {
    return day.fromNow();
  }

  if (today.isSame(day, "year")) {
    return day.format("MMMM D");
  }

  return day.format("LL");
};

export default {};
