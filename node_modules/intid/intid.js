
'use strict';

function generate(type, string, separator, characters) {

    var hourtime  = process.hrtime();
    var nanotime  = hourtime[0] * 1000000000 + hourtime[1];
    var intcreate = parseInt(nanotime.toString().replace('.', '0'));
    if (type != undefined &&  string !=  undefined && separator != undefined) {
        if ((characters != undefined) && Number(characters * 1)) {
            let intlimits = Number(characters * 1);
            let intlength = intcreate.toString().length - intlimits;
            intcreate = parseInt(intcreate.toString().substring(intlength));
        }
        if (type.toLowerCase() == 'prefix') {
            return string + separator + intcreate;
        }else if (type.toLowerCase() == 'suffix') {
            return intcreate + separator + string;
        }else{
            return string + separator + intcreate + separator + string;
        }
    }else{
        if (Number(type * 1)) {
            let intlimits = Number(type * 1);
            let intlength = intcreate.toString().length - intlimits;
            return parseInt(intcreate.toString().substring(intlength));
        }else{
            return intcreate;
        }
    }

}

module.exports = generate;
