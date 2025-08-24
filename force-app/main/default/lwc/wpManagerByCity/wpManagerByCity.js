import { LightningElement } from 'lwc';
import getWeatherInformation from '@salesforce/apex/WeatherProjectController.getWeatherInformation';

const VALID_KEYS = ['coord', 'main', 'wind', 'name'];

export default class WpManagerByCity extends LightningElement {
    isError;
    error;
    city;

    isLoading;
    isData;

    async handleGetWeatherInformation(e) {
        e.preventDefault();
        try {
            this.resetComponentProperties();
            const data = await getWeatherInformation({ city: this.city });
            const parsedData = JSON.parse(data);
            if(parsedData.status === 'SUCCESS'){
                const weatherData = JSON.parse(parsedData.data);
                for(let key in weatherData){
                    if(VALID_KEYS.includes(key)) {
                        this[key] = weatherData[key];
                    }
                }
                this.isData = true;
            } else {
                throw parsedData.error;
            }
        } catch(error) {
            this.isError = true;
            this.error = this.processErrorMessage(error);
        } finally {
            this.isLoading = false;
        }
    }

    handleCityChange(event){
        this.city = event.detail.value;
    }

    resetComponentProperties(){
        this.isLoading = true;
        this.isError = false;
        this.error = undefined;
        this.isData = false;
    }

    processErrorMessage(errorMessage){
        if(errorMessage.includes('Script-thrown')){
            return 'INVALID City...'
        } else {
            return errorMessage;
        }
    }
}