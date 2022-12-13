public with sharing class SOADupCheckAndCreateController {
 
        @AuraEnabled
        public static List<Account> matchedAccounts(String firstName, String lastName){
            List<Account> accList = [ Select Id,FirstName,MiddleName,LastName,Full_Name__c, Phone,DoB__c,
                                      PersonEmail
                                    from Account where (FirstName =: firstName
                                     and LastName =: lastName)];
            system.debug('In Matched account method:' + accList);
            return accList;
        }
        @AuraEnabled(cacheable=false)
        public static ID createAccount(string jSONstr) {
            system.debug('createAccount method: jSONstr' + jSONstr);
            Map<String,Object> soaData = (Map<String, Object>) JSON.deserializeUntyped(JSONstr);
            system.debug('createAccount method: soaData' + soaData);

            Account acc = new Account();

            acc.FirstName =(String)(soaData.get('beneficiaryFirstName'));
            acc.LastName = (String)(soaData.get('beneficiaryLastName')); 
            acc.Phone = (String)soaData.get('beneficiaryPhone'); 
            acc.PersonMailingCity = (String)soaData.get('personMailingCity');   
            acc.PersonMailingState = (String)soaData.get('personMailingState');
            acc.PersonMailingStreet = (String)soaData.get('personMailingStreet');
            acc.County__c = (String)soaData.get('personalMailingCounty');
            acc.PrimaryContactFieldName__c = (String)soaData.get('PrimaryContactFieldName__c');   
            insert acc;
            system.debug('AccID is: '+ acc.ID);
            return acc.ID;
       }
    
}