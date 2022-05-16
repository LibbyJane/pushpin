const isNonEmptyString = (value) => {
    if (typeof value !== 'string') {
        return false;
    }

    if (value.length === 0) {
        return false;
    }

    return true;
}

const isNonEmptyArray = (value) => {
    if (typeof value !== 'object') {
        return false;
    }

    if (!Array.isArray(value)) {
        return false;
    }

    if (value.length === 0) {
        return false;
    }

    return true;
}

const isPositiveInteger = (value) => {
    if (typeof value !== 'number') {
        return false;
    }

    if (value <= 0) {
        return false;
    }

    return true;
}

const allStringsInArrayAreNotEmpty = (itemArray, noSpaces = true) => {
    if (!Array.isArray(itemArray)) {
        return false;
    }

    const numItems = itemArray.length;
    if (numItems === 0) {
        return [];
    }

    const errors = [];

    for (let itemNo = 0; itemNo < numItems; itemNo++) {
        const item = itemArray[itemNo];
        if (!item.hasOwnProperty('name')) {
            errors.push(`Item at index ${itemNo} is missing name attribute`);
            continue;
        }

        if (!item.hasOwnProperty('value')) {
            errors.push(`Item at index ${itemNo} is missing value attribute`);
            continue;
        }

        const name = item.name;
        const value = item.value;

        if (!isNonEmptyString(value)) {
            errors.push(`${name} must be a valid string`);
            continue;
        }

        if (noSpaces) {
            if (value.indexOf(' ') >= 0) {
                errors.push(`${name} must not contain any spaces`);
                continue;
            }
        }
    }

    return errors;
}

const isEmailAddress = (email) => {
    if (!isNonEmptyString(email)) {
        return false;
    }

    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}

module.exports.isPositiveInteger = isPositiveInteger;
module.exports.isNonEmptyArray = isNonEmptyArray;
module.exports.isNonEmptyString = isNonEmptyString;
module.exports.allStringsInArrayAreNotEmpty = allStringsInArrayAreNotEmpty;
module.exports.isEmailAddress = isEmailAddress;