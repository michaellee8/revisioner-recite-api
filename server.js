var express = require('express');
var app = express();

var data = require("./data.json");

app.use(express.static('public'));

app.get('/api/getSbaProblem', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var n = parseInt(req.query.number);
    var r = parseInt(req.query.ratio);
    if (!isNaN(n) || !isNaN(r)) {
        if (n > data.content.length) {
            res.send("request too large");
        } else {
            var resarr = [];
            var ddata = JSON.parse(JSON.stringify(data));
            for (var i = 0; i < n; i++) {
                var ranindex = Math.floor(Math.random() * ddata.content.length);
                var obj = {};
                obj.org = ddata.content[ranindex].whole;
                if (ddata.content[ranindex].meaning) {
                    obj.mean = ddata.content[ranindex].meaning;
                } else {
                    obj.mean = "";
                }
                var testarr = ddata.content[ranindex].content.split(new RegExp(arrToRegex(ddata.symbols), 'g'));
                console.log(arrToRegex(ddata.symbols));
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
                obj.q = ddata.content[ranindex].whole;
                for (var j = 0; j < obj.a.length; j++) {
                    obj.q = obj.q.replace(obj.a[j], "{" + j.toString() + "}");
                }
                resarr.push(obj);
                ddata.content.splice(ranindex, 1);
            }
            res.send(JSON.stringify(resarr));
        }
    } else {
        res.send("invalid parameter");
    }
})

var server = app.listen(process.env.PORT || 5000, function () {
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
    regexstr = regexstr.substring(0, regexstr.length - 1);
    return regexstr;
}
