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

Manager.prototype.write_route = function(path, data) {
    var that = this;
    var callback = function (err, result) {
        log.debug("MongoDB: Stored route: ", path, ' -> ', data);
    }
    this._handle_routes(function (collection) {
        var doc = {"path": path, "data": data};
        collection.insert(doc, callback);
    });
}

Manager.prototype.delete_route = function(path) {
    var that = this
    var callback = function (err, result) {
        log.debug("MongoDB: Removed route: ", path);
    }
    this._handle_routes(function (collection) {
        var doc = {"path": path};
        collection.remove(doc, callback);
    });
}

Manager.prototype.get_all_routes = function(cb) {
    var callback = function (err, result) {
        log.debug("MongoDB: Getting all routes");
        cb(result);
    }
    this._handle_routes(function (collection) {
        collection.find({}).toArray(callback);
    });
}

exports.Manager = Manager
