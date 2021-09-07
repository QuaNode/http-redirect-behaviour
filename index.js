/*jslint node: true*/
'use strict';

var delegator = require('beamjs').delegator;
var backend = require('beamjs').backend();
var behaviour = backend.behaviour();
var {
    URL
} = require('url');

module.exports = function (options) {

    if (!options) throw new Error('Invalid options');
    if (!Array.isArray(options)) options = [options];
    return options.reduce(function (behaviours, behaviour_options) {

        if (typeof behaviour_options !== 'object')
            throw new Error('Invalid options');
        if (typeof behaviour_options.name !== 'string' ||
            behaviour_options.name.length === 0)
            throw new Error('Invalid behaviour name');
        if (typeof behaviour_options.destination !== 'string' ||
            behaviour_options.destination.length === 0)
            throw new Error('Invalid behaviour destination');
        if (behaviour_options.host !== undefined &&
            (typeof behaviour_options.host !== 'string' ||
                behaviour_options.host.length === 0))
            throw new Error('Invalid behaviour host');
        behaviours[behaviour_options.name] = behaviour({

            name: behaviour_options.name,
            version: behaviour_options.version || '1',
            path: behaviour_options.path || '/',
            host: behaviour_options.host,
            queue: behaviour_options.queue || function (name, parameters) {

                return name + ' ' + parameters.url;
            },
            parameters: {

                url: {

                    key: 'url',
                    type: 'middleware'
                }
            },
            plugin: delegator('url')
        }, function (init) {

            return function () {

                var self = init.apply(this, arguments).self();
                self.begin('ModelObjectMapping', function (key, businessController, operation) {

                    operation.callback(function (response) {

                        response.url = new URL(self.parameters.url, behaviour_options.destination).href;
                    }).apply();
                });
            };
        });
        return behaviours;
    }, {});
};