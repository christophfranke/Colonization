const express = require('express');
const app = express();

app.use(express.static('client/public'));

app.listen(3000, () =>{
	console.log('Listening on Port 3000');
});
