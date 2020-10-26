const express = require('express');
const hbs = require('hbs');
const axios = require('axios');
const path = require('path');
const { getCode, getName } = require('country-list');

const app = express();

const viewsPath = path.join(__dirname, '/views');
app.set('view engine', 'hbs');
app.set('views', viewsPath);

app.use(express.static('public'));

app.use(express.urlencoded());
app.use(express.json());



app.get('/', (req, res) => {
    res.render('index')
});


app.post('/results', async (req, res) => {
    const country = req.body.country
    const countryIntial = getCode(country)
    const city = req.body.city
    const apiKey = "bc5029d99d9e0bcc6fb6f3e700eb896c"

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryIntial}&appid=${apiKey}&units=metric&lang=en`

    const apiResponse = await axios.get(url)

    const weatherIcon = apiResponse.data.weather[0].icon
    const weatherUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`

    res.render('index', {
        temperture: apiResponse.data.main.temp.toFixed(0),
        picture: weatherUrl,
        des: apiResponse.data.weather[0].description,
        celcius: 'C'
    });

});

app.get('/sevendays', async (req, res) => {

    const dtConverter = (UNIX_timestamp) => {
        let a = new Date(UNIX_timestamp * 1000);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let month = months[a.getMonth()];
        let date = a.getDate();
        let time = date + ' ' + month;
        return time;
    }

    const apiKey = "bc5029d99d9e0bcc6fb6f3e700eb896c"

    const day7Url = `https://api.openweathermap.org/data/2.5/onecall?lat=53.4084&lon=2.9916&
    exclude=current,minutely,hourly&appid=${apiKey}&units=metric`

    const apiResponse = await axios.get(day7Url);

    const iconUrl = [
        `http://openweathermap.org/img/wn/${apiResponse.data.daily[0].weather[0].icon}@2x.png`,
        `http://openweathermap.org/img/wn/${apiResponse.data.daily[1].weather[0].icon}@2x.png`,
        `http://openweathermap.org/img/wn/${apiResponse.data.daily[2].weather[0].icon}@2x.png`,
        `http://openweathermap.org/img/wn/${apiResponse.data.daily[3].weather[0].icon}@2x.png`,
        `http://openweathermap.org/img/wn/${apiResponse.data.daily[4].weather[0].icon}@2x.png`,
        `http://openweathermap.org/img/wn/${apiResponse.data.daily[5].weather[0].icon}@2x.png`,
        `http://openweathermap.org/img/wn/${apiResponse.data.daily[6].weather[0].icon}@2x.png`,
    ]

    res.render('sevendays', {
        day1: dtConverter(apiResponse.data.daily[0].dt),
        des1: apiResponse.data.daily[0].weather[0].description,
        temp1: apiResponse.data.daily[0].temp.day,
        icon1: iconUrl[0],

        day2: dtConverter(apiResponse.data.daily[1].dt),
        des2: apiResponse.data.daily[1].weather[0].description,
        temp2: apiResponse.data.daily[1].temp.day,
        icon2: iconUrl[1],

        day3: dtConverter(apiResponse.data.daily[2].dt),
        des3: apiResponse.data.daily[2].weather[0].description,
        temp3: apiResponse.data.daily[2].temp.day,
        icon3: iconUrl[2],

        day4: dtConverter(apiResponse.data.daily[3].dt),
        des4: apiResponse.data.daily[3].weather[0].description,
        temp4: apiResponse.data.daily[3].temp.day,
        icon4: iconUrl[3],

        day5: dtConverter(apiResponse.data.daily[4].dt),
        des5: apiResponse.data.daily[4].weather[0].description,
        temp5: apiResponse.data.daily[4].temp.day,
        icon5: iconUrl[4],

        day6: dtConverter(apiResponse.data.daily[5].dt),
        des6: apiResponse.data.daily[5].weather[0].description,
        temp6: apiResponse.data.daily[5].temp.day,
        icon6: iconUrl[5],

        day7: dtConverter(apiResponse.data.daily[6].dt),
        des7: apiResponse.data.daily[6].weather[0].description,
        temp7: apiResponse.data.daily[6].temp.day,
        icon7: iconUrl[6],


    });
});



app.listen(4002, () => {
    console.log("Sever is running on port 4002")
});