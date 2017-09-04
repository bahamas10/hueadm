var common = require('../common');

module.exports = modifyScene;

function modifyScene(subcmd, opts, args, cb) {
    var self = this;

    var data;
    var finish = common.makeFinisher(opts, cb);

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    var id = args.shift();

    if (!id) {
        cb(new Error('first argument must be supplied'));
        return;
    }

    try {
        data = common.kvToObj(args, {allowStdin: true});
    } catch (e) {
        cb(e);
        return;
    }

    self.debug('modifyScene(%d, %j)', id, data);

    self.client.modifyScene(id, data, finish);
}

modifyScene.options = [
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
modifyScene.help = 'Modify a scene\n\n{{options}}';
