var sql = {
	
	// THOUGHT could make this faster by caching the fields in an instance object, so we don't have 
	// to recalculate the SELECT args each time. Hmmm, where to put this....
	
	// TODO this should really be part of the models package
	
    create_table: function(connection, name, fields) {
        var exec = 'CREATE TABLE IF NOT EXISTS ' + name + '(';

        for (var i = 0; i < fields.length; i++) {
            exec += fields[i].name + ' ' + fields[i].type;
            if (i < fields.length - 1) {
                exec += ', ';
            }
        }
        exec += ')';
        connection.transaction(function(tx) {
            tx.executeSql(exec);
        }
        )
    },

	make_fields: function(model) {
		var fields = [];
        for (var i in model) {
            if (model[i] !== undefined && i !== '__meta__') {
                fields.push({
                    'name': i,
                    'type': "TEXT"
                })
            }
        }
		return fields;
	},
	
	get_fields: function(model) {
		var fields = [];
        for (var i in model) {
            if (model[i] !== undefined && i !== '__meta__') {
                fields.push(i);
            }
        }
		return fields;		
	},
	
	// TODO decide - connection, model or the other way around?
    create_table_from_model: function(model, connection) {
		var fields = this.make_fields(model);
        this.create_table(connection, model.__meta__.tableName, fields);
    },

	get_all_from_model: function(connection, model, callback) {
		var fields = this.get_fields(model);
		var arg = fields.join();
		connection.transaction(function(tx) {
			tx.executeSql('SELECT '+ arg +' FROM ' + model.__meta__.tableName, [], callback); // TODO what does [] do?
		});
	},

    insert: function(connection, table, fields, values) {
        connection.transaction(function(tx) {
            tx.executeSql('INSERT INTO ' + table + ' (' + fields + ') VALUES (' + values + ')');
        });
    },

    insert_from_model: function(connection, table, model) {
        var fields = '';
        var values = '';
        var first = true;
        var sep = '';
        for (var i in model) {
            if (model[i] !== undefined) {
                fields += sep + ' ' + i;
                values += sep + ' \'' + model[i] + '\'';
                if (first) {
                    first = false;
                    sep = ',';
                }
            }
        }
        this.insert(connection, table, fields, values);
    }


}