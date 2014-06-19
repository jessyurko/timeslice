var application_root = __dirname,
  express = require("express"),
  path = require("path"),
  mongoose = require('mongoose'),
  http = require('http'),
  cradle = require('cradle'),
  util = require('util'),
  im = require('imagemagick'),
  gm = require('gm').subClass({ imageMagick: true }),
  chrono = require('chrono-node');

  


var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var express = require('express'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose'),
  application_root = __dirname;
  

var app = express()
  .use(express.bodyParser())
  .use(express.static('public'));
  
app.configure (function() {
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  
var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/my_database';
  
// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});


var RightNow = mongoose.model('RightNow', new mongoose.Schema({
	from: String,
	date_created: String,
	subject: String,
	text: String,
	parsed_date: Date,
	time: Boolean
}));

var Image = mongoose.model('Image', new mongoose.Schema({
	rightnow: String,	
	imgurl: String,
}));

var Tag= mongoose.model('Tag', new mongoose.Schema({
	rightnow: String,	
	text: String,
}));

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  //app.set('views', path.join(application_root, "views"));
  //app.set('view engine', 'jade')
});



app.get('/view', function(req, res){
    res.sendfile(__dirname + '/public/index.html');
});

app.get('/api/items', function(req, res){
  return RightNow.find(function(err, events) {
    return res.send(events);
  });
});

app.get('/api/items/:id', function(req, res){
  return RightNow.findById(req.params.id, function(err, event) {
    if (!err) {
      return res.send(event);
    }
  });
});

app.put('/api/items/:id', function(req, res){
  return RightNow.findById(req.params.id, function(err, event) {
    event.title = req.body.title;
    event.date = req.body.date;
    event.time = req.body.time;
    event.imgurl = req.body.imgurl;

    return event.save(function(err) {
      if (!err) {
        console.log("updated");
      }
      return res.send(event);
    });
  });
});



app.delete('/api/items/:id', function(req, res){
  return RightNow.findById(req.params.id, function(err, event) {
    return event.remove(function(err) {
      if (!err) {
        console.log("removed");
        return res.send('')
      }
    });
  });
});


app.get('/postmark', function(req, res){
	var date = chrono.parse("july 25th 2pm");
	var d = new Date(date[0].startDate);
	console.dir(d);
	console.dir(date[0].start.hour);
	return res.send(chrono.parse("july 25th 2pm"));
});

app.post('/postmark', function(req, res){
  var item;
  var s3 = new AWS.S3();

  var allText = req.body.Subject + " " + req.body.TextBody;
  var dates = chrono.parse(allText);
  var date = null;
  var time = false;
  if(dates[0]) {
  	date = new Date(dates[0].startDate);
  	if(dates[0].start.hour) time = true; 
  }
  
  item = new RightNow({
    subject: req.body.Subject,
    date_created: new Date(),
    text: req.body.TextBody,
    from: req.body.From,
    parsed_date: date,
    time: time
    
  });
  
  console.dir(item);
  console.dir(req.body.Attachments.length);
  item.save(function(err) {
    if (!err) {
    	req.body.Attachments.forEach(function(val, index) {

			var buffer = new Buffer(val.Content, "base64");
			var rand = Math.random().toString(36).substring(3);
			var folder = rand + val.Name;
			var key = "small_" + rand + val.Name;
			var type = val.ContentType;
			
			
			
			gm(buffer, folder).autoOrient().resize(800).toBuffer(function (err1, buffer1) {
			  if (err1) console.dir(err1);	
			  var opts = {Bucket: 'timeslice', Key: folder, Body: buffer1, ACL: "public-read"};
				s3.putObject(opts, function (a, b) {
					console.dir(a);
					console.dir(b);
				});		  		  
			});
			
			gm(buffer, folder).autoOrient().resize(400).toBuffer(function (err2, buffer2) {
			  if (err2) console.dir(err2);		  
			  var opts2 = {Bucket: 'timeslice', Key: key, Body: buffer2, ACL: "public-read"};
				s3.putObject(opts2, function (a, b) {
					console.dir(a);
					console.dir(b);
				});		  		  
			});

			var img = new Image({
				rightnow: item._id,
				imgurl: folder
			});
		
			img.save();
 			
    	});
    	
    	var tags = req.body.TextBody.match(/#\S+/g);
    	if(tags) {
    		tags.forEach(function(val, i) {
				var txt = val.substr(1);
				var tag = new Tag({
					rightnow: item._id,
					text: txt
				});
			
				tag.save();
			});
		}
    	
      return console.log("created");
    }
  });
  return res.send(item);
});

app.get('/api/rotate', function(req, res) {
var s3 = new AWS.S3();
	s3.listObjects({Bucket: 'timeslice'}, function(err, data) {
		  if(data) {
	  
		data.Contents.forEach(function(val, index) {
			console.dir(val);
			gm("https://s3.amazonaws.com/timeslice/"+val.Key).autoOrient().resize(400).toBuffer(function (err, buffer) {
			  if (err) console.dir(err);
			  console.log('done!');
			  
			  var key = "small_"+val.Key;
			  var opts = {Bucket: 'timeslice', Key: key, Body: buffer, ACL: "public-read"};
				s3.putObject(opts, function (e, d) {
					console.dir(e);
					console.dir(d);

				});	  
			  
		});
		
		
		});

		}	

	  return res.send(data);
  });

});

app.get('/api/keyword/:tag', function(req, res){
  var items = [];
  return Tag.find({text: req.params.tag}, function(err, tags) {
  	if(tags) {
  		console.dir(tags);
		tags.forEach(function(val, i) {
	    	RightNow.findById(val.rightnow, function(err, item) {
	    		console.dir(item);
	    		var images = [];
	    		Image.find({rightnow: val.rightnow}, function(err, imgs) {
	    			imgs.forEach(function(img, j) {
	    				images.push(img.imgurl);
	    			});
	    			
	    			item.imgs = images;
	    			console.dir(item);
	    			items.push(item);
	    		});
	    	});
	    	
	    	
	    	
	    	return res.send(items);

		});
	} else return res.send('none found');
  });
});

app.get('/api/imgs', function(req, res){
  return Image.find(function(err, items) {
    return res.send(items);
  });
});

app.get('/api/tags', function(req, res){
  return Tag.find(function(err, items) {
    return res.send(items);
  });
});



var theport = process.env.PORT || 5000;
http.createServer(app).listen(theport, function () {

  console.log("Server ready at http://localhost:"+theport);
});