public with sharing class ExternalCallout {
    @AuraEnabled
    public static Object postCallout(String inputJson){
        Http  http = new Http();    
        HttpRequest request = new HttpRequest();
        Object responseBody;
        HttpResponse response;
        system.debug('InputJson in External Callout'+ inputJson);
        request.setEndpoint('callout:awsEndpoint');
        request.setMethod('POST');
        request.setHeader('Accept', 'application/json');
        request.setHeader('Content-Type','application/json;charset=UTF-8');
        request.setBody(inputJson);
        request.setTimeout(120000);
        try{
            response = http.send(request);
            system.debug('Response: '+ response);
            responseBody = response.getBody();
            system.debug('ResponseBody' + responseBody);
          }catch(System.CalloutException e){
            responseBody = e;
            system.debug('Callout error: '+ e); 
        }
        return responseBody;
   }
}