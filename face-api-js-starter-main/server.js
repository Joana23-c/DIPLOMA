const express = require('express');
const app = express()
app.use(express.static('public')) //serve our files in public statically
app.use('/mars', express.static(path.join(__dirname, '..', 'mars')));
//app.use('/venus', express.static(path.join(__dirname, '..', 'venus')));

app.listen(5500, () => {
  console.log('Server running at http://localhost:5500');
});