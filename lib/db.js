var mongo = require('mongodb'),
    log = require('winston'),
    assert = require('assert');

var MongoClient = mongo.MongoClient;

var Manager = function (url) {
    this.url = url
}

Manager.prototype._handle_routes = function (func, callback) {
    // DB connection management/assertions are all managed in one place
    MongoClient.connect(this.url, function(conn_err, db) {
        assert.equal(conn_err, null);
        var wrapped_callback = function (func_err, result) {
            assert.equal(func_err, null);
            callback();
            db.close();
        }
        var collection = db.collection('routes');
        func(collection, wrapped_callback);
    });
}

Manager.prototype._make_document = function (path, data) {
    return {"path": path, "data": data};
}

Manager.prototype.write_route = function(path, data) {
    var callback = function (err, result) {
        log.debug("MongoDB: Stored route: ", path, ' -> ', data);
    }
    this._handle_routes(function (collection) {
        collection.insert(this.make_document(path, data), callback);
    });
}

Manager.prototype.delete_route = function(path) {
    var callback = function (err, result) {
        log.debug("MongoDB: Removed route: ", path, ' -> ', data);
    }
    this._handle_routes(function (collection) {
        collection.remove(this.make_document(path, data), callback);
    });
}

Manager.prototype.get_all_routes = function(cb) {
    var callback = function (err, result) {
        log.debug("MongoDB: Getting all routes");
        callback(result);
    }
    this._handle_routes(function (collection) {
        collection.find({}).toArray(callback);
    });
}

exports.Manager = Manager
