public with sharing class GenerateQuoteController {
    
    @AuraEnabled
    public static responseWrapper getKeenMembersData(String accountId){
        
        responseWrapper keenMemberData = new responseWrapper();
        keenMemberData.userEmail = UserInfo.getUserEmail();
        keenMemberData.keenMemberAccountMap = new Map<Id,Account>();
        Map<Id,List<Account>> keenAccountMap = new Map<Id,List<Account>>();
        try{
            keenMemberData.keenMemberAccountMap = new Map<Id,Account>([select Id,AccountNumber,Salutation,
                                                                        FirstName,LastName,DoB__c,
                                                                        PersonMailingPostalCode,PersonEmail,
                                                                        Phone,County__c,PrimaryContactFieldName__c,
                                                                        VerifyPagePrimaryContact__c,PersonAssistantPhone,PersonHomePhone,
                                                                        PersonMobilePhone,PersonOtherPhone,
                                                                        GenderIdentity__c,URL__c,Sunfire_Response__c,
                                                                        Sunfire_Status__c,What_s_most_important_to_the_patient__c,
                                                                        Enrolled_in_MAP_or_PDP__c, Current_Plan_Name__c,
                                                                        Current_Plan_Type__c,Plans_to_discuss__c,Plan_Year__c,
                                                                        Doctor_visits_per_year__c, Extra_help_or_low_income_subsidy__c,
                                                                        Drug_co_pay_co_insurance__c, Monthly_plan_premium__c,
                                                                        Hospital_indemnity_information__c, Effective_date__c,
                                                                        Part_B_effective_date__c, Tobacco_use__c,
                                                                        Household_discount__c from Account
                                                                        where Id =: accountId]);
            }catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
          return keenMemberData;
    }
    
    public class responseWrapper{
        @AuraEnabled
        public Map<Id,Account> keenMemberAccountMap;
        @AuraEnabled
        public String userEmail;
    }

    @AuraEnabled
    public static boolean updateKeenMemberData(String inputJson){
            boolean response = false;
            Map<String,Object> keenMemberData = (Map<String, Object>) JSON.deserializeUntyped(inputJson);
            Account acc = new Account();
            acc.Id = (String)keenMemberData.get('Id');
            acc.FirstName = String.isNotBlank((String)(keenMemberData.get('FirstName'))) ? (String)keenMemberData.get('FirstName') : '';
            acc.LastName =  String.isNotBlank((String)(keenMemberData.get('LastName'))) ? (String)keenMemberData.get('LastName') : '';
            acc.DoB__c = date.parse((String)keenMemberData.get('DoB__c')) != null ? date.parse((String)keenMemberData.get('DoB__c')) : date.parse('01/01/1900');
            acc.PersonMailingPostalCode = String.isNotBlank((String) (keenMemberData.get('PersonMailingPostalCode'))) ? (String)keenMemberData.get('PersonMailingPostalCode'):'';
            acc.PersonEmail = String.isNotBlank((String)(keenMemberData.get('PersonEmail'))) ? (String)keenMemberData.get('PersonEmail') : '';
            acc.Phone = String.isNotBlank((String)(keenMemberData.get('Phone'))) ? (String)keenMemberData.get('Phone') : '';
            acc.County__c =  String.isNotBlank((String)(keenMemberData.get('County__c'))) ? (String)keenMemberData.get('County__c') : '' ;
            acc.PrimaryContactFieldName__c = String.isNotBlank((String)(keenMemberData.get('PrimaryContactFieldName__c'))) ? (String)keenMemberData.get('PrimaryContactFieldName__c') : '';
            acc.PersonAssistantPhone = String.isNotBlank((String)(keenMemberData.get('PersonAssistantPhone'))) ? (String)keenMemberData.get('PersonAssistantPhone') : '';
            acc.PersonHomePhone = String.isNotBlank((String)(keenMemberData.get('PersonHomePhone'))) ? (String)keenMemberData.get('PersonHomePhone') : '';
            acc.PersonMobilePhone = String.isNotBlank((String)(keenMemberData.get('PersonMobilePhone'))) ? (String)keenMemberData.get('PersonMobilePhone') : '';
            acc.PersonOtherPhone = String.isNotBlank((String)(keenMemberData.get('PersonOtherPhone'))) ? (String)keenMemberData.get('PersonOtherPhone') : '';
            acc.VerifyPagePrimaryContact__c = String.isNotBlank((String)(keenMemberData.get('VerifyPagePrimaryContact__c'))) ? (String)keenMemberData.get('VerifyPagePrimaryContact__c') : '';
            acc.What_s_most_important_to_the_patient__c = String.isNotBlank((String)(keenMemberData.get('What_s_most_important_to_the_patient__c'))) ? (String)keenMemberData.get('What_s_most_important_to_the_patient__c') : '';
            acc.Enrolled_in_MAP_or_PDP__c = String.isNotBlank((String)(keenMemberData.get('Enrolled_in_MAP_or_PDP__c'))) ? (String)keenMemberData.get('Enrolled_in_MAP_or_PDP__c') : '';
            acc.Current_Plan_Name__c = String.isNotBlank((String)(keenMemberData.get('Current_Plan_Name__c'))) ? (String)keenMemberData.get('Current_Plan_Name__c') : '';
            acc.Current_Plan_Type__c = String.isNotBlank((String)(keenMemberData.get('Current_Plan_Type__c'))) ? (String)keenMemberData.get('Current_Plan_Type__c') : '';
            acc.Plans_to_discuss__c = String.isNotBlank((String)(keenMemberData.get('Plans_to_discuss__c'))) ? (String)keenMemberData.get('Plans_to_discuss__c') : '';
            acc.Plan_Year__c = String.isNotBlank((String)(keenMemberData.get('Plan_Year__c'))) ? (String)keenMemberData.get('Plan_Year__c') : '';
            acc.Doctor_visits_per_year__c = String.isNotBlank((String)(keenMemberData.get('Doctor_visits_per_year__c'))) ? (String)keenMemberData.get('Doctor_visits_per_year__c') : '';
            acc.Extra_help_or_low_income_subsidy__c = String.isNotBlank((String)(keenMemberData.get('Extra_help_or_low_income_subsidy__c'))) ? (String)keenMemberData.get('Extra_help_or_low_income_subsidy__c') : '';
            acc.Drug_co_pay_co_insurance__c = String.isNotBlank((String)(keenMemberData.get('Drug_co_pay_co_insurance__c'))) ? (String)keenMemberData.get('Drug_co_pay_co_insurance__c') : '';
            acc.Monthly_plan_premium__c = String.isNotBlank((String)(keenMemberData.get('Monthly_plan_premium__c'))) ? (String)keenMemberData.get('Monthly_plan_premium__c') : '';
            acc.Hospital_indemnity_information__c = String.isNotBlank((String)(keenMemberData.get('Hospital_indemnity_information__c'))) ? (String)keenMemberData.get('Hospital_indemnity_information__c') : '';
            acc.Effective_date__c = date.parse((String)(keenMemberData.get('Effective_date__c'))) != null  ? date.parse((String)keenMemberData.get('Effective_date__c')) : date.parse('01/01/1900');
            acc.Household_discount__c = String.isNotBlank((String)(keenMemberData.get('Household_discount__c'))) ? (String)keenMemberData.get('Household_discount__c') : '';
            acc.Tobacco_use__c = String.isNotBlank((String)(keenMemberData.get('Tobacco_use__c'))) ? (String)keenMemberData.get('Tobacco_use__c') : '';
            acc.Part_B_effective_date__c = date.parse((String)keenMemberData.get('Part_B_effective_date__c')) != null ? date.parse((String)keenMemberData.get('Part_B_effective_date__c')) : date.parse('01/01/1900');
            acc.GenderIdentity__c = String.isNotBlank((String)(keenMemberData.get('GenderIdentity__c'))) ? (String)keenMemberData.get('GenderIdentity__c') : '';
            acc.Sunfire_Status__c = (String)keenMemberData.get('Sunfire_Status__c');
            Database.SaveResult result = Database.update(acc);
            if(result.isSuccess()){
                response = true;   
            }        
        return response;
    }

    @AuraEnabled(cacheable=false)
    public static List<MembersPharmacy> getMembersPharmacies(string id) {
        
        List<MembersPharmacy> lst = new List<MembersPharmacy>();
        try{
        for(Member_s_pharmacy__c cc : [SELECT Id,Keen_leads_and_members__c,
                                        Pharmacy_directory__c,Pharmacy_directory__r.name, 
                                        Pharmacy_directory__r.Pharmacy_chain__c,
                                        Pharmacy_directory__r.Mail_Order__c,
                                        Pharmacy_directory__r.City__c,
                                        Pharmacy_directory__r.Phone__c,Is_Pharmacy_Primary__c,
                                        CreatedDate
                                        FROM Member_s_pharmacy__c 
                                        WHERE Keen_leads_and_members__c=: id 
                                        order by CreatedDate  desc]){

            MembersPharmacy mWrapper = new MembersPharmacy();
            mWrapper.name = cc.Pharmacy_directory__r.name;
            mWrapper.pharmacyChain = cc.Pharmacy_directory__r.Pharmacy_chain__c;
            mWrapper.mailOrder = cc.Pharmacy_directory__r.Mail_Order__c;
            mWrapper.city = cc.Pharmacy_directory__r.City__c;
            mWrapper.phone = cc.Pharmacy_directory__r.Phone__c;
            mWrapper.isPharmacyPrimary = cc.Is_Pharmacy_Primary__c;
            mWrapper.createdDate =cc.CreatedDate;
            
            mWrapper.recordUrl = '/lightning/r/Pharmacy_directory__c/' + cc.Pharmacy_directory__c+'/view' ; 
            lst.add(mWrapper);
           }
        }catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
        }  
        return lst;                     
    }

    public class MembersPharmacy{
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled 
        public string pharmacyChain{get;set;}
        @AuraEnabled
        public string mailOrder{get;set;}  
        @AuraEnabled
        public string city{get;set;} 
        @AuraEnabled
        public string phone{get;set;} 
        @AuraEnabled
        public Boolean isPharmacyPrimary{get;set;} 
        @AuraEnabled
        public Datetime createdDate{get;set;} 
        @AuraEnabled
        public string recordUrl{get;set;}  
    }
    
    @AuraEnabled(cacheable=false)
    public static List<MemberPhysicianWrapper> getMemberPhysician(string id) {
        
        List<MemberPhysicianWrapper> lst = new List<MemberPhysicianWrapper>();
        try {
            for(Member_s_physician__c cc : [SELECT Id,Name,Physician_directory__r.First_name__c,Physician_directory__r.Id,
                                            Physician_directory__r.name,Physician_directory__r.Specialty__c, 
                                            Physician_directory__r.Phone__c, City__c,
                                            State__c,Zipcode__c
                                            FROM Member_s_physician__c
                                            WHERE Keen_leads_and_members__c =: id]){

                MemberPhysicianWrapper mWrapper = new MemberPhysicianWrapper();
                mWrapper.firstName =cc.Physician_directory__r.First_name__c;
                mWrapper.lastName = cc.Physician_directory__r.name;
                mWrapper.name = String.isNotBlank((String)mWrapper.firstName) ? (mWrapper.firstName + ' ' + mWrapper.lastName) : (mWrapper.lastName);
                mWrapper.specialty = cc.Physician_directory__r.Specialty__c;
                mWrapper.phone = cc.Physician_directory__r.Phone__c;
                mWrapper.city = cc.City__c;
                mWrapper.state= cc.State__c ;
                mWrapper.zipcode = cc.Zipcode__c;
                
                mWrapper.recordUrl = '/lightning/r/Physicians_List__c/' + cc.Physician_directory__r.Id +'/view' ; 
                lst.add(mWrapper);
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        } 
        return lst;
   }

    public class MemberPhysicianWrapper{
      
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled
        public string firstName{get;set;}
        @AuraEnabled
        public string lastName{get;set;}
        @AuraEnabled
        public string specialty{get;set;} 
        @AuraEnabled
        public string phone{get;set;} 
        @AuraEnabled
        public string city{get;set;} 
        @AuraEnabled
        public string state{get;set;} 
         @AuraEnabled
         public string zipcode{get;set;} 
         @AuraEnabled
         public string recordUrl{get;set;}  
    }

    @AuraEnabled(cacheable=false)
    public static List<MemberMedicationWrapper> getMemberMedication(string id) {
        
        List<MemberMedicationWrapper> lst = new List<MemberMedicationWrapper>();
        try{
        for(MemberMedication__c cc : [SELECT ID,Medication__r.Id,Medication__r.Name, 
                                        Medication__r.Sunfire_dosage__c,Medication__r.Sunfire_package__c, 
                                        Medication__r.Strength__c,Medication__r.Packaging__c, 
                                        Quantity_per_refill__c,Refill_frequency__c
                                        FROM MemberMedication__c
                                        where KeenMember__c =: Id]){

            MemberMedicationWrapper mWrapper = new MemberMedicationWrapper();
            mWrapper.name = cc.Medication__r.Name;
            mWrapper.sunfireDosage = cc.Medication__r.Sunfire_dosage__c ;
            mWrapper.sunfirePackage = cc.Medication__r.Sunfire_package__c;
            mWrapper.strength = cc.Medication__r.Strength__c;
            mWrapper.packaging = cc.Medication__r.Packaging__c;
            mWrapper.quantityPerRefill = cc.Quantity_per_refill__c;
            mWrapper.refillFrequency = cc.Refill_frequency__c;
            
            mWrapper.recordUrl = '/lightning/r/Medication_Directory__c/' + cc.Medication__r.Id +'/view' ; 
            lst.add(mWrapper);
        }
    }catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      } 
        return lst;
    }

    public class MemberMedicationWrapper{
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled
        public string sunfireDosage{get;set;}
        @AuraEnabled
        public string sunfirePackage{get;set;}
        @AuraEnabled
        public string strength{get;set;}
        @AuraEnabled
        public string packaging{get;set;}
        @AuraEnabled
        public decimal quantityPerRefill{get;set;}
        @AuraEnabled
        public string refillFrequency{get;set;}
        @AuraEnabled
        public string recordUrl{get;set;}
    }

    /* @AuraEnabled
    public static List<Account> getResponseURL(String recId){
        List<Account> accList;
        try {
            accList = [Select Id,URL__c from Account where Id=:recId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
           }
        return accList;
    } */

    @AuraEnabled(cacheable=true)
    public static List<Account> getSunFireStatus(String recId){
        List<Account> accList;
        try {
            accList = [Select Id,Sunfire_Status__c, Sunfire_Response_Date__c, Sunfire_Response__c, Generate_Quote_Enable__c from Account where Id=:recId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
           }
        return accList;
    }

    @AuraEnabled
    public static List<Account> getSunFireResponse(String recId){
        List<Account> accList;
        try {
            accList = [Select Id,Sunfire_Status__c, Sunfire_Response_Date__c, Sunfire_Response__c, Generate_Quote_Enable__c from Account where Id=:recId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
           }
        return accList;
    }

    @AuraEnabled

    public static boolean checkPermissionGenerateQuote(){
        boolean isPerSetAvailable = false;
        List<PermissionSetAssignment> perForGenerateQuote = [Select AssigneeId, Assignee.Name
                                                             from PermissionSetAssignment WHERE
                                                             AssigneeId =:UserInfo.getUserId() and
                                                              PermissionSet.Name = 'GenerateQuoteEnable'];
        if(perForGenerateQuote != null && perForGenerateQuote.size() > 0){
            isPerSetAvailable = true;
        }
        return isPerSetAvailable;
     }

    @AuraEnabled
    public static boolean deletePhysicians(String accountId){
        boolean response = false;
        List<Member_s_physician__c> phyList = [ select Id from Member_s_physician__c 
                                                 where Keen_leads_and_members__c  =: accountId];
        system.debug('Physicians: '+ phyList);
        Database.DeleteResult[] result = Database.delete(phyList,true);
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
    public static boolean deletePharmacies(String accountId){
        boolean response = false;
        List<Member_s_pharmacy__c> pharList = [select Id from Member_s_pharmacy__c 
                                               where Keen_leads_and_members__c  =: accountId];
        system.debug('PharList is:' + pharList);
        Database.DeleteResult[] result = Database.delete(pharList,true);
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
    public static boolean deleteMedications(String accountId){
        boolean response = false;
        List<MemberMedication__c> mediList = [ select Id from MemberMedication__c 
                                               where KeenMember__c =: accountId ];
        system.debug('mediList' + mediList);
        Database.DeleteResult[] result = Database.delete(mediList,true);
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


    @AuraEnabled(cacheable=true)
    public static List<User> getAgentData(){
        List<User> agentData = [ SELECT Name,Phone,Email FROM User

                                WHERE Id =: UserInfo.getUserId()];
        return agentData;
    }

   
}