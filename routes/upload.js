/**
 * Created by janghunlee on 2018. 1. 20..
 */

module.exports = upload;

function upload(app , upload) {
    app.get('/upload',function (req,res) {
        res.render('yeah.html');
    });

    app.post('/upload/file', upload.single('file'), function(req, res){
        console.log(req.file);
        res.send("http://soylatte.kr:8080"+req.file.path);
    });
}