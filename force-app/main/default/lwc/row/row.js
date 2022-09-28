import { api, LightningElement } from 'lwc';

export default class Row extends LightningElement {
    @api row;
    @api columns;
    @api rowId;
    @api apiName;
    @api getColorSetting;

    get rowInfo() {
        var rowData = [];
   
        // var parsedCellColor = JSON.parse(JSON.stringify(this.getColorSetting));
       
        var currentRow = JSON.parse(JSON.stringify(this.row));
        var parsedCols = JSON.parse(JSON.stringify(this.columns));
        for(let i = 0; i < parsedCols.length; i++) {
            let currentData = {fieldName: parsedCols[i].fieldName};
            if(parsedCols[i].fieldName in currentRow) {
                currentData.data = currentRow[parsedCols[i].fieldName];
                currentData.type = parsedCols[i].type;
            }
            else {
                currentData.data = '';
            }
            if(currentData.fieldName === 'Id') continue;
            
            rowData.push(currentData);
        }

        // console.log(currentRow);

        return rowData;
    }
}