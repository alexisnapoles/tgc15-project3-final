'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('service_specs', {
    id: {
      type: 'int',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
    },
    work_details: {
      type: 'string',
      notNull: true,
      length: 100
    },
    num_work_hrs: {
      type: 'int',
      notNull: true,
      length: 10
    },
    num_bedrooms: {
      type: 'int',
      notNull: true,
      length: 10
    },
    num_bathrooms: {
      type: 'int',
      notNull: true,
      length: 10
    },
    num_devices: {
      type: 'int',
      notNull: true,
      length: 10
    },
    num_small_items: {
      type: 'int',
      notNull: true,
      length: 10
    },
    num_large_items: {
      type: 'int',
      notNull: true,
      length: 10
    },
    num_change_bulbs: {
      type: 'int',
      notNull: true,
      length: 10
    },
    num_new_lights: {
      type: 'int',
      notNull: true,
      length: 10
    },
    need_ladder: {
      type: 'boolean',
      notNull: true,
    },
    need_provision_fixtures: {
      type: 'boolean',
      notNull: true,
    },
    type_installation: {
      type: 'string',
      notNull: true,
      length: 10
    }
  });
};

exports.down = function(db) {
  return db.dropTable('service_specs');
};

exports._meta = {
  "version": 1
};
