public with sharing class IntegrationService {
    public static HttpRequest buildHttpRequest(String service, Map<String, Object> params){
        if(String.isEmpty(service)) {
            return null;
        }

        IntegrationService__mdt serviceMdt = [
            SELECT ID, DeveloperName, MasterLabel, API_Key__c, Endpoint__c, Method__c, Timeout__c, Service__c, Key_Reference__c
            FROM IntegrationService__mdt
            WHERE Service__c =: service
            LIMIT 1
        ];

        HttpRequest request = new HttpRequest();
        request.setMethod(serviceMdt.Method__c);
        request.setTimeout(Integer.valueOf(serviceMdt.Timeout__c * 1000));

        if(!String.isEmpty(serviceMdt.API_Key__c)) {
            params.put(serviceMdt.Key_Reference__c, serviceMdt.API_Key__c);
        }
        
        if(params.isEmpty()){
            request.setEndpoint(serviceMdt.Endpoint__c);
        } else {
            String endpoint = serviceMdt.Endpoint__c + buildEndpointParams(params);
            request.setEndpoint(endpoint);
        }

        return request;
    }

    private static String buildEndpointParams(Map<String, Object> params){
        Integer count = 0;
        String endpointParams = '?';
        for (String key : params.keySet()){
            if(count != 0){
                endpointParams += '&';
            }
            endpointParams += key + '=' + (String) params.get(key);
            count++;
        }

        return endpointParams;
    }
}