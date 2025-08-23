@IsTest
public with sharing class WeatherProjectControllerTest {
    @IsTest
    static void successCallout(){
        Test.setMock(HttpCalloutMock.class, new SuccessMockCallout());

        Test.startTest();
        String response = WeatherProjectController.getWeatherInformation('Monterrey');
        Test.stopTest();

        Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(response);
        Assert.isNotNull(result.get('data'));
    }

    @IsTest
    static void emptyCityErrorCallout(){
        Test.setMock(HttpCalloutMock.class, new SuccessMockCallout());

        Test.startTest();
        String response = WeatherProjectController.getWeatherInformation('');
        Test.stopTest();

        Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(response);
        Assert.areEqual(Constants.CITY_REQUIRED_WEATHER, result.get('error'));
    }

    @IsTest
    static void errorCallout(){
        Test.setMock(HttpCalloutMock.class, new NegativeMockCallout());

        Test.startTest();
        String response = WeatherProjectController.getWeatherInformation('Monterrey');
        Test.stopTest();

        Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(response);
        Assert.isNotNull(result.get('error'));
    }

    class SuccessMockCallout implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest request){
            HttpResponse response = new HttpResponse();
            String body = '{"coord":{"lon":-100.3167,"lat":25.6667},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"base":"stations"}';
            response.setBody(body);
            response.setStatusCode(201);
            response.setStatus('OK');

            return response;
        }
    }
    class NegativeMockCallout implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest request){
            HttpResponse response = new HttpResponse();
            String body = 'ERROR MESSAGE';
            response.setBody(body);
            response.setStatusCode(401);

            return response;
        }
    }
}