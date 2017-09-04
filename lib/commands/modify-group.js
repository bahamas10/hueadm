var common = require('../common');

module.exports = modifyGroup;

function modifyGroup(subcmd, opts, args, cb) {
    var self = this;
    var finish = common.makeFinisher(opts, cb);
    var data;

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    var id = parseInt(args.shift(), 10);

    if (isNaN(id)) {
        cb(new Error('`id` argument must be a number'));
        return;
    }

    try {
        data = common.kvToObj(args, {allowStdin: true});
    } catch (e) {
        cb(e);
        return;
    }
    if (data.lights && typeof(data.light) === 'string') {
        data.lights = data.lights.split(',');
    }

    self.debug('modifyGroup(%d, %j)', id, data);

    self.client.modifyGroup(id, data, finish);
}

modifyGroup.options = [
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
modifyGroup.help = 'Modify a light group\n\n{{options}}';
