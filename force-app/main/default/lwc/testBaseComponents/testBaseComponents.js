import { LightningElement } from 'lwc';
import getRecords from '@salesforce/apex/BaseComponentsController.getRecords';

const INVALID_PROPS = [ 'subpremise', 'validity' ];

const SECTIONS_OBJECTS = [ 'Accounts', 'Contacts', 'Opportunities' ];
const VALID_FIELD_TYPES = [ 'Phone', 'Email' ];

export default class TestBaseComponents extends LightningElement {
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
}