const express = require('express');
const app = express()
app.use(express.static('public')) //serve our files in public statically
app.use('/mars', express.static(path.join(__dirname, '..', 'mars')));

app.listen(5501, () => {
  console.log('Server running at http://localhost:5501');
});