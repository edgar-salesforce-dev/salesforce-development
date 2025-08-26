public with sharing class PDPPokemonController {
    @AuraEnabled
    public static String getPokemonByNameOrId(String nameOrId){
        PokemonInformationWrapper response = new PokemonInformationWrapper();
        if(String.isEmpty(nameOrId)){
            response.error = Constants.POKE_NAME_REQUIRED;
            response.status = Constants.ERROR_STATUS;

            return JSON.serialize(response);
        }

        Map<String, Object> params = new Map<String, Object>();

        try {
            HttpRequest request = IntegrationService.buildHttpRequest(Constants.POKEMON_DETAILS, params);
            String endpoint = request.getEndpoint();
            request.setEndpoint(endpoint + '/' + nameOrId);
            Http h = new Http();
            HttpResponse httpRes = h.send(request);

            if(Constants.SUCCESS_STATUS_CODES.contains(httpRes.getStatusCode())){
                response.status = Constants.SUCCESS_STATUS;
                response.data = httpRes.getBody();
            } else {
                throw new AuraHandledException(httpRes.getBody());
            }
        } catch(Exception ex){
            response.status = Constants.ERROR_STATUS;
            response.error = ex.getMessage();
        }
        
        return JSON.serialize(response);
    }

    public class PokemonInformationWrapper {
        @AuraEnabled
        public Object data;
        @AuraEnabled
        public Object error;
        @AuraEnabled
        public String status;
    }
}