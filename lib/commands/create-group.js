var common = require('../common');

module.exports = createGroup;

function createGroup(subcmd, opts, args, cb) {
    var self = this;

    var data;
    var finish = common.makeFinisher(opts, cb);

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    try {
        data = common.kvToObj(args, {allowStdin: true});
    } catch (e) {
        cb(e);
        return;
    }

    if (data.lights && typeof(data.lights) === 'string') {
        data.lights = data.lights.split(',');
    }

    self.debug('createGroup(%j)', data);

    self.client.createGroup(data, finish);
}

createGroup.options = [
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
createGroup.help = 'Create a light group\n\n{{options}}';
