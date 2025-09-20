import { LightningElement } from 'lwc';

const INVALID_PROPS = [ 'subpremise', 'validity' ]

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
    handleInputLocationChange(event) {
        for (const key in event.detail) {
            this[key] = event.detail[key];
        }
    }

    handleInputAddressChange(event) {
        for (const key in event.detail) {
            if (INVALID_PROPS.includes(key)) continue;

            this[key] = event.detail[key];
        }
    }
}