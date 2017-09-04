var common = require('../common');

module.exports = modifySchedule;

function modifySchedule(subcmd, opts, args, cb) {
    var self = this;

    var data;
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

    try {
        data = common.kvToObj(args, {allowStdin: true});
    } catch (e) {
        cb(e);
        return;
    }

    self.debug('modifySchedule(%d, %j)', id, data);

    self.client.modifySchedule(id, data, finish);
}

modifySchedule.options = [
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
modifySchedule.help = 'Modify a schedule\n\n{{options}}';
