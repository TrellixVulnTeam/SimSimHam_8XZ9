/**
 * Created by janghunlee on 2018. 1. 20..
 */

module.exports = upload;

function upload(app , upload , request , vision) {
    app.get('/upload',function (req,res) {
        res.render('yeah.html');
    });

    app.post('/upload/file', upload.single('file'), function(req, res){
        console.log(req.file);
        const client = new vision.ImageAnnotatorClient();

        var url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA0DXl0ipT-ybnOawFlKkiFc2ZuUgTmvYA";
        var returnLabel = "";
        console.log(req.file.path);
        client
            .labelDetection("./"+req.file.path)
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

                var returnData ={
                    "imageUrl":"http://soylatte.kr:8080/"+req.file.filename,
                    "visionResult":returnLabel
                }
                res.send(returnData);
            })
            .catch(err => {
                console.error('ERROR:', err);

                res.send(404)
            });

    });
}