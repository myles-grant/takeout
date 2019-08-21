const stringNotEmpty = (string) => {
  return (string != null && string.length > 0 && string.replace(/\s/g, '').length > 0);
};

export default {


  regString(string, sanitize = true) {

    if (sanitize) {
      return string;
    }

    if (stringNotEmpty(string)) {
      return true;
    }

    return false;
  },

  alphabeticalString(string, sanitize = true) {

    if (sanitize) {
      return string.replace(/[^a-zA-Z ]/g, '');
    }

    if (stringNotEmpty(string)) {
      return true;
    }

    return false;
  },

  emailString(string, sanitize = true) {

    if (sanitize) {
      return string;
    }

    const exp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (stringNotEmpty(string) && (exp.test(string))) {
      return true;
    }

    return false;
  },

  passwordString(string, sanitize = true) {

    if (sanitize) {
      return string;
    }

    if (stringNotEmpty(string) && string.length > 6 && string.length <= 26) {
      return true;
    }
    
    return false;
  },

  phoneNumberString(string, sanitize = true) {

    if (sanitize) {
      return string.replace(/[^0-9]/g, '');
    }

    if (stringNotEmpty(string) && !(/[^0-9]/g.test(string)) && string.length > 6 && string.length <= 12) {
      return true;
    }

    return false;
  },

  numberString(string, sanitize = true) {

    if (sanitize) {
      return string.replace(/[^0-9.-]/g, '');
    }

    if (stringNotEmpty(string.toString()) && !(/[^0-9.-]/g.test(string))) {
      return true;
    }

    return false;
  },

  priceString(string, sanitize = true) {

    if (sanitize) {

      string = string.replace(/[^0-9.]/g, '');

      // const x = string.split('.');
      // if (parseInt(x[1]) < 10 && x[1].length == 1 && string.indexOf('.') >= 0) {
      //   string = string.concat('0');
      // } else if (string.indexOf('.') < 0) {
      //   string = string.concat('.00');
      // }

      return string;
    }

    if (stringNotEmpty(string.toString()) && !(/[^0-9.]/g.test(string))) {
      return true;
    }

    return false;
  },

  quantityString(string, sanitize = true) {
    
    if (sanitize) {
      return string.replace(/[^0-9]/g, '');
    }

    if (stringNotEmpty(string.toString()) && !(/[^0-9]/g.test(string))) {
      return true;
    }

    return false;
  },

  latlngString(string, sanitize = true) {

    if (sanitize) {
      return string.replace(/[^0-9.-]/g, '');
    }

    if (stringNotEmpty(string.toString()) && !(/[^0-9.-]/g.test(string)) && string != 0 && string != 0.00) {
      return true;
    }

    return false;
  },

  dateString(string, sanitize = true) {

    if (sanitize) {
      return string.replace(/[^0-9-]/g, '');
    }

    if (stringNotEmpty(string)) {
      return true;
    }

    return false;
  },

  parseTwoDigitInteger(n) {
    return n > 9 ? ''.concat(n) : '0'.concat(n);
  },

  getDishPriceFromJSONorders() {

  }
};
