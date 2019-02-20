var assert = require('assert-plus');
var common = require('../common');

module.exports = createScene;

function createScene(subcmd, opts, args, cb) {
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

    assert.object(data, 'data');

    if (data.lights && typeof (data.lights) === 'string') {
        data.lights = data.lights.split(',');
    }

    switch (data.recycle) {
    case 'true':
        data.recycle = true;
        break;
    case 'false':
        data.recycle = false;
        break;
    }

    assert.optionalArray(data.lights, 'data.lights');
    assert.optionalBool(data.recycle, 'data.recycle');

    self.debug('createScene(%j)', data);

    self.client.createScene(data, finish);
}

createScene.options = [
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
createScene.help = 'Create a scene\n\n{{options}}';
