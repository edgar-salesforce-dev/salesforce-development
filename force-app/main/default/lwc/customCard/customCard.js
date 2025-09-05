import { LightningElement, api } from 'lwc';

const NOT_ASIDE_MAIN_SIZE = { large: 12, medium: 12 };
const WITH_ASIDE_MAIN_SIZE = { large: 8, medium: 9 };

export default class CustomCard extends LightningElement {
    @api showTitle;
    @api iconName;

    @api withAside;
    @api variant;

    @api showFooter;

    get mainSize(){
        return this.withAside ? WITH_ASIDE_MAIN_SIZE : NOT_ASIDE_MAIN_SIZE;
    }

    get headerAndFooterVariant(){
        return ['slds-var-p-around_large', this.variant];
    }
}