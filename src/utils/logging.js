import request from "./tokenRequest";

export const log = ({
  message = "",
  logData = null,
  logger = "default",
  level = "debug"
}) => {
  const data = {
    message,
    context: {
      ...logData,
      logger: `avn.${logger}`,
      time: +new Date()
    },
    level
  };

  // console.log("log", data);

  return request("log", { method: "POST", data }).then(resp => resp.data);
};

export const logDebug = ({
  message = "",
  logData = null,
  logger = "default"
}) => {
  return log({ message, logData, logger, level: "debug" });
};

export const logError = ({
  message = "",
  logData = null,
  logger = "default"
}) => {
  return log({ message, logData, logger, level: "error" });
};
