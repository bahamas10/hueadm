var common = require('../common');

module.exports = deleteScene;

function deleteScene(subcmd, opts, args, cb) {
    var self = this;

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

    self.client.deleteScene(id, finish);
}

deleteScene.options = [
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
deleteScene.help = 'Delete a scene\n\n{{options}}';
