const path = require('path');
function getdata() {
    fetch('https://fakestoreapi.com/products').then((res) => {
        return res.text;
    }).then((data) => {
        console.log(data);
    })
}
const url = path.join(__dirname, 'public/partials');
console.log(url);

getdata();