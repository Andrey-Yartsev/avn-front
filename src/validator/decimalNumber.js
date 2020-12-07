const decimalNumber = {
  getMessage: () => "Required two numbers past the decimal",
  validate: value => {
    const m = value.toString().match(/^\d+\.(\d+)?$/);
    if (!m) {
      return true;
    }
    return m[1].length === 2;
  }
};

export default decimalNumber;
