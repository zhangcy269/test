var request = require('superagent/superagent')
var req = request.post('/upload');

 req.part()
   .set('Content-Type', 'image/png')
   .set('Content-Disposition', 'attachment; filename="myimage.png"')
   .write('some image data')
   .write('some more image data');

 req.part()
   .set('Content-Disposition', 'form-data; name="name"')
   .set('Content-Type', 'text/plain')
   .write('tobi');

 req.end(callback);