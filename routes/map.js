/**
 * Created by janghunlee on 2018. 1. 20..
 */
module.exports = map;

function map(app , request) {
    "use strict";
    app.get('/map',(req,res)=>{
        var requestUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
        requestUrl += req.query.wido+","+req.query.qwenogdo;
        requestUrl += "&key=AIzaSyDwZFnSw-QwGAdhu5VMwDWHI58MX_fgv_I";
        request(requestUrl,(err,response,html)=>{
            if(err) throw err;
            var data = JSON.parse(html)["results"];
            var returnData = {
                "address":String,
                "geometry":{
                    "lat":String,
                    "lng":String
                }
            }

            console.log(data[0]["formatted_address"]);
            returnData["address"] = data[0]["formatted_address"];
            returnData["geometry"]["lat"] = data[0]["geometry"]["location"]["lat"];
            returnData["geometry"]["lng"] = data[0]["geometry"]["location"]["lng"];


            res.send(returnData);
        });
    });
}