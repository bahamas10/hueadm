var common = require('../common');

module.exports = deleteUser;

function deleteUser(subcmd, opts, args, cb) {
    var self = this;
    var finish = common.makeFinisher(opts, cb);

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    var id = args.shift();

    if (!id) {
        cb(new Error('`id` argument must be a string'));
        return;
    }

    self.debug('deleteUser(%j)', id);

    self.client.deleteUser(id, finish);
}

deleteUser.options = [
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
deleteUser.help = 'Delete a user\n\n{{options}}';
