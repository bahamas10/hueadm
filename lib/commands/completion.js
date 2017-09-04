module.exports = completion;

function completion(subcmd, opts, args, cb) {
    var self = this;

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    console.log(self.bashCompletion());
    cb();
}

completion.options = [
    {
        names: ['help', 'h'],
        type: 'bool',
        help: 'Show this help.'
    }
];

completion.help = 'Output Bash completion code\n\n{{options}}';
completion.hidden = true;
