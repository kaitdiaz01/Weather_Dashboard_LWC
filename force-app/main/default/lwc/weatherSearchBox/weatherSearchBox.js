import { api, LightningElement, wire, track } from 'lwc';
import getWeatherData from '@salesforce/apex/CsvController.getWeatherData'



export default class WeatherSearchBox extends LightningElement {

 

    cityInput;

    @track childCityName;

    cityRefresh = true

    forecasts;

    @track weatherData = {}

    columnHeader = ["Name", "Date__c", "Humidity__c", "Temperature__c", "Wind_MPH__c"]

    @wire(getWeatherData)

    wiredData({error, data}) {
        if(data){
            console.log('Data', data);
            this.weatherData = data;
        } else if (error) {
            console.error('Error', error);
        }
    }

    exportRecord(){
        let doc = '';

        this.columnHeader.forEach(element => {            
            doc += element + ','  
        });
        // Add the data rows
        // comma seperated and new lines for data
        this.weatherData.forEach(record => {
            doc += '\n';
            doc += record.Name +',';
            doc += record.Date__c+','; 
            doc += record.Humidity__c+',';
            doc += record.Temperature__c+','; 
            doc += record.Wind_MPH__c+','; 
            // doc += '\n';
        });

        var element = 'data:application/csv,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = 'Weather Data.csv';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }


    cityChangeHandler(event) {
        var that = this;
        const apiKey = "0b9cf8e248c74890b8003413222504";
        that.cityRefresh = false;
        this.cityInput = event.target.value
        const userCityInput = event.target.value
        const isEnterKey = event.keyCode === 13;



        if (userCityInput.length !== '' && isEnterKey) {


            console.log(userCityInput);
          
            const endpoint = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${userCityInput}&days=10&aqi=no&alerts=no`
            this.fetchWeatherForecasts(endpoint);

            
        }
        that.cityRefresh = true
    }



    fetchWeatherForecasts(endpoint) {
     var that = this;
        // const weatherData = 
        fetch(endpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // console.log(data);

                that.forecasts = JSON.parse(JSON.stringify(data.forecast.forecastday))
                // console.log(that.forecasts);

                
            })
        this.childCityName = this.cityInput
    }

    
}