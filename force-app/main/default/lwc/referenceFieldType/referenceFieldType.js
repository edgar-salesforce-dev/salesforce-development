import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ReferenceFieldType extends NavigationMixin(LightningElement) {
    @api icon;
    @api size;
    @api name;
    @api variant;
    @api recordId;

    handleClick(event){
        const pageReference = {
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                actionName: 'view'
            }
        }
        
        this[NavigationMixin.Navigate](pageReference);
    }
}