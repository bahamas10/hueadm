var common = require('../common');

module.exports = user;

function user(subcmd, opts, args, cb) {
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

    self.client.config(function (err, data) {
        if (err) {
            cb(err);
            return;
        }

        var user = data.whitelist[id];

        if (!user) {
            err = new Error('failed to find user: ' + id);
        }

        finish(err, user);
    });
}

user.options = [
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

user.help = 'Show a user\n\n{{options}}';
