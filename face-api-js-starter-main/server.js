const express = require('express');
const app = express()
app.use(express.static('public')) //serve our files in public statically
app.use('/mars', express.static(path.join(__dirname, '..', 'mars')));
app.use('/urani', express.static(path.join(__dirname, '..', 'urani')));
app.use('/jupiter', express.static(path.join(__dirname, '..', 'jupiter')));

app.listen(5500, () => {
  console.log('Server running at http://localhost:5500');
});