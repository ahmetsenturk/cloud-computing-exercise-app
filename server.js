// require express and other modules
const express = require('express');
const app = express();
// Express Body Parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set Static File Directory
app.use(express.static(__dirname + '/public'));


/************
 * DATABASE *
 ************/

const db = require('./models');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to my app api!',
    documentationUrl: '', //leave this also blank for the first exercise
    baseUrl: '', //leave this blank for the first exercise
    endpoints: [
      {method: 'GET', path: '/api', description: 'Describes all available endpoints'},
      {method: 'GET', path: '/api/profile', description: 'Data about me'},
      {method: 'GET', path: '/api/books/', description: 'Get All books information'},
      {method: 'POST', path: '/api/books/', description: 'Add a book information into database'},
      {method: 'PUT', path: '/api/books/:id', description: 'Update a book information based upon the specified ID'},
      {method: 'DELETE', path: '/api/books/:id', description: 'Delete a book based upon the specified ID'},
    ]
  })
});
app.get('/api/profile', (req, res) => {
  res.json({
    'name': 'Ahmet Senturk',
    'homeCountry': 'Turkey',
    'degreeProgram': 'Informatics',//informatics or CSE.. etc
    'email': 'ahmet.senturk@tum.de',
    'deployedURLLink': '',//leave this blank for the first exercise
    'apiDocumentationURL': '', //leave this also blank for the first exercise
    'currentCity': 'Munich',
    'hobbies': ["Crossfit", "Tennis"]

  })
});
/*
 * Get All books information
 */
app.get('/api/books/', (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */
app.post('/api/books/', (req, res) => {

  /*
   * New Book information in req.body
   */
  console.log(req.body);
  /*
   * return the new book information object as json
   */
  db.books.create({
    title: req.body.title,
    author: req.body.author,
    releaseDate: req.body.releaseDate,
    genre: req.body.genre,
    rating: req.body.rating,
    language: req.body.language
  }, (err, book) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error saving book to database");
    } else {
      console.log("Book saved to database:", book);
      // Send the new book information back to the client as JSON
      res.json(book);
    }
  });
});

/*
 * Update a book information based upon the specified ID
 */
app.put('/api/books/:id', (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;
  console.log(`book ID = ${bookId} \n Book Data = ${bookNewData}`);


  /*
   * Send the updated book information as a JSON object
   */
  db.books.findByIdAndUpdate(bookId, bookNewData, { new: true }, (err, updatedBook) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error updating book in database");
    } else if (!updatedBook) {
      res.status(404).send("Book not found");
    } else {
      console.log("Book updated in database:", updatedBook);
      // Send the updated book information back to the client as JSON
      res.json(updatedBook);
    }
  });
});
/*
 * Delete a book based upon the specified ID
 */
app.delete('/api/books/:id', (req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;
  /*
   * Send the deleted book information as a JSON object
   */
  db.books.findByIdAndDelete(bookId, (err, deletedBook) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error deleting book from database");
    } else if (!deletedBook) {
      res.status(404).send("Book not found");
    } else {
      console.log("Book deleted from database:", deletedBook);
      // Send the deleted book information back to the client as JSON
      res.json(deletedBook);
    }
  });
});


/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});
