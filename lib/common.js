var fs = require('fs');
var util = require('util');

var autocast = require('autocast');
var csscolors = require('css-color-names');
var deepmerge = require('deepmerge');
var mired = require('mired');
var rgb2hsl = require('color-convert').rgb.hsl;
var yaml = require('yamljs');
var verror = require('verror');

module.exports.getCliTableOptions = getCliTableOptions;
module.exports.kvToObj = kvToObj;
module.exports.filterArrayByKv = filterArrayByKv;
module.exports.human = human;
module.exports.hex2rgb = hex2rgb;
module.exports.createLightState = createLightState;
module.exports.makeFinisher = makeFinisher;

/*
 * take some basic information and return node-cmdln options suitable for
 * tabula
 *
 * @param {String} (optional) opts.columnDefault Default value for `-o`
 * @param {String} (optional) opts.sortDefault Default value for `-s`
 * @param {String} (optional) opts.includeLong Include `-l` option
 * @return {Array} Array of cmdln options objects
 *
 * taken from https://github.com/joyent/node-triton/blob/master/lib/common.js
 */
function getCliTableOptions(opts) {
    opts = opts || {};

    var o;

    // construct the options object
    var tOpts = [];

    // header
    tOpts.push({
        group: 'Output options'
    });

    // -H
    tOpts.push({
        names: ['H'],
        type: 'bool',
        help: 'Omit table header row.'
    });

    // -o field1,field2,...
    o = {
        names: ['o'],
        type: 'string',
        help: 'Specify fields (columns) to output.',
        helpArg: 'field1,...'
    };
    if (opts.columnsDefault) {
        o.default = opts.columnsDefault;
    }
    tOpts.push(o);

    // -l, --long
    if (opts.includeLong) {
        tOpts.push({
            names: ['long', 'l'],
            type: 'bool',
            help: 'Long/wider output. Ignored if "-o ..." is used.'
        });
    }

    // -s field1,field2,...
    o = {
        names: ['s'],
        type: 'string',
        help: 'Sort on the given fields.',
        helpArg: 'field1,...'
    };
    if (opts.sortDefault) {
        o.default = opts.sortDefault;
        o.help = util.format('%s Default is "%s".', o.help, opts.sortDefault);
    }
    tOpts.push(o);

    // -j, --json
    tOpts.push({
        names: ['json', 'j'],
        type: 'bool',
        help: 'JSON output.'
    });

    return tOpts;
}

/**
 * given an array of key=value pairs, break them into an object
 *
 * @param {Array} kvs - an array of key=value pairs
 *
 * taken from https://github.com/joyent/node-triton/blob/master/lib/common.js
 */
function kvToObj(kvs, opts) {
    opts = opts || {};

    // short-circuit here if stdin is allowed and `-` is passed as the first
    // argument
    if (opts.allowStdin && kvs[0] === '-') {
        return JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
    }

    var o = {};
    for (var i = 0; i < kvs.length; i++) {
        var kv = kvs[i];
        var idx = kv.indexOf('=');
        if (idx === -1) {
            throw new Error(util.format(
                'invalid filter: "%s" (must be of the form "field=value")',
                kv));
        }
        var k = kv.slice(0, idx);
        var v = kv.slice(idx + 1);
        if (opts.autocast) {
            v = autocast(v);
        }

        var keys = k.split('.');
        var key;
        var _o = o;
        for (var j = 0; j < keys.length - 1; j++) {
            key = keys[j];
            _o[key] = _o[key] || {};
            _o = _o[key];
        }

        key = keys[keys.length - 1];
        if (_o[key] === undefined) {
            _o[key] = v;
        } else if (Array.isArray(_o[key])) {
            _o[key].push(v);
        } else {
            _o[key] = [_o[key], v];
        }
    }
    return o;
}

/**
 * filter an array of objects by passing in a key/value set created by
 * kvToObj
 */
function filterArrayByKv(arr, kvs) {
    // filter based on listOpts
    var filters = Object.keys(kvs);

    return arr.filter(function (o) {
        for (var i = 0; i < filters.length; i++) {
            var key = filters[i];
            if (o[key] !== kvs[key]) {
                return false;
            }
        }
        return true;
    });
}

/**
 * human time
 */
function human(seconds) {
    if (seconds instanceof Date) {
        seconds = Math.round((Date.now() - seconds) / 1000);
    }
    seconds = Math.abs(seconds);

    var times = [
        seconds / 60 / 60 / 24 / 365, // years
        seconds / 60 / 60 / 24 / 7,   // weeks
        seconds / 60 / 60 / 24,       // days
        seconds / 60 / 60,            // hours
        seconds / 60,                 // minutes
        seconds                       // seconds
    ];
    var names = ['y', 'w', 'd', 'h', 'm', 's'];

    for (var i = 0; i < names.length; i++) {
        var time = Math.floor(times[i]);
        if (time > 0) {
            return util.format('%d%s', time, names[i]);
        }
    }
    return '0s';
}

// convert a 3 or 6 character hex string to rgb
function hex2rgb(hex) {
    var r, g, b;

    if (hex[0] === '#') {
        hex = hex.slice(1);
    }

    switch (hex.length) {
    case 3:
        r = todec(hex[0], hex[0]);
        g = todec(hex[1], hex[1]);
        b = todec(hex[2], hex[2]);
        break;
    case 6:
        r = todec(hex[0], hex[1]);
        g = todec(hex[2], hex[3]);
        b = todec(hex[4], hex[5]);
        break;
    default:
        throw new Error('invalid hex');
    }

    return [r, g, b];

    function todec(h, i) {
        return parseInt(h + '' + i, 16);
    }
}

// create a light state object with opts
function createLightState(args, state = null) {
    // create a light state object if it isn't provided
    state = state ?? {
        on: true
    };

    var command = args.shift();

    var match;
    if (command === 'on') {
        state.on = true;
    } else if (command === 'off') {
        state.on = false;
    } else if (command === 'toggle') {
        state.on = !state.on
    } else if (command === 'clear') {
        state.alert = 'none';
        state.effect = 'none';
    } else if (command === 'reset') {
        state.alert = 'none';
        state.effect = 'none';
        state.ct = Math.round(mired.kelvinToMired(2700));
        state.bri = 254;
    } else if (command === 'select') {
        state.alert = 'select';
    } else if (command === 'lselect') {
        state.alert = 'lselect';
    } else if (command === 'colorloop') {
        state.effect = 'colorloop';
    } else if (command === '-') {
        state = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
    } else if ((match = command.match(/^([-+=])([0-9]+)(%?)$/))) {
        var op = match[1];
        var num = parseInt(match[2], 10);
        var perc = match[3];

        if (perc) {
            num = Math.round(num * (254 / 100));
        }

        switch (op) {
        case '=':
            state.bri = num;
            break;
        case '-':
            state.bri_inc = -num;
            break;
        case '+':
            state.bri_inc = num;
            break;
        }
    } else if ((match = command.match(/^([0-9]+)[kK]$/))) {
        var kelvin = +match[1];
        var ct = mired.kelvinToMired(kelvin);
        state.ct = Math.round(ct);
    }
    else if ((match = command.match(/^\bscene=\b(.*)$/))) {
        var sceneId = match[1];
        state = { "scene": sceneId };
    } else {
        var hex = csscolors[command];

        if (!hex) {
            match = command.match(/^#?(([0-9A-Fa-f]{3})|([0-9A-Fa-f]{6}))$/);
            if (!match) {
                return new Error('failed to parse command');
            }
            hex = match[1];
        }
        var rgb = hex2rgb(hex);
        var hsl = rgb2hsl(rgb);
        state.hue = Math.round(hsl[0] / 360 * 65535);
        state.sat = Math.round(hsl[1] / 100 * 254);
        state.bri = Math.round(hsl[2] / 100 * 254);
    }

    // parse extra options to merge into the state object
    var extraOpts;
    try {
        extraOpts = kvToObj(args, {autocast: true});
    } catch (e) {
        return e;
    }

    return deepmerge(state, extraOpts);
}

/*
 * Create a callback function fit for use by most commands
 * that prints output in either yaml or json format
 */
function makeFinisher(opts, cb) {
    function finish(err, result) {
        if (err) {
            cb(err);
            return;
        }

        var errors = [];
        var s;

        if (opts.json) {
            s = JSON.stringify(result, null, 2);
        } else {
            s = yaml.stringify(result);
        }

        // if the result is an array of objects, check for any errors
        if (Array.isArray(result)) {
            result.forEach(function (res) {
                if (typeof(res) !== 'object')
                    return;

                if (!res.hasOwnProperty('error'))
                    return;

                var error = new Error(res.error.description);
                error.type = res.error.type;
                error.address = res.error.address;

                errors.push(error);
            });
        }

        console.log(s);

        cb(verror.errorFromList(errors));
    }

    return finish;
}
