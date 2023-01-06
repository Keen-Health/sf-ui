public with sharing class SOAFormController {

    @AuraEnabled
    public static Id createSOARecord(String inputJson){
        system.debug('-------In createSOARecord = '+ inputJson);
        Map<String,Object> soaFormData = (Map<String, Object>) JSON.deserializeUntyped(inputJson);                  
        SOAForm__c soaForm = new SOAForm__c();
        soaForm.Keen_leads_and_members__c = (String)soaFormData.get('Keen_leads_and_members__c');
        soaForm.Initial_method_of_contact__c = (String)soaFormData.get('Initial_method_of_contact__c');
        soaForm.Initial_method_of_contact_Other__c = (String)soaFormData.get('Initial_method_of_contact_Other__c');
        soaForm.Plan_s_the_agent_represented__c = (String)soaFormData.get('Plan_s_the_agent_represented__c');
        soaForm.Type_of_product_s__c = (String)soaFormData.get('Type_of_product_s__c');
        soaForm.Carrier_List_Items__c = (String)soaFormData.get('Carrier_List_Items__c');
        soaForm.State__c = (String)soaFormData.get('State__c');
        soaForm.City__c = (String)soaFormData.get('City__c');
        soaForm.County__c = (String)soaFormData.get('County__c');
        soaForm.Street_address__c = (String)soaFormData.get('Street_address__c');
        soaForm.Address_line_2__c = (String)soaFormData.get('Address_line_2__c');
        soaForm.ZIP_code__c = (String)soaFormData.get('ZIP_code__c');
        soaForm.Name = (String)soaFormData.get('Name');
        soaForm.Agent_phone__c = (String)soaFormData.get('Agent_phone__c');
        soaForm.Agent_s_signature__c = (String)soaFormData.get('Agent_s_signature__c');
        soaForm.Beneficiary_first_name__c = (String)soaFormData.get('Beneficiary_first_name__c');
        soaForm.Beneficiary_last_name__c = (String)soaFormData.get('Beneficiary_last_name__c');
        soaForm.Beneficiary_phone__c = (String)soaFormData.get('Beneficiary_phone__c');
        soaForm.Member_s_signature__c = (String)soaFormData.get('Member_s_signature__c');
        soaForm.why_SOA_was_not_documented__c = (String)soaFormData.get('why_SOA_was_not_documented__c');
        soaForm.Date__c = (String)soaFormData.get('Date__c') != null ? date.parse((String)soaFormData.get('Date__c')) : date.parse('01/01/1900');
        soaForm.Date_of_appointment_completed__c =  (String)soaFormData.get('Date_of_appointment_completed__c') != null ? date.parse((String)soaFormData.get('Date_of_appointment_completed__c')) : date.parse('01/01/1900');
        soaForm.Signatures_Status__c = (String)soaFormData.get('Signatures_Status__c');
        if(soaForm.Signatures_Status__c.equals('Both')){
            soaForm.Completed_Date__c = Datetime.now();
        }    
        else{
            soaForm.Completed_Date__c =  date.parse('01/01/1900'); 
        }
        Database.SaveResult result;
         try{
            result = Database.insert(soaForm, false);
            system.debug('result' + result);
         }catch(DmlException e){
            throw new DMLException('Unable to Perform the DML Operation on Account : ' +e.getMessage());
         }
         return result.ID;
    }

    @AuraEnabled
    public static boolean updateSOARec(String soaRecordId,String inputJson){
        boolean response = false;
        Map<String,Object> soaFormData = (Map<String, Object>) JSON.deserializeUntyped(inputJson);  
        SOAForm__c soaForm = new SOAForm__c();
        soaForm.Id = soaRecordId;
        soaForm.Initial_method_of_contact__c = (String)soaFormData.get('Initial_method_of_contact__c');
        soaForm.Initial_method_of_contact_Other__c = (String)soaFormData.get('Initial_method_of_contact_Other__c');
        soaForm.Plan_s_the_agent_represented__c = (String)soaFormData.get('Plan_s_the_agent_represented__c');
        soaForm.Type_of_product_s__c = (String)soaFormData.get('Type_of_product_s__c');
        soaForm.Carrier_List_Items__c = (String)soaFormData.get('Carrier_List_Items__c');
        soaForm.State__c = (String)soaFormData.get('State__c');
        soaForm.City__c = (String)soaFormData.get('City__c');
        soaForm.County__c = (String)soaFormData.get('County__c');
        soaForm.Street_address__c = (String)soaFormData.get('Street_address__c');
        soaForm.Address_line_2__c = (String)soaFormData.get('Address_line_2__c');
        soaForm.ZIP_code__c = (String)soaFormData.get('ZIP_code__c');
        soaForm.Name = (String)soaFormData.get('Name');
        soaForm.Agent_phone__c = (String)soaFormData.get('Agent_phone__c');
        soaForm.Agent_s_signature__c = (String)soaFormData.get('Agent_s_signature__c') ;
        soaForm.Beneficiary_first_name__c = (String)soaFormData.get('Beneficiary_first_name__c');
        soaForm.Beneficiary_last_name__c = (String)soaFormData.get('Beneficiary_last_name__c');
        soaForm.Beneficiary_phone__c = (String)soaFormData.get('Beneficiary_phone__c');
        soaForm.Member_s_signature__c = (String)soaFormData.get('Member_s_signature__c');
        soaForm.why_SOA_was_not_documented__c =  (String)soaFormData.get('why_SOA_was_not_documented__c');
        soaForm.Date__c = (String)soaFormData.get('Date__c') != null ? date.parse((String)soaFormData.get('Date__c')) : date.parse('01/01/1900');
        soaForm.Date_of_appointment_completed__c =  (String)soaFormData.get('Date_of_appointment_completed__c') != null ? date.parse((String)soaFormData.get('Date_of_appointment_completed__c')) : date.parse('01/01/1900');
        soaForm.Signatures_Status__c = (String)soaFormData.get('Signatures_Status__c');
        if(soaForm.Signatures_Status__c.equals('Both')){
            soaForm.Completed_Date__c = Datetime.now();
        }    
        else{
            soaForm.Completed_Date__c =  date.parse('01/01/1900'); 
        }
        Database.SaveResult result = Database.update(soaForm);
            if(result.isSuccess()){
                    response = true;   
            }        
            return response;
    }


    @AuraEnabled
    public static boolean deleteSOAFormRec(String soaFormId){
        boolean response = false;
        List<SOAForm__c> soaData = [ select Id from SOAForm__c where Id =: soaFormId];
        Database.DeleteResult[] result = Database.delete(soaData,true);
        for(Database.DeleteResult delRes: result){
              if ( !delRes.isSuccess() ) {  
                for ( Database.Error err : delRes.getErrors() ) {  
                        System.debug(LoggingLevel.Error, 'The Following Error has occurred with' + err.getStatusCode() + ' Status Code ' + 
                                            err.getMessage() + 'for the following fields' + err.getFields());  
                }  
              } else{
                  response = true;
              }
        }
        return response;
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

 
