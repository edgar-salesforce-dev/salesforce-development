import { LightningElement } from 'lwc';
import getPokemonByNameOrId from '@salesforce/apex/PDPPokemonController.getPokemonByNameOrId';
import { capitalizeString, errorNotificationMessages } from 'c/utilities';
import { loadStyle } from 'lightning/platformResourceLoader';
import POKEMON_TYPES_COLOR from '@salesforce/resourceUrl/pokemonTypesColors';

const VALID_KEYS = ['name', 'id', 'height', 'weight', 'sprites', 'types', 'abilities'];
const BASE_STYLES = 'details-card'

export default class PdPokedex extends LightningElement {
    pokemonId;
    isData;
    isError;
    error;

    isLoading;

    detailsStyles = BASE_STYLES;

    get pokemonImage(){
        return this.sprites.front_default || this.sprites.front_shiny;
    }

    get capName(){
        return capitalizeString(this.name);
    }

    get pokeTypes(){
        return this.types.map(type => {
            const newType = { ...type }
            newType.name = capitalizeString(type.type.name);
            newType.style = 'slds-badge slds-var-m-vertical_x-small ' + type.type.name;

            return newType;
        });
    }

    get abilitiesInfo() {
        return this.abilities.map(ability => capitalizeString(ability.ability.name));
    }

    connectedCallback(){
        this.loadPokemonTypesColors();
    }

    async handleSearchPokemon(e){
        e.preventDefault();
        try {
            this.resetComponentProperties();
            const result = await getPokemonByNameOrId({ nameOrId: this.pokemonId });
            const data = JSON.parse(result);
            if(data.status === 'SUCCESS'){
                const pokemonInfo = JSON.parse(data.data);
                for(let key in pokemonInfo){
                    if(VALID_KEYS.includes(key)){
                        this[key] = pokemonInfo[key];
                    }
                }
                this.isData = true;
                this.detailsStyles += ' show'; 
            } else {
                throw data.error;
            }
        } catch(error) {
            this.isError = true;
            this.error = this.processErrorMessage(error);
        } finally {
            this.isLoading = false;
        }
    }

    resetComponentProperties(){
        this.isLoading = true;
        this.isError = false;
        this.error = undefined;
        this.isData = false;
        this.detailsStyles = BASE_STYLES;
    }

    handlePokemonChange(e){
        this.pokemonId = e.target.value;
    }

    processErrorMessage(errorMessage){
        if(errorMessage.includes('Script-thrown')){
            return 'Not Found'
        } else {
            return errorMessage;
        }
    }

    loadPokemonTypesColors(){
        try {
            loadStyle(this, POKEMON_TYPES_COLOR);
        } catch(error){
            const message = error?.body?.message ?? JSON.stringify(error);
            errorNotificationMessages([ message ], this);
        }
    }
}