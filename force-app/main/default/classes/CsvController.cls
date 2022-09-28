public with sharing class CsvController {
    
    @AuraEnabled(cacheable=true)
    public static List<Weather_Data__c> getWeatherData() {
        List<Weather_Data__c> weather = [SELECT Name, Date__c, Humidity__c, Temperature__c, Wind_MPH__c FROM Weather_Data__c];
        return weather;
    }
}

