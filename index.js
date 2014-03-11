/*global require,console,process,module*/
var parseResult,
    output = {};
(function () {
    'use strict';
    var fs = require('fs'),
        SPECJSONReporter;

    function getCurrentOutputPointer(suite) {
        var current = output,
            i;
        for (i = 0; i < suite.length; i += 1) {
            if (current[suite[i]] === undefined) {
                current[suite[i]] = {};
            }
            current = current[suite[i]];
        }
        return current;
    }

    parseResult = function (result) {
        var testStatus = result.success ? 'PASSED' : 'FAILED',
            current = getCurrentOutputPointer(result.suite);
        current[result.description] = testStatus;
    };


    SPECJSONReporter = function (baseReporterDecorator, config) {
        baseReporterDecorator(this);

        this.onSpecComplete = function (browser, result) {
            parseResult(result, browser);
        };

        this.onRunComplete = function () {
            if (config.outputFile) {
                fs.writeFile(config.outputFile, JSON.stringify(output, null, 4), function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("JSON file was written to " + config.outputFile);
                    }
                });
            } else {
                process.stdout.write(JSON.stringify(output));
            }
        };
    };

    SPECJSONReporter.$inject = ['baseReporterDecorator', 'config.specjsonReporter'];

    module.exports = {
        'reporter:specjson': ['type', SPECJSONReporter]
    };
}());
