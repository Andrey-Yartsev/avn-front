const validateIPaddress = ipaddress => {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    )
  ) {
    return true;
  }
  return false;
};

const ips = {
  getMessage: field => "The " + field + " value is not valid IPs",
  validate: value => {
    if (!value) {
      return true;
    }
    const ips = value.split(",").map(v => v.trim());
    return ips.every(ip => {
      return validateIPaddress(ip);
    });
  }
};

export default ips;
