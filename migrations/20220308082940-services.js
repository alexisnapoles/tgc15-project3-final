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
  return db.createTable('services', {
    id: {
      type: 'int',
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
    },
    name: {
      type: 'string',
      notNull: true,
      length: 100
    },
    cost_per_hour: {
      type: 'int',
      notNull: true
    },
    min_hours: {
      type: 'int',
      notNull: true
    },
    description: {
      type: 'text',
      length: 100
    },
    rating: {
      type: 'decimal',
    },
    date_of_posting: {
      type: 'datetime'
    }
  });
};

exports.down = function(db) {
  return db.dropTable('services');
};

exports._meta = {
  "version": 1
};
