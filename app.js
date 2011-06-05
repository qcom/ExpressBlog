//Module Dependencies

var express = require('express');

var app = module.exports = express.createServer();

// Configuration
var pub = __dirname + '/public';

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(pub));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var PostProvider = require('./postprovider').PostProvider;
var PostProvider= new PostProvider();

// Blog Index
app.get('/', function(req, res){
  PostProvider.findAll(function(error, posts){
    res.render('index', {
	        locals: {
	          title: 'My Blog',
	          posts: posts
	        }
	});
  })
});

// New
app.get('/posts/new', function(req, res){
  res.render('post_new', {
             locals: {
               title: 'New Post'
             }
  });
});

// Create
app.post('/posts/new', function(req, res){
  PostProvider.save({
	title: req.param('title'),
    body: req.param('body')
  }, function(error, docs) {
	res.redirect('/');
  });
});

// Show
/*app.get('/posts/:id', function(req, res){
  PostProvider.findById(req.param('id'), function(error, post) {
    res.render('post_show', {
      locals: {
        title: post.title,
        post:post
      }
    });
  });
});*/

// ShowV2
app.get('/posts/:title', function(req, res){
  PostProvider.findByTitle(req.param('title'), function(error, post) {
    res.render('post_show', {
      locals: {
        title: post.title,
        post:post
      }
    });
  });
});

// Edit
app.get('/posts/:id/edit', function(req, res){
  PostProvider.findById(req.param('id'), function(error, post) {
    res.render('post_edit', {
      locals: {
        title: post.title,
        post:post
      }
    });
  });
});

// Update
app.post('/posts/:id/edit', function(req, res){
  PostProvider.updateById(req.param('id'), req.body, function(error, post) {
    res.redirect('/');
  });
});

// Add Comment
app.post('/posts/addComment', function(req, res){
  PostProvider.addCommentToPost(req.body._id, {
    person: req.body.person,
    comment: req.body.comment,
    created_at: new Date()
  }, function(error, docs) {
    res.redirect('/posts/' + req.body._id)
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
