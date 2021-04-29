var common = require('../common');

module.exports = light;

function light(subcmd, opts, args, cb) {
    var self = this;
    var finish = common.makeFinisher(opts, cb);

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    var arg = args.shift();
    if (arg === undefined) {
        finish(new Error('light name or id must be supplied'));
        return;
    }

    var id = parseInt(arg, 10);
    if (!isNaN(id)) {
        doLight(id);
        return;
    }

    // we have a light name, try to resolve it.
    self.client.lights(function (err, data) {
        if (err) {
            finish(err);
            return;
        }

        // data is in the form of id => data
        // ex: {
        //  1: {
        //    ..
        //  },
        var idMap = {};
        var matchingLights = Object.keys(data).map(function (id) {
            idMap[data[id].name] = id;
            return data[id];
        }).filter(function (light) {
            return light.name === arg;
        });

        switch (matchingLights.length) {
        case 0:
            finish(new Error(f('No light "%s" found', arg)));
            break;
        case 1:
            doLight(idMap[matchingLights[0].name]);
            break;
        default:
            finish(new Error(f('Multiple lights "%s" found', arg)));
            break;
        }
    });

    function doLight(id) {
        // get light information only
        if (args.length === 0) {
            self.client.light(id, finish);
            return;
        }

        if (args[0].match(/^\bscene=\b(.*)$/))
        {
            cb(new Error('Cannot recall a scene for a single light.'));
            return;
        }

        // create a light state object
        var state = common.createLightState(args);
        if (state instanceof Error) {
            cb(state);
            return;
        }

        self.debug('setLightState(%d, %j)', id, state);

        self.client.setLightState(id, state, finish);
    }
}

light.options = [
    {
        names: ['help', 'h'],
        type: 'bool',
        help: 'Show this help.'
    },
    {
        names: ['json', 'j'],
        type: 'bool',
        help: 'JSON output.'
    }
];
light.help = 'Show/set a light\n\n{{options}}';

light.interspersedOptions = false;
