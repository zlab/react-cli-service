#!/usr/bin/env node

const { error } = require('@vue/cli-shared-utils');
const { enableEslint, enableTypescript } = require('../utils');

const config = require('path').resolve(process.cwd(), 'react.config.js');

process.env.VUE_CLI_SERVICE_CONFIG_PATH = config;

const idToPlugin = id => ({ id, apply: require(id) });

const plugins = [idToPlugin('@vue/cli-plugin-babel')];

enableEslint && plugins.push(idToPlugin('@vue/cli-plugin-eslint'));
enableTypescript && plugins.push(idToPlugin('@vue/cli-plugin-typescript'));

plugins.push({
  id: '@vue/cli-plugin-react',
  apply: require('../'),
});

const Service = require('@vue/cli-service');
const service = new Service(process.cwd(), { plugins });

const rawArgv = process.argv.slice(2);
const args = require('minimist')(rawArgv);
const command = args._[0];

service.run(command, args, rawArgv).catch(err => {
  error(err);
  process.exit(1);
});
