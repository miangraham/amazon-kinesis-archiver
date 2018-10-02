var OK = 0;
var ERROR = -1;

var getArgSafe = function(index) {
    if (process.argv.length >= index + 1) {
        return process.argv[index];
    } else {
        return undefined;
    }
}

var failArgSafe = function(index, label) {
    var v = getArgSafe(index);
    if (!v && v !== "") {
        console.error("You must provide a value for " + label);
        process.exit(ERROR);
    } else {
        return v;
    }
}

// mandatory arguments are region, stream, partition key and sequenceStart
if (process.argv.length < 9) {
    console
        .error("You must provide the region name, stream name, partition key and sequence number to query the stream archive");
    process.exit(ERROR);
} else {
    var sourceStreamName = failArgSafe(2);
    var targetStreamName = failArgSafe(3);
    var sequenceStart = failArgSafe(4);
    var lastUpdateDateStart = getArgSafe(5);
    var approximateArrivalStart = getArgSafe(6);
    var recordLimit = getArgSafe(7);
    var includeReinjectMetadata = getArgSafe(8);
    var metadataSeparator = getArgSafe(9);
    var threads = getArgSafe(10);

    var q = require('../lib/archive-access')(regionName);

    q.reinjectWithScan(sourceStreamName, targetStreamName, sequenceStart, lastUpdateDateStart, approximateArrivalStart, recordLimit, includeReinjectMetadata, metadataSeparator, threads, function(err) {
        if (err) {
            console.error(err);
            process.exit(ERROR);
        } else {
            process.exit(OK);
        }
    });
}