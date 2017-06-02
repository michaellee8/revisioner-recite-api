var express = require('express');
var app = express();

var data = require("./data.json");

app.use(express.static('public'));

app.get('/api/getSbaProblem', function (req, res) {
    var n = parseInt(req.query.number);
    var r = parseInt(req.query.ratio);
    if (n && r) {
        if (n > 20) {
            res.send("request too large");
        } else {
            var resarr = [];
            for (var i = 0; i < n; i++) {
                var ranindex = Math.floor(Math.random() * data.content.length);
                var obj = {};
                obj.org = data.content[ranindex].whole;
                if (data.content[ranindex].meaning) {
                    obj.mean = data.content[ranindex].meaning;
                } else {
                    obj.mean = "";
                }
                var testarr = data.content[ranindex].content.split(new RegExp(arrToRegex(data.symbols), 'g'));
                console.log(arrToRegex(data.symbols));
                while (testarr[testarr.length - 1] == "") {
                    testarr.pop();
                }
                while (testarr[0] == "") {
                    testarr.shift();
                }
                var numberleft = r;
                obj.a = [];
                while (numberleft > 0 && testarr.length > 1) {
                    obj.a.push(testarr.splice(Math.floor(Math.random() * testarr.length), 1)[0]);
                    numberleft--;
                }
                obj.q = data.content[ranindex].content;
                for (var j = 0; j < obj.a.length; j++) {
                    obj.q = obj.q.replace(obj.a[j], "{" + j.toString() + "}");
                }
                resarr.push(obj);
            }
            res.send(JSON.stringify(resarr));
        }
    } else {
        res.send("invalid parameter");
    }
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Revision API running at http://%s:%s", host, port);

})

function arrToRegex(arr) {
    regexstr = "";
    for (var i = 0; i < arr.length; i++) {
        regexstr += arr[i];
        regexstr += "|";
    }
    regexstr = regexstr.substring(0, arr.length - 1);
    return regexstr;
}