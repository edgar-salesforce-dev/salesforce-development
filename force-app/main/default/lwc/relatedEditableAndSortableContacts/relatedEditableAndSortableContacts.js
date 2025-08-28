import { LightningElement, api, wire } from 'lwc';
import getRelatedContacts from '@salesforce/apex/AccountService.getRelatedContacts';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import { deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ModalContact from 'c/modalContact';
import { refreshApex } from "@salesforce/apex";

const ACTIONS = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
    { label: 'Add Campaign', name: 'add_campaign' },
];

const ACTIONS_COL = {
        type: 'action',
        typeAttributes: {
            rowActions: ACTIONS,
            menuAlignment: 'auto'
        }
    }

const BASE_FIELDS = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Birthdate', fieldName: 'Birthdate', type: 'date', editable: true },
    { label: 'Languages', fieldName: 'Languages__c', editable: true },
    { label: 'Email', fieldName: 'Email', type: 'email', editable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
    ACTIONS_COL
];

const MORE_THEN_FIVE = '+5';

export default class RelatedEditableAndSortableContacts extends NavigationMixin(LightningElement) {
    @api recordId;
    data = [];
    numberOfRelatedContacts;
    wiredData;
    errorMessage;

    draftValues = [];

    _cols = BASE_FIELDS;
    get columns(){
        return this._cols;
    }

    set columns(value){
        this._cols = value;
    }

    get fields(){
        const fields = [];
        for(let col of this.columns){
            if(col.fieldName){
                fields.push(col.fieldName);
            } else {
                continue;
            }
        }

        return fields.join(',');
    }

    @wire(getRelatedContacts, { accountId: '$recordId', fields: '$fields' })
    handleRelatedContacts(response){
        this.wiredData = response;
        const { error, data } = response;
        if(data){
            this.errorMessage = '';
            if(data.length > 5) {
                this.numberOfRelatedContacts = MORE_THEN_FIVE;
                this.data = data.slice(0,5);
            } else {
                this.numberOfRelatedContacts = data.length;
                this.data = data;
            }
        } else if(error){
            const message = error?.body?.message ?? 'Something Went Wrong';
            this.errorMessage = message;
            this.data = [];
        }
    }

    handleNavigateToRelatedList(){
        const pageRef = {
            type: 'standard__recordRelationshipPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Account',
                relationshipApiName: 'Contacts',
                actionName: 'view'
            }
        }

        this[NavigationMixin.Navigate](pageRef);
    }

    handleSetupFields(){
        this.openModalAndExecuteAction('setting-fields', undefined, 'Choose Fields to Display', 'small')
        .then(res => {
            if(res === undefined) return;
            const response = JSON.parse(res);
            if(response.status === 'SUCCESS'){
                const newCols = [];
                for(let field of response.fields){
                    const isEditable = field.dataType !== 'Reference';
                    newCols.push({
                        label: field.label,
                        fieldName: field.apiName,
                        editable: isEditable,
                        type: isEditable ? field.dataType.toLowerCase() : undefined
                    })
                }
                newCols.push(ACTIONS_COL);
                this.columns = newCols;
            }
        }).catch(error => {
            const toastError = new ShowToastEvent({
                title: 'Error!',
                message: error.detail,
                variant: 'error'
            });
            this.dispatchEvent(toastError);
        })
    }

    handleCreateRelatedContact(){
        const defaultValues = encodeDefaultFieldValues({
            AccountId: this.recordId,
        });
        
        const pageRef = {
            type: 'standard__objectPage',
            attributes: {
                actionName: 'new',
                objectApiName: 'Contact'
            },
            state: {
                defaultFieldValues: defaultValues
            }
        }

        this[NavigationMixin.Navigate](pageRef);
    }

    handleRowActionSelected(event){
        const { action: { name }, row: { Id } } = event.detail;

        switch(name){
            case 'edit':
                this.navigateToEdit(Id);
            break;
            case 'delete':
                this.deleteRecordAction(Id);
            break;
            case 'add_campaign':
                this.addCampaignAction(name, Id);
            break;
        }
    }
    navigateToEdit(id){
        const pageRef = {
            type: 'standard__recordPage',
            attributes: {
                actionName: 'edit',
                recordId: id,
                objectApiName: 'Contact'
            }
        }

        this[NavigationMixin.Navigate](pageRef);
    }

    deleteRecordAction(id) {
        deleteRecord(id)
        .then(() => {
            const toastSuccess = new ShowToastEvent({
                title: 'Success!',
                message: 'Record Deleted Successfully...',
                variant: 'success'
            });
            this.dispatchEvent(toastSuccess);
        }).catch(error => {
            const toastError = new ShowToastEvent({
                title: 'Error!',
                message: error?.body?.message ?? 'Something Went Wrong...',
                variant: 'error'
            });
            this.dispatchEvent(toastError);
        })
    }

    addCampaignAction(action, id){
        this.openModalAndExecuteAction(action, id, 'Choose a Campaign', 'small')
        .then(res => {
            if(res === undefined) return;
            const response = JSON.parse(res);
            if(response.status === 'CANCELED'){
                const toastError = new ShowToastEvent({
                    title: 'Canceled!',
                    message: 'Canceled Action',
                    variant: 'info'
                });
                this.dispatchEvent(toastError);
            } else if(response.status === 'SUCCESS'){
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: response.recordId,
                        actionName: 'view',
                    },
                }).then((url) => {
                    const event = new ShowToastEvent({
                        title: 'Success!',
                        message: 'Contact added successfully. {0}!',
                        messageData: [
                            {
                                url,
                                label: 'See Details',
                            },
                        ],
                        variant: 'success'
                    });
                    this.dispatchEvent(event);
                });
            } else if(response.status === 'ERROR'){
                throw response.error;
            }
        }).catch(error => {
            const toastError = new ShowToastEvent({
                title: 'Error!',
                message: error.detail,
                variant: 'error'
            });
            this.dispatchEvent(toastError);
        });
    }

    async openModalAndExecuteAction(action, id, header, size){
        const response = await ModalContact.open({
            action: action,
            header: header,
            contactId: id,
            size: size,
            description: 'Reusable modal to choose fields to display and add contact to a campaign',
            baseFields: this.fields
        });

        return response;
    }

    handleSave(event){
        this.draftValues = event.detail.draftValues;
        console.log(JSON.stringify(this.draftValues));

        const updatedPromises = this.draftValues.map(fields => updateRecord({ fields }));

        Promise.all(updatedPromises)
        .then(async res => {
            this.draftValues = [];
            this.refreshRelatedList(this.wiredData);
        }).catch(error => {
            this.draftValues = [];
            const toastError = new ShowToastEvent({
                title: 'Error!',
                message: error.body.message || 'Something Went Wrong',
                variant: 'error'
            });
            this.dispatchEvent(toastError);
        })
    }

    async refreshRelatedList(data){
        await refreshApex(data);
    }

    handleRefresh(){
        this.refreshRelatedList(this.wiredData);
    }

    currentlyInDevelopment(){
        const toastInfo = new ShowToastEvent({
            title: 'Info!',
            message: 'Functionality currently in development...',
            variant: 'info'
        });
        this.dispatchEvent(toastInfo);
    }
}