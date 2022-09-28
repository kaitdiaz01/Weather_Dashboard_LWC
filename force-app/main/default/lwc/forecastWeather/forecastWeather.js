import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import WEATHER_DATE from '@salesforce/schema/Weather_Data__c.Date__c';
import WEATHER_HUMIDITY from '@salesforce/schema/Weather_Data__c.Humidity__c';
import WEATHER_TEMP from '@salesforce/schema/Weather_Data__c.Temperature__c';
import WEATHER_WIND from '@salesforce/schema/Weather_Data__c.Wind_MPH__c';
import WEATHER_NAME from '@salesforce/schema/Weather_Data__c.Name';
import WEATHER_OBJECT from '@salesforce/schema/Weather_Data__c';


const columns = [
    // { label: 'Weather', fieldName: 'Name' },
    { label: 'Date', fieldName: 'date', type: 'date-local' },
    { label: 'Humidity', fieldName: 'humidity', type: 'percent' },
    { label: 'Temp', fieldName: 'temp', type: 'number' },
    { label: 'Wind MPH', fieldName: 'wind', type: 'number' }
];


export default class ForecastWeather extends NavigationMixin(LightningElement) {

    @api forecasts;
    @api cityInput;


    columns = columns;
    data = [];


    get forecastarray() {
        var tempForecastarray = [];
        var parsedForecast = JSON.parse(JSON.stringify(this.forecasts));
        for (let i = 0; i < parsedForecast.length; i++) {

            var cityInfo = {
                date: parsedForecast[i].date,
                temp: parsedForecast[i].day.avgtemp_f,
                wind: parsedForecast[i].day.maxwind_mph,
                humidity: parsedForecast[i].day.avghumidity / 100,
            };

            tempForecastarray.push(cityInfo);

        }

        console.log(tempForecastarray);
        return tempForecastarray;
    }

    createNewRecord() {
        var selectedWeatherData = this.template.querySelector('lightning-datatable').getSelectedRows();

        // console.log(selectedWeatherData);
        Promise.all(
            selectedWeatherData.map(weather => {
                const fields = {};
                fields[WEATHER_NAME.fieldApiName] = this.cityInput;
                fields[WEATHER_DATE.fieldApiName] = weather.date;
                fields[WEATHER_HUMIDITY.fieldApiName] = weather.humidity * 100;
                fields[WEATHER_TEMP.fieldApiName] = weather.temp;
                fields[WEATHER_WIND.fieldApiName] = weather.wind;
                const recordInput = { apiName: WEATHER_OBJECT.objectApiName, fields };
                return createRecord(recordInput);
            }))
            .then(success => {
                this.showToast('SUCCESS', 'Record Created', 'success');
                const recordAdded = new CustomEvent('recordadded')
                this.dispatchEvent(recordAdded);
            })
            .catch(error => {
                this.showToast('ERROR', error.body.message, 'error');
            });
    };

    
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    };


    get isWeather() {
        if (this.forecasts) {
            return true;
        }
        else {
            return false;
        }
    };

}