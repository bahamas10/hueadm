var util = require('util');

var hue = require('hue-sdk');

var common = require('../common');

var package = require('../../package.json');

module.exports = createUser;

function createUser(subcmd, opts, args, cb) {
    var self = this;

    var finish = common.makeFinisher(opts, cb);

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    var host = self.host;
    var user = args[0];

    if (!user) {
        cb(new Error('username must be supplied as the first operand'));
        return;
    }

    var name = util.format('%s#%s', package.name, user);

    console.log('sending request... press the link button on the hue bridge');

    hue.createUser(host, name, finish);
}

createUser.options = [
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

createUser.help = 'Create/register a new user\n\n{{options}}';

createUser.aliases = ['register'];
