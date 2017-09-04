var common = require('../common');

module.exports = request;

function request(subcmd, opts, args, cb) {
    var self = this;

    var finish = common.makeFinisher(opts, cb);

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    var endpoint = args.shift();

    if (!endpoint) {
        cb(new Error('endpoint must be specified as the first operand'));
        return;
    }

    var o = {
        method: opts.method,
        path: endpoint
    };

    try {
        o.data = common.kvToObj(args, {allowStdin: true, autocast: true});
    } catch (e) {
        cb(e);
        return;
    }

    self.debug('request(%j)', o);

    self.client.request(o, finish);
}

request.options = [
    {
        names: ['help', 'h'],
        type: 'bool',
        help: 'Show this help.'
    },
    {
        names: ['json', 'j'],
        type: 'bool',
        help: 'JSON Output.'
    },
    {
        names: ['method', 'X'],
        type: 'string',
        help: 'Show this help.',
        default: 'GET',
        helpArg: 'METHOD'
    }
];

request.help = 'Make a raw HTTP request\n\n{{options}}';
