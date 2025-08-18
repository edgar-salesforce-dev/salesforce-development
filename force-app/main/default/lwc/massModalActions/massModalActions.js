import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import LightningConfirm from 'lightning/confirm';
import { deleteRecord } from 'lightning/uiRecordApi';

const TASKS_COLS = [
    { label: 'Task Number', fieldName: 'Name' },
    { label: 'Title', fieldName: 'Title__c' },
    { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Onwer Name', fieldName: 'OwnerName' },
];

const AVAILABLE_ACTIONS = [
    { type: 'delete', props: { variant: 'destructive', label: 'Delete Selected' } }
];

const DELETE_CONFIRM_OBJ = {
    message: 'Are you sure you want to delete selected records?',
    variant: 'header',
    label: 'Confirm Delete',
    theme: 'warning'
}

export default class MassModalActions extends LightningModal {
    @api data;
    @api context;
    @api action;
    @api headerLabel;
    selectedRows;

    // Footer Details
    buttonVariant;
    buttonLabel;

    get isValidAction(){
        return AVAILABLE_ACTIONS.some(action => action.type === this.action);
    }

    get columns(){
        switch(this.context){
            case 'tasks':
                return TASKS_COLS;
        }
    }

    get refinedData(){
        switch(this.context){
            case 'tasks':
                return this.refineTaskData();
        }

        return this.data;
    }

    connectedCallback(){
        this.actionDetails();
    }

    actionDetails(){
        if(this.isValidAction){
            const actionDetails = AVAILABLE_ACTIONS.find(action => action.type === this.action);
            console.log(actionDetails);
            this.buttonLabel = actionDetails.props.label;
            this.buttonVariant = actionDetails.props.variant;
        }
    }

    refineTaskData(){
        return this.data.map(record => {
            const newRecord = { ...record };
            newRecord.OwnerName = record.Owner__r.Name;

            return newRecord;
        });
    }

    handleRowSelection(e){
        this.selectedRows = e.detail.selectedRows;
    }

    handleCancelMassiveAction(e){
        this.close('Canceled');
    }

    handleMassiveAction(){
        switch(this.action){
            case 'delete':
                this.deleteSelectedData();
            break;
        }
    }

    async deleteSelectedData(){
        const confirmResult = await LightningConfirm.open(DELETE_CONFIRM_OBJ);

        if(confirmResult){
            const deleteRecords = this.selectedRows.map(recordSelected => deleteRecord(recordSelected.Id));
            
            Promise.all(deleteRecords)
            .then(() => {
                this.close('records deleted');
            }).catch(_error => {
                this.close('unable to delete');
            }).finally(() => {
                this.selectedRows = undefined;
            });
        } else {
            this.selectedRows = undefined;
            this.close('cancel delete');
        }

    }
}