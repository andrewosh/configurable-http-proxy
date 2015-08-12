var mongo = require('mongodb'),
    log = require('winston'),
    assert = require('assert');

var MongoClient = mongo.MongoClient;

var Manager = function (url) {
    this.url = url
}

Manager.prototype.write_route = function(path, data) {
    MongoClient.connect(this.url, function(err, db) {
        assert.equal(err, null);
        var collection = db.collection('routes');
        collection.insert({"path": path, "data": data}, function(err, result) {
            assert.equal(err, null);
            log.debug("MongoDB: Stored route: ", path, ' -> ', data);
        });
        db.close();
    });
}

Manager.prototype.delete_route = function(path) {
    MongoClient.connect(this.url, function(err, db) {
        assert.equal(err, null);
        var collection = db.collection('routes');
        collection.remove({"path": path, "data": data}, function(err, result) {
            assert.equal(err, null);
            log.debug("MongoDB: Removed route: ", path, ' -> ', data);
        });
        db.close();
    });
}

Manager.prototype.get_all_routes = function(callback) {
    MongoClient.connect(this.url, function(err, db) {
        assert.equal(err, null);
        var collection = db.collection('routes');
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("MongoDB: Getting all routes");
            callback(docs)
        });
        db.close();
    });
}
