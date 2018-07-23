// Register `weather` component, along with its associated controller and template
angular.
  module('weather').
  component('weather', {
    templateUrl: 'components/weather/weather.template.html',
    controller: ['$http', function WeatherController($http) {
       var self = this;
       self.isLoading = true;
       init(self, function(){
           self.isLoading = false;
            self.latitude = JSON.parse(sessionStorage.getItem('latitude'));
            self.longitude = JSON.parse(sessionStorage.getItem('longitude'));

            //Get Current Weather
            $http.get(`http://api.openweathermap.org/data/2.5/weather?lat=${self.latitude}&lon=${self.longitude}&units=imperial&appid=9e147d5030e6fcdae1ae8c95e25ee211`).then(function(response){
                //console.log(response);
                self.temp = response.data.main.temp;
                self.locationName = response.data.name;
                let now = new Date();
                let today = now.getDate();
                let month = now.getMonth() + 1;
                let year = now.getFullYear();
                self.dateTime = `${month}/${today}/${year}`;
                self.desc = response.data.weather[0].description;
                self.icon = `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`
            });

            //Get Forecast
            $http.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${self.latitude}&lon=${self.longitude}&units=imperial&appid=9e147d5030e6fcdae1ae8c95e25ee211`).then(function(response){
                console.log(response);
                
            });
       });
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
