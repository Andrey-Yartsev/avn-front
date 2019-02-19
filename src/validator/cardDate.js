let currentValue = {};

const cardDateValidator = {
  getMessage() {
    if (!currentValue.expMonth) {
      return "Month is required";
    }
    if (!currentValue.expYear) {
      return "Year is required";
    }
    if (currentValue.expMonth.length !== 2) {
      return "Month must be 2 characters";
    }
    if (currentValue.expYear.length !== 4) {
      return "Year must be 4 characters";
    }
    return "Date must be greater then current";
  },
  validate(value) {
    currentValue = value;
    if (!value || !value.expYear || !value.expMonth) {
      return false;
    }
    if (value.expMonth.length !== 2) {
      return false;
    }
    if (value.expYear.length !== 4) {
      return false;
    }
    const date = new Date(value.expYear, value.expMonth, 1, 0, 0, 0, 0);
    return date > new Date();
  }
};

export default cardDateValidator;
