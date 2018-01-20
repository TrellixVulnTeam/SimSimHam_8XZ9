/**
 * Created by janghunlee on 2018. 1. 20..
 */

module.exports = upload;

function upload(app , upload , request , vision , translate , gm , randomstring) {
    app.get('/upload',function (req,res) {
        res.render('yeah.html');
    });

    app.post('/upload/file', upload.single('file'), function(req, res){
        console.log(req.file);
        const client = new vision.ImageAnnotatorClient();

        var url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA0DXl0ipT-ybnOawFlKkiFc2ZuUgTmvYA";
        var returnLabel = "";
        var translateText = "";
        var randomImg = randomstring.generate()+".jpg";
        console.log(req.file.path);
        gm("./"+req.file.path)
            .resize(320, 180)
            .write(randomImg, function (err) {
                if (err) console.error(err)
                else{
                    console.log('done')
                    client
                        .labelDetection(randomImg)
                        .then(results => {
                            const labels = results[0].labelAnnotations;

                            console.log('Labels:');
                            var check = 0;
                            labels.forEach(label =>{
                                "use strict";
                                console.log(label.description)
                                if(label.description != "fish" && check != 1){
                                    check = 1;
                                    returnLabel = label.description;
                                }
                            });
                            translate(returnLabel, {to: 'ko'}).then(resp => {
                                "use strict";
                                translateText = resp.text;

                                var encodeFishName = encodeURI(translateText);

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

                                    if(data["items"][0]["title"] == "쏠배감펭"){
                                        var returnName = "느금마.jpg";
                                    }
                                    else if(data["items"][0]["title"] == "오마르"){
                                        var returnName = "가재.jpg"
                                    }
                                    else if(data["items"][0]["title"] == "해파리"){
                                        var returnName = "해파리.jpg";
                                    }
                                    else if(data["items"][0]["title"] == "불가사리"){
                                        var returnName = "불가사리.jpg";
                                    }
                                    else if(data["items"][0]["title"] == "상어"){
                                        var returnName = "상어.jpg";
                                    }

                                    var returnData ={
                                        "imageUrl":"http://soylatte.kr:8080/"+returnName,
                                        "visionResult":data["items"][0]["title"],
                                        "search":data["items"][0]
                                    }
                                    res.send(returnData);
                                });
                            }).catch(err => {
                                console.error(err);
                                res.send(404,"TRANSLATE ERROR")
                            });
                        })
                        .catch(err => {
                            console.error('ERROR:', err);

                            res.send(404,"VISION API ERROR")
                        });

                }
            });
    });
}