import { LightningElement, wire } from 'lwc';
import getNotClosedCases from '@salesforce/apex/CaseServices.getNotClosedCases';
import { NavigationMixin } from 'lightning/navigation';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import { refreshApex } from '@salesforce/apex';
import { buildCustomPicklistColumn, buildCustomReferenceColumn } from 'c/utilities';
import { updateRecord } from 'lightning/uiRecordApi';
import { showToast } from 'c/utilities';

const BASE_COLS = [
    buildCustomReferenceColumn('Case Number', 'CaseNumber', 'standard:case', 'Id', 'CaseNumber')
];

const VALID_PICKLIST = ['Status', 'Type', 'Reason', 'Priority', 'Origin'];

export default class CaseManagerWithCustomTable extends NavigationMixin(LightningElement) {
    isData = false;
    isError = false;
    errorMessage = '';
    isLoading = true;
    
    data = [];
    initData;
    wiredCases;
    columns = BASE_COLS;
    draftValues = [];
    mapDraftValues = new Map();

    @wire(getObjectInfo, { 
        objectApiName: CASE_OBJECT
    }) objectInfo;

    @wire(getPicklistValuesByRecordType, { 
        objectApiName: CASE_OBJECT,
        recordTypeId: '$objectInfo.data.defaultRecordTypeId' 
    }) handlePicklistValues({ error, data }){
        if(data){
            const cols = [];
            for (let key in data.picklistFieldValues) {
                if(VALID_PICKLIST.includes(key)){
                    cols.push(buildCustomPicklistColumn(key, data.picklistFieldValues[key]));
                }
            }
            cols.push(buildCustomReferenceColumn('Account', 'AccountId', 'standard:account', 'AccountId', 'AccountName'));
            cols.push(buildCustomReferenceColumn('Contact', 'ContactId', 'standard:contact', 'ContactId', 'ContactName'));

            this.columns = [...this.columns, ...cols];
        } else if(error){
            const message = error?.body?.message ?? 'Something went wrong getting picklist values'
            showToast(this, 'Error!', message, undefined, 'error');
        } 
    }

    @wire(getNotClosedCases)
    handleCases(response){
        const { error, data } = response;
        this.wiredCases = response;

        if(data){
            this.initData = data;
            this.data = this.processData(data);
            this.isData = true;
            this.isLoading = false;
        } else if(error){
            this.data = [];
            this.isLoading = false;
            this.isError = true;
            this.errorMessage = error?.body?.message ?? 'Something Went Wrong getting Cases';
        }
    }

    handleCellChange(e){
        const newDraftValue = e.detail.draftValues[0];
        if(this.mapDraftValues.has(newDraftValue.Id)){
            const currentObject = this.mapDraftValues.get(newDraftValue.Id);
            const mergedObjects = Object.assign(currentObject, newDraftValue);
            this.mapDraftValues.set(newDraftValue.Id, mergedObjects);
        } else {
            this.mapDraftValues.set(newDraftValue.Id, newDraftValue);
        }

        const drafts = [];
        this.mapDraftValues.forEach(draftValue => {
            drafts.push(draftValue);
        });
        this.draftValues = drafts;
        
        this.updateDatatableByDraftChanges(undefined);
    }

    updateDatatableByDraftChanges(action){
        if(action === 'cancel'){
            this.data = this.processData(this.initData);
        } else {
            this.data = this.data.map(record => {
                let newRecord = { ...record };
                const draftValues = this.draftValues.find(draft => draft.Id === record.Id);
                if (draftValues){
                    newRecord = { ...newRecord, ...draftValues }
                }
                return newRecord;
            })
        }
    }

    processData(data){
        return data.map(record => {
            const newRecord = { ...record }
            newRecord.AccountName = record.Account.Name;
            newRecord.ContactName = record.Contact.Name;

            return newRecord;
        });
    }

    handleCancel(e){
        this.draftValues = [];
        this.data = [];
        this.mapDraftValues = new Map();
        this.updateDatatableByDraftChanges('cancel');
    }

    handleSave(e) {
        this.mapDraftValues = new Map();
        const recordsToUpdate = this.draftValues.map(fields => updateRecord({ fields }));
        this.draftValues = [];

        Promise.all(recordsToUpdate)
        .then(response => {
            const message = `${response.length}: records updated successfully...`;
            showToast(this, 'Success!', message, undefined, 'success');
            this.handleRefreshDataTable();
        }).catch(error => {
            const message = error?.body?.message ?? 'Somethng went wrong trying to update the records';
            showToast(this, 'Error!', message, undefined, 'error');
        })
    }

    async handleRefreshDataTable(){
        await refreshApex(this.wiredCases);
    }

    handleCreateCase(){
        const pageRef = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: CASE_OBJECT.objectApiName,
                actionName: 'new'
            }
        }
        this[NavigationMixin.Navigate](pageRef);
    }
}