import { api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import LightningModal from 'lightning/modal';
import CONTACT_OBJ from '@salesforce/schema/Contact';

export default class ModalContact extends LightningModal {
    @api action;
    @api header;
    @api contactId;
    @api baseFields;
    response;
    campaignId;
    defaultStatus = 'Sent';

    listOptions = [];
    selectedFields = [];
    fields = [];

    get limitsReached(){
        return this.selectedFields.length < 2 || this.selectedFields.length > 8;
    }

    get isSettingFields(){
        return this.action === 'setting-fields';
    }

    get isAddCampaignAction(){
        return this.action === 'add_campaign';
    }

    get disableConfirm(){
        return this.isAddCampaignAction || this.limitsReached;
    }

    get currentFields(){
        return this.selectedFields.join(',');
    }

    @wire(getObjectInfo, { objectApiName: CONTACT_OBJ.objectApiName })
    handleObjectInfo({ error, data }){
        if(data){
            const { fields } = data;
            const validFields = [];
            for(let key in fields){
                if(fields[key].updateable){
                    this.fields.push(fields[key]);
                    validFields.push({
                        label: fields[key].label,
                        value: fields[key].apiName
                    });
                }
            }

            this.listOptions = validFields;
            this.selectedFields = this.baseFields.split(',');
        } else if(error){
            console.error(error);
        }
    }

    handleSelectCampaign(event){
        this.campaignId = event.detail.recordId;
    }

    handleSubmitForm(event){
        event.target.submit();
    }

    handleSuccess(event){
        const details = {
            recordId: event.detail.id,
            status: 'SUCCESS',
            error: undefined
        }
        this.response = JSON.stringify(details);
        this.closeModal();
    }

    handleErrors(event){
        const details = {
            recordId: undefined,
            status: 'ERROR',
            error: event.detail
        }
        this.response = JSON.stringify(details);
        this.closeModal();
    }

    handleCancel(){
        const details = {
            recordId: undefined,
            status: 'CANCELED',
            error: undefined
        }
        this.response = JSON.stringify(details);
        this.closeModal();
    }

    handleFieldsChange(event) {
        this.selectedFields = event.detail.value;
    }

    handleConfirm(){
        const filterSelected = this.fields.filter(field => this.selectedFields.includes(field.apiName));
        const details = {
            fields: filterSelected,
            status: 'SUCCESS',
            error: undefined
        }
        this.response = JSON.stringify(details);
        this.closeModal();
    }

    closeModal(){
        this.close(this.response);
    }
}