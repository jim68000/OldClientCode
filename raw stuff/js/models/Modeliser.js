var Modeliser = function(model) {
    var model = model;
    model.__meta__.InstanceFactory = function(values) {
         var instance = {};
         // copy provided values into our instance
         for (var i in values) {
             instance[i] = values[i];
         }


         // check for mandatory values and validate
         for (var i in model) {

             // TODO there must be some way to reflect the name of the model without a meta approach
             if (i !== '__meta__') {
                 // check for missing mandatory values
                 if (instance[i] === undefined && model[i].mandatory) {
                     throw new Error("Object is missing a " + i)
                 }

                 // add defaults if required
                 if (instance[i] === undefined && !model[i].mandatory && model[i].
             default !== undefined) {
                     instance[i] = model[i].
                 default;
                 }

                 // validate
                 if (model[i].validator !== undefined) {
                     instance[i] = model[i].validator(instance[i]);
                 }
             }


         }
         return {
             data: instance,
             commit: function commit_from_model(connection) {
                 sql.insert_from_model(connection, model.__meta__.tableName, this.data)
             }
         }
     }

    return {
        create: function(connection) {
            sql.create_table_from_model(model, connection);
        },
		
		get_all: function(connection, callback) { // would be nicer not to have to pass the connection all the time
			sql.get_all_from_model(connection, model, function(err, res) {
				var res_arr = [];
				for (var i = 0; i < res.rows.length; i++) {
					res_arr.push(model.__meta__.InstanceFactory(res.rows.item(i)));
				}
				callback(res_arr);
			})
		},


		// instance object
 		InstanceFactory: model.__meta__.InstanceFactory
    }
}