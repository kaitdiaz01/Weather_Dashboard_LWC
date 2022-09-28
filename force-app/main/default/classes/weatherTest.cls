@isTest
public class weatherTest {
    @TestSetup
    
    static void makeData(){
        Weather_Data__c w = new Weather_Data__c(Name='Test Data', Humidity__c=70, Temperature__c=89, Wind_MPH__c=10);
        insert w;
    }
    @IsTest static void getWeatherData(){
        Test.startTest();
        Weather_Data__c query_data = [SELECT Id FROM Weather_Data__c WHERE Name = 'Test Data'];
        List<Weather_Data__c> weather = CsvController.getWeatherData();
        system.assert(weather.size() > 0, 'size should be greater than zero');
        Test.stopTest();
        
    } 
    
}
