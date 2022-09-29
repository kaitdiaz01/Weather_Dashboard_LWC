import { LightningElement, api, track } from 'lwc';
import getDataList from '@salesforce/apex/DataTableController.getDataList';
import getFields from '@salesforce/apex/DataTableController.getFields';
import getDataTableObjectSettings from '@salesforce/apex/CellColorSettingController.getDataTableObjectSettings';

export default class Holder extends LightningElement {
    /* EDIT HERE */
    options = [
        { label: 'Weather Data', value: 'Weather_Data__c'},
    ]
    
    
    columns = [
        { title: "Name", fieldName: "Name", type: "string", width: "width:300px" },
    ]
    rows;



    @api dtableObjects;
    // comes from the public property to keep track of choice admin selects -> used to get ID

    dataTableObjectSettings;


    colorSetting; 

    dataType = 'Contact';
    currentSortedCol = '';
    sortOrder = 'ASC';
    columnReset = true;
    fieldOptions = [];

    currentlySelectedColumn = '';
    isSelected;

    newCol = '';

    columnModal = false;

    @track numberOfRecords;
    @track numberOfPage;
    totalNumberOfRecords;


    connectedCallback() { 
        this.loadData();
        this.loadFields();
        this.getObjectSettings();
    };


    // this is called on connected callback to return the results from the CellColorSettingController 
    getObjectSettings(){
        getDataTableObjectSettings({ObjectSettingId: this.dtableObjects})
        .then(result => {
            this.dataTableObjectSettings = JSON.parse(result);
            // set colorSetting variable to pass down to child datatable.js -> row.js -> cell.js (we want to go to cell.js to change colors)
            this.colorSetting = this.dataTableObjectSettings.columnSettings;
            console.log('datatableobjectsetting' , this.dataTableObjectSettings.columnSettings);
        }).catch(error => {
            console.error(error);
        })
    };

    handleRecordRefreshValues(event){
        this.numberOfRecords = event.detail.recordCount;
        console.log('this is record count in holder', this.numberOfRecords);
        this.numberOfPage = event.detail.pageCount;
        console.log('this is page count in holder', this.numberOfPage);

        this.loadData();
    };


    /* Loads all the information requested based on the columns
       and stores them in rows to be displayed */
    loadData() {
        var fieldsArr = [];
        if(this.columns.length > 0) {
            for(let i = 0; i < this.columns.length; i++) {
                fieldsArr.push(this.columns[i].fieldName);
            }
        }
        getDataList({fieldsArray: fieldsArr, sortQuery: this.currentSortedCol, sortOrder: this.sortOrder, dataType: this.dataType, numberOfRecords: this.numberOfRecords, numberOfPage: this.numberOfPage })
        .then(result => {
            console.log('records', result);
            this.rows = result;
            
            console.log('length of array', result.length);
            this.totalNumberOfRecords = result.length

            //this.globalVar = resultArr;
        })
        .catch(error => {
            console.error(error);
        })
    }


    /* Loads all the fields associated with a record type 
       and stores them */
    loadFields() {
        var selectionArr = [];
        var currentObj;
        getFields({dataType: this.dataType})
        .then(result => {
            console.log('result' , JSON.parse(JSON.stringify(result)));
            Object.entries(result).forEach(entry => {
                console.log('entry log', entry);
                currentObj = {
                    label: entry[1][2],
                    fieldName: entry[0],
                    value: entry[1][1],
                    type: entry[1][0].toLowerCase()
                }
                /* Our references are stored with a space, so we replace that with
                   a dot operator to cooperate with the apex class */
                if(currentObj.fieldName.includes(' ')) {
                    currentObj.fieldName = currentObj.fieldName.replace(/ /g,".");
                }
                selectionArr.push(currentObj);
            })
            
            this.fieldOptions = selectionArr;
        })
    }

    changeDataType(event) {
        this.dataType = event.detail.value;
        this.loadData();
        this.loadFields();
    }

    handleColumnInputChange(event) { this.newCol = event.detail.value; }

    handleColumnSort(event) {
        var index = event.detail;
        // console.log(index);
        this.columnReset = false;
        this.columns[index].sorted = true;
        if(this.currentSortedCol.length > 0) { // if we have a currently selected column already
            if(this.currentSortedCol === this.columns[index].fieldName) {
                /* we want to change the order from desc to asc / asc to desc
                   in the case that the current column is already selected
                   to be sorted */
                if(this.sortOrder === 'DESC') {
                    this.sortOrder = 'ASC';
                }
                else {
                    this.sortOrder = 'DESC';
                }
            }
            else {
                let previousSortedCol = this.currentSortedCol;
                let previousIndex = this.columns.findIndex(col => col.fieldName === previousSortedCol);
                this.columns[previousIndex].sorted = false;
            }
        }
        else {
            this.sortOrder = 'ASC';
        }
        // console.log(this.sortOrder);
        this.currentSortedCol = this.columns[index].fieldName;
        this.loadData();
        this.columnReset = true;
    }

    handleColumnDelete(event) {
        var columnIndex = this.columns.findIndex(col => col.fieldName === event.detail);
        
        this.columnReset = false;
        this.columns.splice(columnIndex, 1);
        this.loadData();
        this.columnReset = true;
    }

    handleColumnUpdate(event) {
        var payload = JSON.parse(JSON.stringify(event.detail));
        var sorted = false;
        if(this.columns[payload.index].sorted === true) {
            sorted = true;
        }
        this.columnsReset = false;
        this.columns[payload.index].title = payload.title;
        this.columns[payload.index].fieldName = payload.fieldName;
        this.columns[payload.index].type = payload.type;
        this.columns[payload.index].sorted = sorted;
        this.loadData();
        this.columnReset = true;
    }

    handleColumnAdd() {
        var colToAdd;
        if(this.newCol !== '') {
            this.columnReset = false;
            const selectedField = this.fieldOptions.find(field => field.value === this.newCol);
            console.log('selected field',selectedField);
            let label = selectedField.label// this adds a space in between the field name
            // if(label.includes('.')) {
            //     label = label.replaceAll('.', '');
            // }
          
            colToAdd = {title: label, fieldName: selectedField.fieldName, type: selectedField.type, width: "width:300px"};
            this.columns.push(colToAdd);
            this.loadData();
            this.newCol = '';
            this.columnReset = true;
            this.closeColumnCreation();
        }
    }

    @api openColumnCreation() { this.columnModal = true; }
    closeColumnCreation() { this.columnModal = false; }

    handleToSelect(event) {
        if(this.currentlySelectedColumn !== '') {
            let elementToRemoveClass = this.template.querySelector('[data-id="' + this.currentlySelectedColumn + '"]');
            elementToRemoveClass.classList.remove('currentlySelected');
        }
        this.currentlySelectedColumn = event.currentTarget.dataset.id;
        let element = this.template.querySelector('[data-id="' + event.currentTarget.dataset.id + '"]');
        element.classList.add('currentlySelected');
        this.isSelected = false; // this column is not in the selected array
    }
    handleToDeselect(event) {
        if(this.currentlySelectedColumn !== '') {
            let elementToRemoveClass = this.template.querySelector('[data-id="' + this.currentlySelectedColumn + '"]');
            elementToRemoveClass.classList.remove('currentlySelected');
        }
        this.currentlySelectedColumn = event.currentTarget.dataset.id;
        let element = this.template.querySelector('[data-id="' + event.currentTarget.dataset.id + '"]');
        element.classList.add('currentlySelected');
        this.isSelected = true; // this column is in the selected array
    }

    selectChoice() {
        var colToAdd;
    
        var selectedField = this.fieldOptions.find(field => field.fieldName === this.currentlySelectedColumn);

        // console.log(selectedField);
        var label = selectedField.label;
        // if(label.includes('.')) {
        //     label = label.replaceAll('.', '');
        // }
        if(this.isSelected === true || this.isSelected === undefined) return; // if its in the selection array we aren't going to move it
        this.columnReset = false;
        colToAdd = {title: label, fieldName: selectedField.fieldName, type: selectedField.type, width: "width:300px"};
        this.columns.push(colToAdd);
        this.loadData();
   
        this.columnReset = true;
        this.isSelected = undefined;
        let element = this.template.querySelector('[data-id="' + this.currentlySelectedColumn + '"]');
        element.classList.remove('currentlySelected');
        this.currentlySelectedColumn = '';
    }

    deselectChoice() {
        var selectedField = this.columns.findIndex(column => column.fieldName === this.currentlySelectedColumn);
        if(this.isSelected === false || this.isSelected === undefined) return; // if its in the deselected array we aren't going ot move it
        this.columnReset = false;
        this.columns.splice(selectedField, 1);
        this.loadData();
        this.columnReset = true;
        this.isSelected = undefined;
        let element = this.template.querySelector('[data-id="' + this.currentlySelectedColumn + '"]');
        element.classList.remove('currentlySelected');
        this.currentlySelectedColumn = '';
    }

    moveCurrentUp() {
        var index = this.columns.findIndex(column => column.fieldName === this.currentlySelectedColumn)
        if(index === 0 || index === -1 || this.isSelected !== true) return;
        let originalElement = this.columns[index - 1];
        this.columnReset = false;
        this.columns[index - 1] = this.columns[index];
        this.columns[index] = originalElement;
        this.loadData();
        this.columnReset = true;
    }
    moveCurrentDown() {
        var index = this.columns.findIndex(column => column.fieldName === this.currentlySelectedColumn)
        if(index === this.columns.length - 1 || index === -1 || this.isSelected !== true) return;
        let originalElement = this.columns[index + 1];
        this.columnReset = false;
        this.columns[index + 1] = this.columns[index];
        this.columns[index] = originalElement;
        this.loadData();
        this.columnReset = true;
    }

    get fieldSelections() {
        var selectionArr = [];
        var currentObj;
        for(let i = 0; i < this.fieldOptions.length; i++) {
            let label = this.fieldOptions[i].fieldName.replace(/([A-Z])/g, ' $1').trim(); // this adds a space in between the field name

            currentObj = {
                label: label,
                value: this.fieldOptions[i].value
            }

            selectionArr.push(currentObj);
        }

        return selectionArr;
    }

    get selectedOptions() {
        var selectedOptions = [];
        for(let i = 0; i < this.columns.length; i++) {
            selectedOptions.push({label: this.columns[i].fieldName, value: this.columns[i].fieldName});
        }

        return selectedOptions;
    }

    get unselectedOptions() {
        var unselectedOptions = [];

        for(let i = 0; i < this.fieldOptions.length; i++) {
            if(this.columns.findIndex(field => field.fieldName === this.fieldOptions[i].fieldName) === -1) {
                let label = this.fieldOptions[i].fieldName.replace(/([A-Z])/g, ' $1').trim(); // this adds a space in between the field name
                if(label.includes('.')) {
                    label = label.replaceAll('.', '');
                }
                unselectedOptions.push({label: label, value: this.fieldOptions[i].fieldName});
            }
        }
        return unselectedOptions;
    }
}