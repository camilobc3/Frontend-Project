fetch("https://api-colombia.com/api/v1/Region")
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error(error);
});