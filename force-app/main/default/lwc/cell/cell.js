import { api, LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';



export default class Cell extends NavigationMixin(LightningElement) {
    @api cellInfo;
    @api apiName;
    @api rowId;
    @api getColorSetting;



    connectedCallback() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        // var parsedCellColor = JSON.parse(JSON.stringify(this.getColorSetting));

        // console.log(parsedCell)
    };

    // Navigate to View Record Page
    navigateToRecord() {
        // console.log(this.apiName);
        // console.log(this.rowId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.rowId,
                objectApiName: this.apiName,
                actionName: 'view'
            },
        });
    }

    /* Getters here are pretty straight forward,
       check the value type and then display that
       type on the cell HTML */
    get isText() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.fieldName === 'Name') return false;
        if (parsedCell.type === 'string' || parsedCell.type === 'picklist' || parsedCell.type === 'textarea' || parsedCell.type === 'id') return true;
        return false;
    }

    get isPhone() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.type === 'phone') return true;
        return false;
    }

    get isEmail() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.type === 'email') return true;
        return false;
    }

    get isDate() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.type === 'date') return true;
        return false;
    }

    get isDateTime() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.type === 'datetime') return true;
        return false;
    }

    get isAddress() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.type === 'address') return true;
        return false;
    }

    get isPercent() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.type === 'percent') return true;

        return false;
    }

    get isDecimal() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.type === 'decimal' || parsedCell.type === 'double') return true;
        return false;
    }

    get isCurrency() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.type === 'currency') return true;
        return false;
    }

    get isUrl() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.type === 'url') return true;
        return false;
    }

    get isBool() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.type === 'boolean') return true;
        return false;
    }

    get isInteger() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.type === 'number') return true;
        return false;
    }

    get isReference() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        if (parsedCell.fieldName === 'Name') return true;
        return false;
    }



    // this is in cell html 
    get cellColor() {
        var parsedCell = JSON.parse(JSON.stringify(this.cellInfo));
        var parsedColorSetting = JSON.parse(JSON.stringify(this.getColorSetting));
        console.log('parsed color setting', parsedColorSetting);

        // for (let i = 0; i < parsedColorSetting[0].cellColorSettings[i].condition.length; i++) {

        //     switch (parsedColorSetting[0].cellColorSettings[i].condition) {
        //         case 'greater than':
        //             if (parsedCell.data > parsedColorSetting[0].cellColorSettings[0].dataValue && parsedColorSetting[0].fieldAPIName === parsedCell.fieldName) {  
        //                     return parsedColorSetting[0].cellColorSettings[0].color;
        //             } 
        //             break;
        //         case 'less than':
        //             if (parsedCell.data < parsedColorSetting[0].cellColorSettings[1].dataValue && parsedColorSetting[0].fieldAPIName === parsedCell.fieldName) {
        //                     // returns yellow
        //                     return parsedColorSetting[0].cellColorSettings[1].color;
        //                 }
        //             break;
        //             default: 'colorblack';
        //             break;
        //     }
        // }


        // setting temperature column here based of the array and making sure its equal to the fieldName 
        if (parsedColorSetting[0].cellColorSettings[0].condition === 'greater than' && parsedColorSetting[0].fieldAPIName === parsedCell.fieldName) {
            if (parsedCell.data > parsedColorSetting[0].cellColorSettings[0].dataValue) {
                // returning whichever color is chosen from custom metadata and then in cell.css setting that class we return 
                return parsedColorSetting[0].cellColorSettings[0].color;
            }
        }

        // setting color for temp column again
        if (parsedColorSetting[0].cellColorSettings[1].condition === 'less than' && parsedColorSetting[0].fieldAPIName === parsedCell.fieldName) {
            if (parsedCell.data < parsedColorSetting[0].cellColorSettings[1].dataValue) {
                
                return parsedColorSetting[0].cellColorSettings[1].color;
            }
        }

        // setting color for humidity column using same logic as above
        if (parsedColorSetting[2].cellColorSettings[0].condition === 'greater than' && parsedColorSetting[2].fieldAPIName === parsedCell.fieldName) {
            if (parsedCell.data > parsedColorSetting[2].cellColorSettings[0].dataValue) {
                return parsedColorSetting[2].cellColorSettings[0].color;
            }
        }

        // setting color for humidity for less than condition
        if (parsedColorSetting[2].cellColorSettings[1].condition === 'less than' && parsedColorSetting[2].fieldAPIName === parsedCell.fieldName) {
            if (parsedCell.data < parsedColorSetting[2].cellColorSettings[1].dataValue) {
                return parsedColorSetting[2].cellColorSettings[1].color;
            }
        }
        else {
            return 'colorblack';
        }



    };


}

