var pg = require('pg');
	express = require('express'),
    http = require('http'),
    port = 5433,
	host = '127.0.0.1',
    app = express(),
    server = http.createServer(app),
	location="./";
// production error handler
// no stacktraces leaked to user

	var router = express.Router();

app.use('/',express.static(location));
var user = 'postgres',
password = '',
bdPort = 5432,
bd = 'postgres';
var conString = "pg://"+user +":"+ password +"@localhost:"+bdPort+"/"+bd;
var client = new pg.Client(conString);
client.connect();

var get3 = function(req, res) {
// Select all rows in the table
var q = 'SELECT edges_test.id, edges_test.speed, nodes_test.lat as lat, nodes_test.lon as lon FROM edges_test INNER JOIN nodes_test ON (edges_test.srcid = nodes_test.id) OR (edges_test.trgid = nodes_test.id) ORDER BY edges_test.id';
var query = client.query(q);
query.on("row", function (row, result) {
result.addRow(row);
});
query.on("end", function (result) {
// On end JSONify and write the results to console and to HTML output
res.writeHead(200, {'Content-Type': 'text/plain'});
res.write(JSON.stringify(result.rows) + "\n");
res.end();
});
}

app.get('/api/query', get3);

server.listen(port);

console.log('Listening on port 5433');