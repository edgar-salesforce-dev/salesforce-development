import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const MAX_WIDTH = 12;
const DEFAULT_COLUMNS = 1;

const FIELD_TYPES_MAP = new Map();
FIELD_TYPES_MAP.set('String', 'text');
FIELD_TYPES_MAP.set('Boolean', 'checkbox');
FIELD_TYPES_MAP.set('Url', 'text');

const VALID_KEYS_FOR_MAP = [ 'String', 'Boolean', 'Url' ];

const IS_FIELD_TYPE = new Map();
IS_FIELD_TYPE.set('Picklist', 'isPicklist');
IS_FIELD_TYPE.set('Reference', 'isReference');
IS_FIELD_TYPE.set('Checkbox', 'isCheckbox');
IS_FIELD_TYPE.set('Url', 'isUrl');

const PARENT_REFERENCE_MAP = new Map();
PARENT_REFERENCE_MAP.set('Group', 'User');

export default class DynamicForm extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api fields;
    @api columns = DEFAULT_COLUMNS;
    @api variant;

    @track fieldsUpdated = {};
    editMode;

    get formStyles() {
        let styles = [ 'slds-card', 'slds-var-p-around_small' ];
        switch(this.variant) {
            case 'shade':
                styles.push('slds-theme_shade');
            break;
            default:
                styles.push('slds-theme_default');
            break;
        }

        return styles;
    }

    get size() {
        return Math.floor(MAX_WIDTH / this.columns);
    }

    get formFields() {
        return this.buildFormFields();
    }

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo;

    @wire(getPicklistValuesByRecordType, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', objectApiName: '$objectApiName' })
    picklistFields;

    @wire(getRecord, { recordId: '$recordId', fields: '$fields' })
    record;

    buildFieldObject(field, value, options) {
        const newField = {
            readOnly: !(field.updateable),
            isRequired: field.required,
            label: field.label,
            name: field.apiName,
            type: VALID_KEYS_FOR_MAP.includes(field.dataType) ? FIELD_TYPES_MAP.get(field.dataType) : field.dataType.toLowerCase(),
            value: value,
            options: options,
            parentObject: field.dataType === 'Reference' ? this.mapParentObject(field.referenceToInfos[0].apiName) : '',
        }

        const prop = IS_FIELD_TYPE.get(field.dataType);
        if (prop) {
            newField[prop] = true;
        }

        return newField;
    }

    buildFormFields() {
        let formFields = [];

        if(this.objectInfo.data && this.record.data && this.picklistFields.data) {
            const allFieldsInObject = this.objectInfo.data.fields;
            formFields = this.fields.map(field => {
                const fieldRequested = allFieldsInObject[field.fieldApiName];
                const value = getFieldValue(this.record.data, field);
                const options = fieldRequested.dataType === 'Picklist' ? this.picklistFields.data.picklistFieldValues[field.fieldApiName].values : [];
                
                return this.buildFieldObject(fieldRequested, value, options);
            });
        }

        return formFields;
    }

    handleChange(event) {
        const inType = event.target.dataset.type;
        if (inType === 'reference') {
            this.fieldsUpdated[event.target.name] = event.detail.recordId;
        } else if (inType === 'checkbox') {
            this.fieldsUpdated[event.target.name] = event.detail.checked;
        }  else {
            this.fieldsUpdated[event.target.name] = event.detail.value;
        }
    }

    async handleSaveRecord(event){
        event.preventDefault();
        const fields = { 
            attributes: { type: this.objectApiName }, 
            Id: this.recordId, 
            ...this.fieldsUpdated 
        }
        
        const response = await updateRecord({ fields });
        if (response) {
            const message = 'Successfully updated...';
            this.showNotification('Success', message, 'success');
        } else {
            const message = 'Unable to updated record';
            this.showNotification('Error', message, 'error');
        }

        this.editMode = false;
        this.refresh();
    }

    handleEditMode (){
        this.editMode = true;
    }

    handleCancel() {
        this.editMode = false;
        this.refresh();
    }

    mapParentObject(objectApiName) {
        const mapObject = PARENT_REFERENCE_MAP.get(objectApiName);
        return mapObject ? mapObject : objectApiName;
    }

    async refresh(){
        await Promise.all([
            refreshApex(this.objectInfo), 
            refreshApex(this.picklistFields), 
            refreshApex(this.record)
        ]);
    }

    showNotification(title, message, variant){
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}