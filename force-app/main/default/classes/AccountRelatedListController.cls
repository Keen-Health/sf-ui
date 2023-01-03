public with sharing class AccountRelatedListController {
    public class Column {
        @AuraEnabled public String fieldName;
        @AuraEnabled public String fieldLabel;
        @AuraEnabled public String fieldType;

        Column(String fName, String fLabel, String fType) {
            fieldName = fName;
            fieldLabel = fLabel;
            fieldType = fType;
        }
    }
   @AuraEnabled(cacheable=true)
    public static List<MemberPlanWrapper> getMemberPlans(string id) {
        List<MemberPlanWrapper> lst = new List<MemberPlanWrapper>();
        List<MemberPlanDetail__c> lst2= [
            SELECT Id,Name,PlanDetailList__c,PlanDetailList__r.Name,
            PlanDetailList__r.CarrierName__c,Effective_date__c,Enrolled_by_Keen__c
            FROM MemberPlanDetail__c
            where KeenMember__c =:id
            
       ];

       for(MemberPlanDetail__c mp: lst2){
           MemberPlanWrapper mpWrapperObj = new MemberPlanWrapper();
            mpWrapperObj.memberPlanId = mp.Id ;
            mpWrapperObj.memberPlanName = mp.Name;
            mpWrapperObj.planDetailListId = mp.PlanDetailList__c ;
            mpWrapperObj.planDetailListName = mp.PlanDetailList__r.Name ;
            mpWrapperObj.carrierName = mp.PlanDetailList__r.CarrierName__c ;
            mpWrapperObj.enrolledByKeenStatus= mp.Enrolled_by_Keen__c;
             mpWrapperObj.effectiveDate = mp.Effective_date__c;
            mpWrapperObj.recordUrl = '/lightning/r/MemberPlanDetail__c/' + mp.Id +'/view' ;
            lst.add(mpWrapperObj);
       }

       return lst;
    }

    @AuraEnabled(cacheable=true)
    public static List<CareGiverWrapper> getCaregiver(string id) {
        
        List<CareGiverWrapper> lst = new List<CareGiverWrapper>();
        
        for(CaregiverContact__c cc : [ SELECT Id,Name,Caregiver__c,Caregiver__r.Phone__c,Caregiver__r.Name, Caregiver__r.Relationship__c
                                        FROM CaregiverContact__c WHERE Keen_member__c =:id]){

            CareGiverWrapper cgwrapper = new CareGiverWrapper();
            cgwrapper.cargiverContactName = cc.Caregiver__r.Name;
            cgwrapper.phone = cc.Caregiver__r.Phone__c;
            cgwrapper.careGiverRelationship= cc.Caregiver__r.Relationship__c;

            cgwrapper.recordUrl = '/lightning/r/CaregiverContact__c/' + cc.Id+'/view' ; 
            lst.add(cgwrapper);
        }

       return lst;
    }

    @AuraEnabled(cacheable=true)
    public static List<MemberPracticeWrapper> getMemberPractice(string id) {
        
        List<MemberPracticeWrapper> lst = new List<MemberPracticeWrapper>();
        
        for(Member_practices__c cc : [select Id, Name ,Practice_directory__c, Practice_directory__r.Name 
                                    ,Practice_directory__r.State__c, Practice_directory__r.City__c,
                                     Practice_directory__r.Phone__c, Practice_directory__r.Aledade_Practice_Type__c FROM Member_practices__c where Account__C =: id]){

            MemberPracticeWrapper mWrapper = new MemberPracticeWrapper();
            mWrapper.PracticeId = cc.Practice_directory__c;
            mWrapper.PracticeName = cc.Practice_directory__r.Name ;
            mWrapper.phone = cc.Practice_directory__r.Phone__c;
            mWrapper.city = cc.Practice_directory__r.city__c;
            mWrapper.state = cc.Practice_directory__r.State__c;
            mWrapper.aledadePracticeType = cc.Practice_directory__r.Aledade_Practice_Type__c;
            mWrapper.recordUrl = '/lightning/r/Member_practices__c/' + cc.Id +'/view' ; 
            lst.add(mWrapper);
        }

       return lst;
    }

    @AuraEnabled(cacheable=true)
    public static List<MemberMedicationWrapper> getMemberMedication(string id) {
        
        List<MemberMedicationWrapper> lst = new List<MemberMedicationWrapper>();
        
        /* for(MemberMedication__c cc : [SELECT ID,Medication__r.Id,Medication__r.Name, Medication__r.For__c,Medication__r.Quantity__c, 
                                        Medication__r.Strength_units__c, Medication__r.ValidUntil__c,
                                         Medication__r.DrugForm__c, Medication__r.Frequency__c FROM
                                          MemberMedication__c where KeenMember__c =: Id]){ */
        for(MemberMedication__c cc : [SELECT ID,Medication__r.Id,Medication__r.Name, Medication__r.For__c,Medication__r.Quantity__c, 
                                        Medication__r.Strength_units__c, Medication__r.ValidUntil__c,
                                        Medication__r.DrugForm__c, Medication__r.Frequency__c, 
                                        Medication__r.Sunfire_dosage__c,Medication__r.Sunfire_package__c, 
                                        Medication__r.Strength__c,Medication__r.Packaging__c,
                                        Quantity_per_refill__c,Refill_frequency__c 
                                        FROM MemberMedication__c where KeenMember__c =: Id]){

            MemberMedicationWrapper mWrapper = new MemberMedicationWrapper();
            mWrapper.name = cc.Medication__r.Name;
            mWrapper.sunfireDosage = cc.Medication__r.Sunfire_dosage__c ;
            mWrapper.sunfirePackage = cc.Medication__r.Sunfire_package__c;
            mWrapper.refillQuantity = cc.Quantity_per_refill__c;
            mWrapper.refillFrequency = cc.Refill_frequency__c;
            mWrapper.BrandedGeneric = cc.Medication__r.For__c ;
            mWrapper.Quantity = cc.Medication__r.Quantity__c;
            mWrapper.StrengthUnits = cc.Medication__r.Strength_units__c;
            mWrapper.ValidUntil = cc.Medication__r.ValidUntil__c;
            mWrapper.strength = cc.Medication__r.Strength__c;
            mWrapper.packaging = cc.Medication__r.Packaging__c;
            mWrapper.DrugFrom = cc.Medication__r.DrugForm__c;
            mWrapper.Frequency = cc.Medication__r.Frequency__c;
            mWrapper.recordUrl = '/lightning/r/MemberMedication__c/' + cc.ID +'/view' ; 
            lst.add(mWrapper);
        }

       return lst;
    }

    public class MemberPlanWrapper{
        @AuraEnabled
        public ID memberPlanId{get;set;}
         @AuraEnabled
        public string memberPlanName{get;set;}
        @AuraEnabled
        public ID planDetailListId{get;set;}
        @AuraEnabled
        public string planDetailListName{get;set;}
        @AuraEnabled
        public string carrierName{get;set;}
        @AuraEnabled
        public boolean enrolledByKeenStatus{get;set;}
        @AuraEnabled
        public date effectiveDate{get;set;}
        @AuraEnabled
        public string recordUrl{get;set;}
        
    }

    public class CareGiverWrapper{
      
        @AuraEnabled
        public string cargiverContactName{get;set;}
        @AuraEnabled
        public string phone{get;set;}
        @AuraEnabled
        public string city{get;set;}
        @AuraEnabled
        public string state{get;set;}
        @AuraEnabled
        public string careGiverRelationship{get;set;}
        @AuraEnabled
        public string recordUrl{get;set;}
        
    }

    public class MemberPracticeWrapper{
      
        @AuraEnabled
        public string PracticeId {get;set;}
        @AuraEnabled
        public string PracticeName{get;set;}
        @AuraEnabled
        public string phone{get;set;}
        @AuraEnabled
        public string city{get;set;}
        @AuraEnabled
        public string state{get;set;}
        @AuraEnabled
        public string recordUrl{get;set;}
        @AuraEnabled
        public string aledadePracticeType{get;set;}
    }

    public class MemberMedicationWrapper{
      
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled
        public string BrandedGeneric{get;set;}
        @AuraEnabled
        public string Quantity{get;set;}
        @AuraEnabled
        public string StrengthUnits{get;set;}
        @AuraEnabled
        public date ValidUntil{get;set;}
        @AuraEnabled
        public string DrugFrom{get;set;}
        @AuraEnabled
        public string Frequency{get;set;}
        @AuraEnabled
        public string recordUrl{get;set;}
        @AuraEnabled
        public string sunfireDosage{get;set;}
        @AuraEnabled
        public string sunfirePackage{get;set;}
        @AuraEnabled
        public string strength{get;set;}
        @AuraEnabled
        public string packaging{get;set;}
        @AuraEnabled
        public decimal refillQuantity{get;set;}
        @AuraEnabled
        public string refillFrequency{get;set;}
        
    }

    @AuraEnabled(cacheable=true)
    public static List<MemberHospitalWrapper> getMemberHospital(string id) {
        
        List<MemberHospitalWrapper> lst = new List<MemberHospitalWrapper>();
        
        for(Member_s_hospitals__c cc : [SELECT id,name ,Hospital_directory__c,Hospital_directory__r.name, 
                                        Hospital_directory__r.Phone__c, 
                                        Hospital_directory__r.City__c, Hospital_directory__r.State__c            
                                        FROM Member_s_hospitals__c
                                        WHERE Account__c =: id]){

            MemberHospitalWrapper mWrapper = new MemberHospitalWrapper();
            mWrapper.name = cc.name;
            mWrapper.HospitalName = cc.Hospital_directory__r.name ;
            mWrapper.HospitalPhone= cc.Hospital_directory__r.Phone__c;
            mWrapper.City = cc.Hospital_directory__r.City__c;
            mWrapper.State = cc.Hospital_directory__r.State__c;
            mWrapper.recordUrl = '/lightning/r/Member_s_hospitals__c/' + cc.id+'/view' ; 
            lst.add(mWrapper);
        }

       return lst;
    }

    public class MemberHospitalWrapper{
      
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled
        public string HospitalName{get;set;}
        @AuraEnabled
        public string HospitalPhone{get;set;}
        @AuraEnabled
        public string City{get;set;}
        @AuraEnabled
        public string State{get;set;}
         @AuraEnabled
        public string recordUrl{get;set;}
       
        
    }

    @AuraEnabled(cacheable=true)
    public static List<MemberCampaignWrapper> getMemberCampaign(string id) {
        
        List<MemberCampaignWrapper> lst = new List<MemberCampaignWrapper>();
        
        for(Member_campaigns__c cc : [SELECT id,Keen_campaign__r.Name,Keen_campaign__r.id,
                                         Keen_campaign__r.Start_Date__c,
                                         Keen_campaign__r.Type__c, Keen_campaign__r.owner.name FROM 
                                          Member_campaigns__c 
                                          WHERE Keen_leads_and_members__c =: Id]){

            MemberCampaignWrapper mWrapper = new MemberCampaignWrapper();
            mWrapper.name = cc.Keen_campaign__r.Name;
            mWrapper.Startdate = cc.Keen_campaign__r.Start_Date__c ;
            mWrapper.type = cc.Keen_campaign__r.Type__c;

            mWrapper.recordUrl = '/lightning/r/Member_campaigns__c/' + cc.id +'/view' ; 
            lst.add(mWrapper);
        }

       return lst;
    }

    public class MemberCampaignWrapper{
      
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled
        public datetime Startdate{get;set;}
        @AuraEnabled
        public string type{get;set;}
         @AuraEnabled
        public string recordUrl{get;set;}  
    }

    @AuraEnabled(cacheable=true)
    public static List<MemberPhysicianWrapper> getMemberPhysician(string id) {
        
        List<MemberPhysicianWrapper> lst = new List<MemberPhysicianWrapper>();
        
        for(Member_s_physician__c cc : [SELECT Id,Name,Physician_directory__r.First_name__c,Physician_directory__r.Id,
                                        Physician_directory__r.name,Physician_directory__r.Subspecialty__c,Is_Primary_Care_Physician__c , 
                                        Physician_directory__r.Phone__c, City__c,State__c,Zipcode__c FROM Member_s_physician__c
                                        WHERE Keen_leads_and_members__c =: id]){

            MemberPhysicianWrapper mWrapper = new MemberPhysicianWrapper();
            mWrapper.name = String.isNotBlank((String)(cc.Physician_directory__r.First_name__c)) ? ( cc.Physician_directory__r.First_name__c+' '+cc.Physician_directory__r.name ) : (cc.Physician_directory__r.name);
            mWrapper.specialty = cc.Physician_directory__r.Subspecialty__c;
            mWrapper.phone = cc.Physician_directory__r.Phone__c;
            mWrapper.city = cc.City__c;
            mWrapper.state= cc.State__c;
            mWrapper.isPrimary = cc.Is_Primary_Care_Physician__c;
            mWrapper.zipcode = cc.Zipcode__c;
            mWrapper.recordUrl = '/lightning/r/Member_s_physician__c/' + cc.Id +'/view' ; 
            lst.add(mWrapper);
        }

       return lst;
    }

    public class MemberPhysicianWrapper{
      
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled
        public string specialty{get;set;} 
        @AuraEnabled
        public string phone{get;set;} 
        @AuraEnabled
        public string city{get;set;} 
        @AuraEnabled
        public string state{get;set;} 
         @AuraEnabled
        public string recordUrl{get;set;}  
        @AuraEnabled
        public boolean isPrimary{get;set;} 
        @AuraEnabled
        public string zipcode{get;set;}  
    }
    
     @AuraEnabled(cacheable=true)
    public static List<OutboundReferralPractic> getOutboundReferralPractice(string id) {
        
        List<OutboundReferralPractic> lst = new List<OutboundReferralPractic>();
        
        for(Outbound_Referral_Practice__c  cc : [SELECT Id,Practice_directory__c,Practice_directory__r.name,Practice_directory__r.State__c,Practice_directory__r.City__c FROM Outbound_Referral_Practice__c  
                                                    WHERE Keen_leads_and_members__c =: id]){

            OutboundReferralPractic mWrapper = new OutboundReferralPractic();
            mWrapper.name =cc.Practice_directory__r.name;
            mWrapper.city = cc.Practice_directory__r.City__c;

            
            mWrapper.recordUrl = '/lightning/r/Outbound_Referral_Practice__c/' + cc.Id+'/view' ; 
            lst.add(mWrapper);
        }

       return lst;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<OutboundReferralOrg> getOutboundReferralOrg(string id) {
        
        List<OutboundReferralOrg> lst = new List<OutboundReferralOrg>();
        
        for(Outbound_Referral_Organization__c cc : [SELECT Id,Community_and_senior_organization__c,Community_and_senior_organization__r.name,Community_and_senior_organization__r.State__c,Community_and_senior_organization__r.City__c FROM Outbound_Referral_Organization__c
                                                    WHERE Keen_leads_and_members__c =: id]){

            OutboundReferralOrg mWrapper = new OutboundReferralOrg();
            mWrapper.name = cc.Community_and_senior_organization__r.name;
            mWrapper.city = cc.Community_and_senior_organization__r.City__c;

            
            mWrapper.recordUrl = '/lightning/r/Outbound_Referral_Organization__c/' + cc.Id +'/view' ; 
            lst.add(mWrapper);
        }

       return lst;
    }
    
    
     public class OutboundReferralOrg{
      
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled
        public string city{get;set;} 
        @AuraEnabled
        public string recordUrl{get;set;}  
 
    }
    
    public class OutboundReferralPractic{
      
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled
        public string city{get;set;} 
        @AuraEnabled
        public string recordUrl{get;set;}  
 
    }
    
      @AuraEnabled(cacheable=true)
    public static List<MembersEvent> getMembersEvent(string id) {
        
        List<MembersEvent> lst = new List<MembersEvent>();
        
        for(Members_at_event__c cc : [SELECT Id,Account__c,Keen_Event__c, Keen_Event__r.name,Keen_Event__r.Event_City__c,Keen_Event__r.Start_date_time__c
                                        FROM Members_at_event__c 
                                        WHERE Account__c=: id]){

            MembersEvent mWrapper = new MembersEvent();
            mWrapper.name = cc.Keen_Event__r.name;
            mWrapper.city = cc.Keen_Event__r.Event_City__c;
            mWrapper.startDate = cc.Keen_Event__r.Start_date_time__c;

            
            mWrapper.recordUrl = '/lightning/r/Members_at_event__c/' + cc.Id +'/view' ; 
            lst.add(mWrapper);
        }

       return lst;
    }
    
    
      @AuraEnabled(cacheable=true)
    public static List<MembersPharmacy> getMembersPharmacies(string id) {
        
        List<MembersPharmacy> lst = new List<MembersPharmacy>();
        
        for(Member_s_pharmacy__c cc : [SELECT Id,Keen_leads_and_members__c,Pharmacy_directory__c,Pharmacy_directory__r.name, Is_Pharmacy_Primary__c,Pharmacy_directory__r.City__c,Pharmacy_directory__r.Phone__c
                                        FROM Member_s_pharmacy__c 
                                        WHERE Keen_leads_and_members__c=: id]){

            MembersPharmacy mWrapper = new MembersPharmacy();
            mWrapper.name = cc.Pharmacy_directory__r.name;
            mWrapper.city = cc.Pharmacy_directory__r.City__c;
            mWrapper.phone = cc.Pharmacy_directory__r.Phone__c;
            mWrapper.isPrimary = cc.Is_Pharmacy_Primary__c;

            
            mWrapper.recordUrl = '/lightning/r/Member_s_pharmacy__c/' + cc.Id+'/view' ; 
            lst.add(mWrapper);
        }

       return lst;
    }
    
    
    
     public class MembersEvent{
      
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled
        public string city{get;set;} 
        @AuraEnabled
        public datetime startDate{get;set;} 
        @AuraEnabled
        public string recordUrl{get;set;}  
 
    }
    
    
     public class MembersPharmacy{
      
        @AuraEnabled
        public string name{get;set;}
        @AuraEnabled
        public string city{get;set;} 
        @AuraEnabled
        public string phone{get;set;} 
        @AuraEnabled
        public string recordUrl{get;set;}  
        @AuraEnabled
        public boolean isPrimary{get;set;}  
 
    }

}