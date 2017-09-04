var common = require('../common');

module.exports = renameSensor;

function renameSensor(subcmd, opts, args, cb) {
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

    var name = args.shift();

    if (!name) {
        cb(new Error('second argument must be a string'));
        return;
    }

    self.debug('renameSensor(%d, %j)', id, name);

    self.client.renameSensor(id, name, finish);
}

renameSensor.options = [
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
renameSensor.help = 'Rename a sensor\n\n{{options}}';
