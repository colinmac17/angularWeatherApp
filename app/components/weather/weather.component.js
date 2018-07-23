// Register `weather` component, along with its associated controller and template
angular.
  module('weather').
  component('weather', {
    templateUrl: 'components/weather/weather.template.html',
    controller: ['$http', function WeatherController($http) {
       var self = this;
       self.isLoading = true;
       self.isError = false;
       init(self, function(){
           self.isLoading = false;
           self.error = '';
            self.latitude = JSON.parse(sessionStorage.getItem('latitude'));
            self.longitude = JSON.parse(sessionStorage.getItem('longitude'));

            //Get Current Weather
            $http.get(`http://api.openweathermap.org/data/2.5/weather?lat=${self.latitude}&lon=${self.longitude}&units=imperial&appid=9e147d5030e6fcdae1ae8c95e25ee211`).then(function(response){
                updateCurrentTemp(self,response);
            });

            //Get Forecast
            $http.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${self.latitude}&lon=${self.longitude}&units=imperial&appid=9e147d5030e6fcdae1ae8c95e25ee211`).then(function(response){
                updateForecast(self,response);
            });
       });
       self.search = function(query, testing){
            if(testing) return query.length > 0;
            self.error = '';
            if(query === '') {
                self.isError = true;
                self.error = 'Please enter a valid city.'
            } else {
            $http.get(`http://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=9e147d5030e6fcdae1ae8c95e25ee211`).then(function(response){
                updateCurrentTemp(self,response);
            }).catch(function(e){
                self.isError = true;
                self.error = e.data.message;
            });
            $http.get(`http://api.openweathermap.org/data/2.5/forecast?q=${query}&units=imperial&appid=9e147d5030e6fcdae1ae8c95e25ee211`).then(function(response){
                updateForecast(self,response);
            }).catch(function(e){
                self.isError = true;
                self.error = e.data.message;
            });
           }
        self.query = '';
       };
      }
    ]
  });

  function getLocation(callback){
    if(sessionStorage.getItem('latitude') !== null || sessionStorage.getItem('longitude') !== null){
        callback();
    } else {
        navigator.geolocation.getCurrentPosition(function(position){
            sessionStorage.setItem('latitude', position.coords.latitude);
            sessionStorage.setItem('longitude', position.coords.longitude);
            callback();
        }, function(error){
            sessionStorage.setItem('latitude', 41.88); // approximate Rocket Miles HQ Latitude
            sessionStorage.setItem('longitude',-87.65); //Approximate Rocket Miles HQ Longitude
            callback();
        });
    }
  }

  function init(self, callback){
      getLocation(callback);
  }

  function updateCurrentTemp(self,response){
    self.temp = response.data.main.temp;
    self.locationName = response.data.name;
    let now = new Date();
    let today = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    self.dateTime = `${month}/${today}/${year}`;
    self.desc = response.data.weather[0].description;
    self.icon = `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`;
  }

  function updateForecast(self,response){
    var data = response.data.list;
    var days = [];
    data.forEach(function(threeHours){
        let date = threeHours.dt_txt.split(' ')[0];
        let time = convertTime(threeHours.dt_txt.split(' ')[1]);
        days.push({date: date, time: time, temp: threeHours.main.temp, icon: `http://openweathermap.org/img/w/${threeHours.weather[0].icon}.png`, desc: threeHours.weather[0].description});
    });
    
    var weatherByDays = {};
    var arrayOfDays = []
    days.forEach(function(day){
        let date = day.date;
        let dataObj = {date: date, desc: day.desc, icon: day.icon, temp: day.temp, time: day.time};
        if(!weatherByDays[date]){
            weatherByDays[date] = [];
        }
        weatherByDays[date].push(dataObj);
    });
    var keys = Object.keys(weatherByDays);
    keys.forEach(function(date){
        arrayOfDays.push(weatherByDays[date]);
    });
    self.days = arrayOfDays;
  }

  function convertTime(input) {
    return moment(input, 'HH:mm').format('h:mm A');
}