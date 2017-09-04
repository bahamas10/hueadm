var common = require('../common');

module.exports = deleteGroup;

function deleteGroup(subcmd, opts, args, cb) {
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

    self.debug('deleteGroup(%j)', id);

    self.client.deleteGroup(id, finish);
}

deleteGroup.options = [
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
deleteGroup.help = 'Delete a light group\n\n{{options}}';
