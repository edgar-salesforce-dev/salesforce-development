import { LightningElement } from 'lwc';
import getRecords from '@salesforce/apex/BaseComponentsController.getRecords';
import LightningConfirm from 'lightning/confirm';
import LightningAlert from 'lightning/alert';
import LightningPrompt from 'lightning/prompt';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { capitalizeString } from 'c/utilities';
import { NavigationMixin } from 'lightning/navigation'

const INVALID_PROPS = [ 'subpremise', 'validity' ];

const SECTIONS_OBJECTS = [ 'Accounts', 'Contacts', 'Opportunities' ];
const VALID_FIELD_TYPES = [ 'Phone', 'Email' ];

export default class TestBaseComponents extends NavigationMixin(LightningElement) {
    // Location
    latitude = '37.7938460';
    longitude = '-136.3948370';

    street = '121 Spear St.';
    city = 'San Francisco';
    country = 'US';
    province = 'CA';
    postalCode = '94105';

    get mapMarkers() {
        return [
            { 
                location: { Latitude: this.latitude, Longitude: this.longitude } 
            }, { 
                location: { City: this.city, Country: this.country, PostalCode: this.postalCode, State: this.province, Street: this.street } 
            },
        ];
    }
    handleInputLocationAddressChange(event) {
        this.handleLocationAddressProps(event.detail);
    }

    handleLocationAddressProps(details) {
        console.log(details);
        for (const key in details) {
            if (INVALID_PROPS.includes(key)) continue;

            this[key] = details[key];
        }
    }

    /**
     * CONNECTED CALLBACK Method
     */
    connectedCallback() {
        this.handleGetObjectData();
        this.generateAccountUrl();
    }

    /**
     * Accordion & Accordion Section
     */
    isLoadingAccordion = true;
    sections = [];
    activeSection = SECTIONS_OBJECTS[0];

    handleSectionToggle(event) {
        this.activeSection = event.detail.openSection;
    }

    async handleGetObjectData() {
        const sections = [];

        for (const obj of SECTIONS_OBJECTS) {
            const data = await getRecords({ objects: obj });
            
            const cols = [];
            
            for (const field in data[0]) {
                if (field === 'Id') continue;
                const col = {
                    label: field,
                    fieldName: field,
                    type: VALID_FIELD_TYPES.includes(field) ? field.toLowerCase() : 'text'
                }
                cols.push(col);
            }
            
            const section = {
                name: obj,
                data: data,
                cols: cols
            }

            sections.push(section);
        }

        this.sections = sections;
        this.isLoadingAccordion = false;
    }
    /**
     * LightningConfirm module
     */
    confirmLabel = 'Confirm';
    async handleConfirm() {
        const result = await LightningConfirm.open({
            message: 'You are about to confirm something. Click "OK" to confirm, otherwise click "Cancel"',
            variant: 'header',
            label: 'Confirm Modal'
        });
        // result = true (OK) || false (Cancels)
        console.log(result);
        if (result) {
            this.confirmLabel = 'Confirmed';
        } else {
            this.confirmLabel = 'Canceled';
        }
    }
    /**
     * LightningAlert module
     * open:
     *  {variant}: headerless, header
     *  {theme}: default, shade, inverse, alt-inverse, success, info, warning, error, offline
     */
    alertLabel = 'Alert';
    async handleAlert() {
        await LightningAlert.open({
            message: 'This is an alert message, read carefully',
            variant: 'header',
            theme: 'warning',
            label: 'Warning'
        });
        // Code after close alert.
        this.alertLabel = 'Alerted';
    }
    /**
     * LightningPrompt module
     * open:
     *  {variant}: headerless, header
     *  {theme}: default, shade, inverse, alt-inverse, success, info, warning, error, offline
     */
    async handlePrompt() {
        LightningPrompt.open({
            message: 'Enter your age (e.g., 21)',
            variant: 'header',
            theme: 'info',
            label: 'Enter the Info',
            defaultValue: 'age',
        }).then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        })
    }
    /**
     * { ShowToastEvent }
     */
    handleToastEvent(event) {
        const variant = event.target.name;
        
        const toast = new ShowToastEvent({
            variant: variant,
            title: capitalizeString(variant),
            message: 'Toast Message goes here...',
            mode: 'sticky'
        });

        this.dispatchEvent(toast);
    }

    /**
     * lightning-title
     */
    accountUrl;
    titleActions = [
        { label: 'Edit', value: 'edit', iconName: 'utility:edit' },
        { label: 'Delete', value: 'delete', iconName: 'utility:delete' },
    ];
    generateAccountUrl() {
        const pageReference = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'home',
            },
        }

        this[NavigationMixin.GenerateUrl](pageReference)
        .then((url) => {
            this.accountUrl = url;
        });
    }

    handleTitleActions(event) {
        console.log(event.detail.action);
    }

    /**
     * lightning-select
     */
    selectedOption = 'youtube';
    selectedOptionMultiple;

    get selectOptions() {
        return [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Amazon Prime', value: 'amazon' },
            { label: 'HBO Max', value: 'hbo' },
            { label: 'Netflix', value: 'netflix' },
        ];
    }

    handleSelectChange(event) {
        if(typeof event.detail.value === 'string') {
            this.selectedOption = event.detail.value;
        } else {
            this.selectedOptionMultiple = event.detail.value;
        }
    }
}