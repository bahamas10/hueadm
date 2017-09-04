var common = require('../common');

module.exports = createSchedule;

function createSchedule(subcmd, opts, args, cb) {
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

    self.debug('createSchedule(%j)', data);

    self.client.createSchedule(data, finish);
}

createSchedule.options = [
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
createSchedule.help = 'Create a schedule\n\n{{options}}';
