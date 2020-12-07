const nonAmex = {
  getMessage: () => "We are not supporting American Express cards",
  validate: value => {
    return !value.match(/^3[47][0-9]{13}$/);
  }
};

const cardDate = {
  getMessage: () => "Wrong card date expiration",
  validate: value => {
    const r = value.match(/^(\d\d)\/(\d\d)$/);
    if (!r) {
      return false;
    }
    if (r[1] > 12) {
      return false;
    }
    return true;
  }
};

const cardHolder = {
  getMessage: () => "Wrong chars",
  validate: value => {
    return !!value.match(/^[a-z\-'. ]+$/i);
  }
};

const latin = {
  getMessage: () => "Wrong chars",
  validate: value => {
    return !!value.match(/^[0-9a-z\-'., ]+$/i);
  }
};

export default { nonAmex, cardHolder, cardDate, latin };
