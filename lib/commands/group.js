var common = require('../common');

module.exports = group;

function group(subcmd, opts, args, cb) {
    var self = this;

    var finish = common.makeFinisher(opts, cb);

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }
    var id = parseInt(args.shift(), 10);

    if (isNaN(id)) {
        cb(new Error('`id` argument must be a number'));
        return;
    }

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
