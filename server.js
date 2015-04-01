var http = require('http'),
    fs = require('fs'),
	request = require('request');;

var portNo = 8000;

var getFile = function (url) {
    return fs.readFileSync("./" + url);
}

var contentTypes = {
    'html': "text/html",
    'js': "text/javascript",
    'css': "text/css",
    'png': "image/png",
    'ico': "image/x-icon"
};

var testURL = "https://api.flickr.com/services/feeds/photos_public.gne?tagmode=all&format=json&tags=";

var headers = {
    //"Authorization": "token " + authString,
    //"Allow": "*/*"
};

var lastRequest = { name: "", time: new Date(), response: {} }

var getLastRequest = function (request) {
    if (lastRequest.name == "") {
        return false;
    }

    if (request != lastRequest.name) {
        return false;
    }

    var currentTime = (new Date()).getTime();
    var timeForUpdate = (currentTime - lastRequest.time.getTime()) / (1000 * 60) > 5;

    return !timeForUpdate;
}

var getRequest = function (tags, callback) {
    var reqURL = testURL + tags;

    request.get({ url: reqURL, headers: headers }, function (error, response, body) {
        callback(body);
        if (!error && response.statusCode == 200) {
            console.log("success");
        }
        else {
            console.log("fail");
            console.log(JSON.stringify(response));
        }
    });
}

getRequest("astro", function (body) { });

http.createServer(function (req, res) {

    console.log(req.url);

    var url = (req.url == "/") ? "index.html" : req.url;
    var urlSplit = url.split(".");
    var extension = urlSplit[urlSplit.length - 1];

    if (contentTypes[extension] != null) {
        res.writeHead(200, { 'Content-Type': contentTypes[extension] });
        res.end(getFile(url));
    }
    else if (getLastRequest(req.url)) {
        res.writeHead(200, { 'Content-Type': "text/javascript", "Access-Control-Allow-Origin": "*" });
        res.end(lastRequest.response);
        console.log("cached at " + lastRequest.time.toGMTString());
    }
    else {
        getRequest(req.url.substring(1), function (text) {
            res.writeHead(200, { 'Content-Type': "text/javascript", "Access-Control-Allow-Origin": "*" });
            res.end(text);
            lastRequest.name = req.url;
            lastRequest.time = new Date();
            lastRequest.response = text;
        });
    }
}).listen(portNo);

console.log("Server running on port " + portNo);

