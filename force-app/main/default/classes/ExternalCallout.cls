public with sharing class ExternalCallout {
    @AuraEnabled
    public static Object postCallout(String inputJson){
        Http  http = new Http();    
        HttpRequest request = new HttpRequest();
        Object responseBody;
        HttpResponse response;
        system.debug('InputJson in External Callout'+ inputJson);
        //request.setEndpoint('http://keen-qa-server-load-balancer-2106496524.us-west-2.elb.amazonaws.com:8080/post');
        request.setEndpoint('callout:awsEndpoint');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json');
        //request.setBody('{"advisor_credentials": {"advisor_email_id": "arthi@choosekeen.com","record_id": "abcdefg"},"contact_details": {"salutation": "Mr","first_name": "John","last_name": "Mathew","date_of_birth": "01/01/1961","zipcode": "11001","email": "sashikanth.arepalli@choosekeen.com","phone_number": "9999999999","method_of_contact": "phone"},"customer_profile": {"county": "QUEENS","plan_types": {"med_adv_partd": "y","partd": "y","med_sup": "y","med_adv": "y","special_needs": "y"},"plan_year": "2023","med_pharmacy":"Costco","medications": [{"medication_name": "Abelcet","dosage": "ae","package": "abc","quantity": "10","frequency": "2"}, {"medication_name": "Abelc","dosage": "ae","package": "abc","quantity": "10","frequency": "2"}],"priority":  ["any_provider", "keep_current", "traveller", "dental","vision", "hearing", "insulin", "otc", "transportation"],"provider_details": [{"zip_code": "12110","city": "Latham","state": "","last_name": "sack","first_name": "jessica"}],"currently_enrolled": "n","current_plan": "a","current_plan_type": "supplement","how_often": "rarely","extra_help": "y","drug_copay": "1to4","monthly_premium": "25","add_indemnity": "y/n","indemnity_details": {"effective_date": "01/01/2023","date_of_birth": "01/01/1960","part_b_effective_date": "Feb/2023","gender": "male","tobacco_use": "y","household_discount": "y"}}}');
        request.setBody(inputJson);
        request.setTimeout(120000);
        try{
            response = http.send(request);
            system.debug('Response: '+ response);
            responseBody = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            system.debug('ResponseBody' + responseBody);
          }catch(System.CalloutException e){
            responseBody = e;
            system.debug('Callout error: '+ e); 
        }
        return responseBody;
   }
}
/* public with sharing class ExternalCallout {
    @AuraEnabled
    public static Object postCallout(String inputJson){
        Http  http = new Http();    
        HttpRequest request = new HttpRequest();
        Object responseBody;
        HttpResponse response;
        request.setEndpoint('http://keen-qa-server-load-balancer-2106496524.us-west-2.elb.amazonaws.com:8080/post');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json');
        request.setBody('{"advisor_credentials": {"advisor_email_id": "arthi@choosekeen.com","record_id": "abcdefg"},"contact_details": {"salutation": "Mr","first_name": "John","last_name": "Mathew","date_of_birth": "01/01/1961","zipcode": "11001","email": "sashikanth.arepalli@choosekeen.com","phone_number": "9999999999","method_of_contact": "phone"},"customer_profile": {"county": "QUEENS","plan_types": {"med_adv_partd": "y","partd": "y","med_sup": "y","med_adv": "y","special_needs": "y"},"plan_year": "2023","med_pharmacy":"Costco","medications": [{"medication_name": "Abelcet","dosage": "ae","package": "abc","quantity": "10","frequency": "2"}, {"medication_name": "Abelc","dosage": "ae","package": "abc","quantity": "10","frequency": "2"}],"priority":  ["any_provider", "keep_current", "traveller", "dental","vision", "hearing", "insulin", "otc", "transportation"],"provider_details": [{"zip_code": "12110","city": "Latham","state": "","last_name": "sack","first_name": "jessica"}],"currently_enrolled": "n","current_plan": "a","current_plan_type": "supplement","how_often": "rarely","extra_help": "y","drug_copay": "1to4","monthly_premium": "25","add_indemnity": "y/n","indemnity_details": {"effective_date": "01/01/2023","date_of_birth": "01/01/1960","part_b_effective_date": "Feb/2023","gender": "male","tobacco_use": "y","household_discount": "y"}}}');
        request.setTimeout(120000);
        try{
            response = http.send(request);
            responseBody = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            System.debug(responseBody);
          }catch(System.CalloutException e){
            responseBody = e;
            System.debug('Callout error: '+ e); 
        }
        return responseBody;
   }
} */