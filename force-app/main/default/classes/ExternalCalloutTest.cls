@isTest
private class ExternalCalloutTest {
    @isTest
    static void testCallout() {
        Test.startTest();
        //Set mock callout class 
        Test.setMock(HttpCalloutMock.class, new ExternalCalloutMock());
        String inputJson = '{"advisor_credentials":{"advisor_email_id":"TEST@TEST.COM","record_id":"abcdefg"}}';
        Object response = ExternalCallout.postCallout(inputJson);
        System.assert(response != null);
    }
}