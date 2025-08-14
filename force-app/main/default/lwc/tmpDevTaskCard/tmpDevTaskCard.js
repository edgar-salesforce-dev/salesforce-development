import { LightningElement, api } from 'lwc';

export default class TmpDevTaskCard extends LightningElement {
    @api task;

    get cardStyles(){
        if(this.task.Status__c === 'Not Started') {
            return 'slds-box';
        } else if(this.task.Status__c === 'In Progress'){
            return 'slds-box slds-theme_shade';
        } else {
            return 'slds-box slds-theme_success'
        }
    }

    handleNavigate(e){
        this.navigateTo(this.task.Id, 'view');
    }

    openForEdit(e) {
        this.navigateTo(this.task.Id, 'edit');
    }

    handleNavigateOwner(){
        this.navigateTo(this.task.Owner__c, 'view')
    }

    navigateTo(recordId, action){
        const navigate = new CustomEvent('navigate', {
            detail: {
                recordId,
                action
            }
        });

        this.dispatchEvent(navigate);
    }
}