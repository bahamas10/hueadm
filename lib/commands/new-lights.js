var tabula = require('tabula');

var common = require('../common');

var columns = 'id,name,lastscan';

// sort default with -s
var sortDefault = 'id';

module.exports = newLights;

function newLights(subcmd, opts, args, cb) {
    var self = this;

    if (opts.help) {
        self.do_help('help', {}, [subcmd], cb);
        return;
    }

    if (opts.o) {
        columns = opts.o;
    }
    columns = columns.split(',');

    var sort = opts.s.split(',');

    var listOpts;
    try {
        listOpts = common.kvToObj(args);
    } catch (e) {
        cb(e);
        return;
    }

    self.client.newLights(function(err, data) {
        if (err) {
            cb(err);
            return;
        }

        if (opts.json) {
            console.log(JSON.stringify(data, null, 2));
            cb();
            return;
        }

        // convert lights data into array
        var d = [];
        var ls = common.human(new Date(data.lastscan));
        Object.keys(data).forEach(function (id) {
            if (id === 'lastscan')
                return;

            var o = data[id];
            o.id = id;
            o.lastscan = ls;
            d.push(o);
        });

        // filter based on listOpts
        d = common.filterArrayByKv(d, listOpts);

        // print the data
        tabula(d, {
            skipHeader: opts.H,
            columns: columns,
            sort: sort
        });

        cb();
    });
}

newLights.options = [
    {
        names: ['help', 'h'],
        type: 'bool',
        help: 'Show this help.'
    }
].concat(common.getCliTableOptions({
    sortDefault: sortDefault
}));

newLights.help = 'Show new lights\n\n{{options}}';
