public with sharing class SOAFormController {



    // public String beneficiaryFirstName;

  

 
    // public String getBeneficiaryFirstName(){
    //     beneficiaryFirstName = 'Test';
    //     return beneficiaryFirstName;
    // }
    
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


   @AuraEnabled
   public static void savePDFToSF(String accoundId){
       Account acc = [ SELECT Id,Name,OwnerId 
                       FROM Account 
                       WHERE Id=:accoundId ];
       PageReference pref = page.SOAPdfGenerate;
       pref.getParameters().put('id',acc.Id);
       pref.setRedirect(true);
       // Blob bdata;
       // if(!test.isRunningTest()){
       //     bdata = pref.getContent();
       // }else{
       //     bdata=blob.valueOf('TestString');
       // }
       Blob bdata;
       bdata = pref.getContent();
       
       //Create Document
        ContentVersion cv = new ContentVersion();
        cv.ContentLocation = 'S'; 
        cv.Title = 'Scope of Appointment for ' +  acc.Name + ' generated on ' + system.now();
        cv.PathOnClient =  acc.Name +'.pdf';
        cv.VersionData = Blob.valueOf('Content of pdf');
        cv.Origin = 'H';
        cv.OwnerId = acc.OwnerId;
        cv.VersionData = bdata;
        cv.DocumentName__c = 'Scope of Appointment';
        cv.Source__c = 'Other';
        cv.IsMajorVersion = true;
        insert cv;
        //Get Content Document Id
        Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cv.Id].ContentDocumentId;
        //Create ContentDocumentLink 
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = acc.Id;
        cdl.ContentDocumentId = conDocId;
        cdl.shareType = 'V';
        cdl.Visibility = 'AllUsers';
        insert cdl;
    }
}

 
