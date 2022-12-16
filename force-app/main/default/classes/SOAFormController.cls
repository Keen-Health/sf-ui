public with sharing class SOAFormController {


    public static String beneficiaryFirstName {get; set;}
    // public String soaRecordId;




    // 
    // public static void fetchSOAFormData(){
    //     SOAFormController sfc = new SOAFormController();
    //     sfc.soaRecordId = 'a0s8B0000000xgXQAQ';
    //     sfc.fetchSOAForminputData('a0s8B0000000xgXQAQ');
    // }
    @AuraEnabled
    public static void fetchSOAForminputData(String soaRecordId){
        SOAForm__c soaFormData = [SELECT ID,Beneficiary_first_name__c, Beneficiary_last_name__c FROM SOAForm__c WHERE Id=: soaRecordId];
       beneficiaryFirstName = soaFormData.Beneficiary_first_name__c;
    }
    
    @AuraEnabled
    public static Id createSOARecord(String inputJson){
        Map<String,Object> soaFormData = (Map<String, Object>) JSON.deserializeUntyped(inputJson);                   
        SOAForm__c soaForm = new SOAForm__c();
        soaForm.Beneficiary_first_name__c = (String)soaFormData .get('beneficiaryFirstName');
        soaForm.Beneficiary_last_name__c = (String)soaFormData .get('beneficiaryLastName');
         //insert soaForm;
         Database.SaveResult result;
         try{
            result = Database.insert(soaForm, false);
         }catch(DmlException e){
            throw new DMLException('Unable to Perform the DML Operation on Account : ' +e.getMessage());
         }
         return result.ID;
}
 
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
