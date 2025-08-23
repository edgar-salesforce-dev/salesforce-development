public with sharing class WeatherProjectController {
    @AuraEnabled
    public static String getWeatherInformation(String city){
        WeatherInformationWrapper response = new WeatherInformationWrapper();
        if(String.isEmpty(city)){
            response.error = Constants.CITY_REQUIRED_WEATHER;
            response.status = Constants.ERROR_STATUS;

            return JSON.serialize(response);
        }

        Map<String, Object> params = new Map<String, Object>();
        params.put('q', EncodingUtil.urlEncode(city, 'UTF-8'));
        params.put('units', 'metric');

        try {
            HttpRequest request = IntegrationService.buildHttpRequest(Constants.WEATHER_SERVICE, params);
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

    public class WeatherInformationWrapper {
        @AuraEnabled
        public Object data;
        @AuraEnabled
        public Object error;
        @AuraEnabled
        public String status;
    }
}