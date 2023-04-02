const express = require('express'); 

const app = express(); 

// When root route is accessed, we get a string. 
app.get('/', (req, res) => {
    res.send('bye there v2')
});

app.listen(8080, () => {
    console.log('Listening on port 8080')
}); 



