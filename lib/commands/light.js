var common = require('../common');

module.exports = light;

function light(subcmd, opts, args, cb) {
    var self = this;
    var finish = common.makeFinisher(opts, cb);

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    var id = parseInt(args.shift(), 10);

    if (isNaN(id)) {
        cb(new Error('first argument must be a number'));
        return;
    }

    // get light information only
    if (args.length === 0) {
        self.client.light(id, finish);
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
