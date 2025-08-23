public with sharing class Constants {
    public static final String WEATHER_SERVICE = 'WEATHER';
    public static final String SUCCESS_STATUS = 'SUCCESS';
    public static final String ERROR_STATUS = 'ERROR';
    public static final List<Integer> SUCCESS_STATUS_CODES = new List<Integer>{ 200, 201, 202 };
    public static final String CITY_REQUIRED_WEATHER = 'City is REQUIRED in order to retrieve weather information';
}