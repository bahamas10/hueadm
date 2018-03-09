var f = require('util').format

var common = require('../common');

module.exports = group;

function group(subcmd, opts, args, cb) {
    var self = this;

    var finish = common.makeFinisher(opts, cb);

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    var arg = args.shift();
    if (arg === undefined) {
        finish(new Error('group name or id must be supplied'));
        return;
    }

    var id = parseInt(arg, 10);
    if (!isNaN(id)) {
        doGroup(id);
        return;
    }

    // we have a group name, try to resolve it.
    self.client.groups(function (err, data) {
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
        var matchingGroups = Object.keys(data).map(function (id) {
            idMap[data[id].name] = id;
            return data[id];
        }).filter(function (group) {
            return group.name === arg;
        });

        switch (matchingGroups.length) {
        case 0:
            finish(new Error(f('No group "%s" found', arg)));
            break;
        case 1:
            doGroup(idMap[matchingGroups[0].name]);
            break;
        default:
            finish(new Error(f('Multiple groups "%s" found', arg)));
            break;
        }
    });

    function doGroup(id) {
        // get group information only
        if (args.length === 0) {
            self.client.group(id, finish);
            return;
        }

        // create a light state object
        var state = common.createLightState(args);
        if (state instanceof Error) {
            cb(state);
            return;
        }

        self.debug('setGroupState(%d, %j)', id, state);

        self.client.setGroupState(id, state, finish);
    }
}

group.options = [
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
group.help = 'Show/set a light group\n\n{{options}}';

group.interspersedOptions = false;
