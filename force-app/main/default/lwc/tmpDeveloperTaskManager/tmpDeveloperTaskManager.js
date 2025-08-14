import { LightningElement, wire, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { errorNotificationMessages } from 'c/utilities';
import DEV_TASK_OBJECT from '@salesforce/schema/Developer_Task__c';
import STATUS_FIELD from '@salesforce/schema/Developer_Task__c.Status__c';
import retrieveAllDeveloperTask from '@salesforce/apex/TmpDeveloperTaskController.retrieveAllDeveloperTask';

export default class TmpDeveloperTaskManager extends NavigationMixin(LightningElement) {
    recordTypeId;
    statusOptions;
    @track fields = {};

    @wire(getObjectInfo, { objectApiName: DEV_TASK_OBJECT})
    handleTaskObjectInfo({ error, data }){
        if(data){
            this.recordTypeId = data.defaultRecordTypeId;
        } else if(error){
            this.recordTypeId = '';
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$recordTypeId', fieldApiName: STATUS_FIELD })
    handleStatusValues({ error, data }){
        if(data){
            this.statusOptions = data.values;
        } else if(error){
            this.statusOptions = [];
        }
    }

    @wire(retrieveAllDeveloperTask)
    devTasksData;

    handleInputChange(e){
        this.fields[e.target.name] = e.target.value;
    }

    async handleSubmit(e){
        e.preventDefault();
        const recordInput = { apiName: DEV_TASK_OBJECT.objectApiName, fields: this.fields }
        try {
            const devTaskRecord = await createRecord(recordInput);

            if(devTaskRecord){
                const message = 'New Developer Task created: {0}';
                const options = {
                    Id: devTaskRecord.id,
                    Name: devTaskRecord.fields.Name.value
                }
                this.showSuccessToast(message, options);
                this.resetFormFields();
            }
        } catch(error){
            const message = error?.body.message ?? 'Unable to Create Developer Task...'
            const messages = [ message ];
            errorNotificationMessages(messages, this);
        }
    }

    resetFormFields(){
        const inputForms = this.template.querySelectorAll('.input-form');
        inputForms.forEach(input => {
            input.value = undefined;
        });
    }
    showSuccessToast(message, options){
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: options.Id,
                actionName: 'view',
            },
        }).then((url) => {
            const event = new ShowToastEvent({
                title: 'Success!',
                message: message,
                messageData: [
                    {
                        url,
                        label: options.Name,
                    },
                ],
                variant: 'success'
            });
            this.dispatchEvent(event);
        });
    }
}