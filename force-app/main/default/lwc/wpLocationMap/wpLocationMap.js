import { LightningElement, api } from 'lwc';

export default class WpLocationMap extends LightningElement {
    @api coord;
    
    get mapMarkers(){
        const marker = {
            location: {
                Latitude: this.coord.lat,
                Longitude: this.coord.lon,
            }
        }
        return [ marker ];
    }
}