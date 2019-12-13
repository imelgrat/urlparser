/**
 * Parse URL using a format string as capture pattern
 *
 * @param {String} format The format of the URL
 * @param {String} url The URL to be parsed
 * @throws {TypeError} Will throw an error if there's a problem with either the format or the URL strings.
 * @return {Array} An array with the parsed variables and parameters
 */
function urlParser(format, url) {
    const isString = require('lodash/isString');
    const split = require('lodash/split');
    const startsWith = require('lodash/startsWith');
    const reduce = require('lodash/reduce');
    const set = require('lodash/set');

    let formatParts, urlParts, hash = {};

    // Verify that format and URL strings were provided
    if (!isString(format) || format.length === 0) {
        throw new TypeError('You must provide a format string');
    }

    if (!isString(url) || url.length === 0) {
        throw new TypeError('You must provide a URL');
    }

    // Parse format string (and check whether each part should be considered a variable)
    formatParts = split(format, '/').map((part) => {
        return { name: part.substring(1), isVariable: startsWith(part, ':') };
    });

    // Parse URL (leaving out potential parameters)
    urlParts = url.includes('?') ? split(url.substring(0, url.indexOf('?')), '/') : split(url, '/');

    // Not really required as URL is guaranteed to comply with the provided format
    if (formatParts.length !== urlParts.length) {
        throw new TypeError('The URL does not match the format string');
    }

    // Generate hash
    hash = reduce(formatParts, (result, part, index) => {
        if (part.isVariable) {
            set(result, part.name, urlParts[index]);
        }
        return result;
    }, {});

    // Add any potential URL parameters to hash
    if (url.includes('?')) {
        split(url.substring(url.indexOf('?') + 1), '&').map((param) => {
            const [varName, value] = split(param, '=');
            set(hash, varName, value);
        });
    }

    return hash;
}
module.exports = {
    urlParser: urlParser
}