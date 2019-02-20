var common = require('../common');

module.exports = recallScene;

function recallScene(subcmd, opts, args, cb) {
    var self = this;

    var finish = common.makeFinisher(opts, cb);

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    var sceneId = args.shift();

    if (!sceneId) {
        cb(new Error('Scene ID is required.'));
        return;
    }

    var groupId = args.shift();

    if (!groupId) {
        cb(new Error('Group ID is required'))
    }

    self.do_group('group', opts, [groupId, 'scene='+sceneId], cb)
}

recallScene.options = [
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
recallScene.help = 'Recalls a scene on a group\nUSAGE: hueadm recall-scene SCENEID GROUPID\n\n{{options}}';
