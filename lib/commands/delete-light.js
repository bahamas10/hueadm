var common = require('../common');

module.exports = deleteLight;

function deleteLight(subcmd, opts, args, cb) {
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

    self.client.deleteLight(id, finish);
}

deleteLight.options = [
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
deleteLight.help = 'Delete a light\n\n{{options}}';
