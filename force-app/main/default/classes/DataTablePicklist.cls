global class DataTablePicklist extends VisualEditor.DynamicPickList{
    
    global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('', '');
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        List<Datatable_Object_Setting__mdt> objectSettings = [SELECT Id, Label FROM Datatable_Object_Setting__mdt];
        VisualEditor.DynamicPickListRows objectList = new VisualEditor.DynamicPickListRows();

        for(Datatable_Object_Setting__mdt objectSetting : objectSettings) {
            String IdStr = '' + objectSetting.Id;
            VisualEditor.DataRow objectChoice = new VisualEditor.DataRow(objectSetting.Label, IdStr);
            objectList.addRow(objectChoice);
        }
    
        return objectList;
    }
}