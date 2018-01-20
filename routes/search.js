/**
 * Created by janghunlee on 2018. 1. 21..
 */
module.exports = search;

function search(app , request) {
    app.get('/search',(req,res)=>{
        "use strict";
        var fishName = req.query.fishName;
        var encodeFishName = encodeURI(fishName);

        var url = "https://openapi.naver.com/v1/search/encyc.json?query="+encodeFishName+"&display=1&start=1";
        console.log(url);
        request({
            headers: {
                "X-Naver-Client-Id": "yS5JP56Qr1UHrUX96_Je",
                "X-Naver-Client-Secret": "JR6VdPX29I"
            },
            uri: url,
            method: "GET",
        },function (err,response,body) {

            var data = JSON.parse(body);
            console.log(data);
            data["items"][0]["title"] = data["items"][0]["title"].replace("<b>","");
            data["items"][0]["description"] = data["items"][0]["description"].replace(/<b>/gi,"");
            data["items"][0]["title"] = data["items"][0]["title"].replace("</b>","");
            data["items"][0]["description"] = data["items"][0]["description"].replace(/<\/b>/gi,"");

            data["items"][0]["description"] = data["items"][0]["description"].substring(0,65) + "....";
            res.send(data["items"][0]);
        });
    });
}