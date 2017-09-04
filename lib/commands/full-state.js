var yaml = require('yamljs');

module.exports = fullstate;

function fullstate(subcmd, opts, args, cb) {
    var self = this;

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    self.client.fullState(function(err, data) {
        if (err) {
            cb(err);
            return;
        }
        var s;
        if (opts.json)
            s = JSON.stringify(data, null, 2);
        else
            s = yaml.stringify(data);

        console.log(s);
        cb();
    });
}

fullstate.options = [
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

fullstate.help = 'Show the hue bridge fullstate\n\n{{options}}';
