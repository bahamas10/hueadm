var common = require('../common');

module.exports = createSensor;

function createSensor(subcmd, opts, args, cb) {
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

    self.debug('createSensor(%j)', data);

    self.client.createSensor(data, finish);
}

createSensor.options = [
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
createSensor.help = 'Create a sensor\n\n{{options}}';
