@IsTest
public with sharing class IntegrationServiceTest {
    @IsTest
    public static void buildRequestTest(){
        String service = 'WEATHER';
        Map<String, Object> params = new Map<String, Object>();
        params.put('q', 'London');
        params.put('units', 'metric');
        Test.startTest();
        HttpRequest request = IntegrationService.buildHttpRequest(service, params);
        Test.stopTest();
        Assert.isNotNull(request);
        Assert.areEqual('GET', request.getMethod());
    }

    @IsTest
    public static void buildRequestTestEmptyParams(){
        String service = 'TEST_EMPTY';
        Map<String, Object> params = new Map<String, Object>();
        Test.startTest();
        HttpRequest request = IntegrationService.buildHttpRequest(service, params);
        Test.stopTest();

        Assert.isNotNull(request);
        Assert.areEqual('GET', request.getMethod());
    }

    @IsTest
    public static void buildRequestTestEmptyService(){
        String service = '';
        Map<String, Object> params = new Map<String, Object>();
        Test.startTest();
        HttpRequest request = IntegrationService.buildHttpRequest(service, params);
        Test.stopTest();

        Assert.isNull(request);
    }
}