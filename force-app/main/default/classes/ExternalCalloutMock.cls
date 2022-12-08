@isTest
global class ExternalCalloutMock implements HttpCalloutMock {
    global HTTPResponse respond(HTTPRequest request) {
        // Create a fake response
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{"advisor_credentials":{"advisor_email_id":"TEST@TEST.COM","record_id":"abcdefg"}}');
        response.setStatusCode(200);
        return response; 
    }
}