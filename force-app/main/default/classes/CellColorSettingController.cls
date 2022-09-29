public with sharing class CellColorSettingController {

// use wrapper class to be able to create one object with three different objects in Apex class
    public class DataTableObjectSetting {
        Id id;
        String name;
        String objectName;
        ColumnSetting[] columnSettings;
    }

    public class ColumnSetting {
        Id id;
        String name;
        String fieldAPIName;
        CellColorSetting[] cellColorSettings;
    }

    public class CellColorSetting {
        Id id;
        String name;
        String color;
        String condition;
        Integer dataValue;
    }

    @AuraEnabled (cacheable=true)
    public static String getDataTableObjectSettings(String ObjectSettingId){
        Id key = ObjectSettingId;
        // query the data we want and then down below create a list where we combine it with the datatable object
        Datatable_Object_Setting__mdt objectSettings =
        [SELECT Id, Object_Name__c, Label
        FROM Datatable_Object_Setting__mdt
        WHERE Id = :key];

        List<Column_Setting__mdt> columnSettings = [SELECT Id, Field_API_Name__c, Label, Datatable_Object_Setting__c
                                                   FROM Column_Setting__mdt
                                                   WHERE Datatable_Object_Setting__r.Id = :key];

    // populate wrapper with the data                                               
        DataTableObjectSetting dataTableObjectSetting = new DataTableObjectSetting();
        dataTableObjectSetting.id = objectSettings.Id;
        dataTableObjectSetting.name = objectSettings.Label;
        dataTableObjectSetting.objectName = objectSettings.Object_Name__c;

        dataTableObjectSetting.columnSettings = new List<ColumnSetting>();

    // run a for loop to populate list 
    for (Column_Setting__mdt columnSetting : columnSettings) {
        ColumnSetting newSetting = new ColumnSetting();
        newSetting.id = columnSetting.Id;
        newSetting.name = columnSetting.Label;
        newSetting.fieldAPIName = columnSetting.Field_API_Name__c;
        newSetting.cellColorSettings = new List<CellColorSetting>();

    // create a list here to combine it with the column setting 
        List<Cell_Color_Setting__mdt> colorSettings = [SELECT Id, Label, Color__c, Condition__c, Data_Value__c
                                                       FROM Cell_Color_Setting__mdt
                                                       WHERE Column_Setting__r.Id =: columnSetting.id];
        
    // run a for loop to populate list and populate wrapper with the item data                                                
        for (Cell_Color_Setting__mdt colorSetting : colorSettings) {
            CellColorSetting newCellColorSetting = new CellColorSetting();
            newCellColorSetting.id = colorSetting.Id;
            newCellColorSetting.name = colorSetting.Label;
            newCellColorSetting.color = colorSetting.Color__c;
            newCellColorSetting.condition =colorSetting.Condition__c;
            newCellColorSetting.dataValue = Integer.valueOf(colorSetting.Data_Value__c);

           // add the new setting to the columnsetting which will add it to the wrapper list
            newSetting.cellColorSettings.add(newCellColorSetting);


            
        }

        // adds everything into the datatableobjectsetting to populate wrapper with all the data chosen above
        dataTableObjectSetting.columnSettings.add(newSetting);
    }
    // System.debug(JSON.serialize(dataTableObjectSetting));

// serialize will return the Apex object to be able to read it
    return JSON.serialize(dataTableObjectSetting);  
    }
}
