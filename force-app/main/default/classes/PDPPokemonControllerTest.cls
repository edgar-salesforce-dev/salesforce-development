@IsTest
public with sharing class PDPPokemonControllerTest {
    @IsTest
    static void successCallout(){
        Test.setMock(HttpCalloutMock.class, new SuccessMockCallout());

        Test.startTest();
        String mewtwo = PDPPokemonController.getPokemonByNameOrId('150');
        Test.stopTest();

        Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(mewtwo);
        Assert.isNotNull(result.get('data'));
    }

    @IsTest
    static void emptyCityErrorCallout(){
        Test.setMock(HttpCalloutMock.class, new SuccessMockCallout());

        Test.startTest();
        String response = PDPPokemonController.getPokemonByNameOrId('');
        Test.stopTest();

        Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(response);
        Assert.areEqual(Constants.POKE_NAME_REQUIRED, result.get('error'));
    }

    @IsTest
    static void errorCallout(){
        Test.setMock(HttpCalloutMock.class, new NegativeMockCallout());

        Test.startTest();
        String mew = PDPPokemonController.getPokemonByNameOrId('25000');
        Test.stopTest();

        Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(mew);
        Assert.isNotNull(result.get('error'));
    }

    class SuccessMockCallout implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest request){
            HttpResponse response = new HttpResponse();
            String body = '{"id": 150,"name": "mewtwo","weight": 1220}';
            response.setBody(body);
            response.setStatusCode(200);
            response.setStatus('OK');

            return response;
        }
    }
    class NegativeMockCallout implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest request){
            HttpResponse response = new HttpResponse();
            String body = 'ERROR MESSAGE';
            response.setBody(body);
            response.setStatusCode(404);

            return response;
        }
    }
}