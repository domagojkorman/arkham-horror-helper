import Application from 'arkham-horror-helper/app';
import config from 'arkham-horror-helper/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
