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
    service_specifications_id: {
      type: 'int',
      unsigned: true,
      notNull: true, 
      foreignKey: {
        name:'service_specifications_id_fk',
        table: 'services',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    thumbnail: {
      type: 'string',
      length: 100,
      notNull: true
    },
    min_hours: {
      type: 'int',
      notNull: true
    },
    rating: {
      type: 'decimal',
    },
    description: {
      type: 'text',
      length: 100
    },
    cost_per_hour: {
      type: 'int',
      notNull: true
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
