@isTest
private class AccountRelatedListControllerTest {
    
 
    @TestSetup
    static void createTestData() {
        
        Account testAccount = new Account();
        testAccount.lastname = 'testname';
        insert testAccount;
       
        
        PlanDetailList__c planDetailLst = new PlanDetailList__c();
        planDetailLst.Carrier_Other__c = 'text';
        insert planDetailLst;
        
        MemberPlanDetail__c memberPlan = new MemberPlanDetail__c();
        memberPlan.KeenMember__c = testAccount.Id;
        memberPlan.PlanDetailList__c = planDetailLst.Id;
        insert memberPlan;
        
        Caregiver__c caregiver = new Caregiver__c();
        caregiver.city__c = 'Toronto';
        insert caregiver;
        
        CaregiverContact__c cc = new CaregiverContact__c();
        cc.Caregiver__c = caregiver.Id;
        cc.Keen_member__c = testAccount.Id;
        insert cc;
        
        Practice_directory__c p = new Practice_directory__c();
        p.City__c = 'Toronto';
        insert p;
        
        Member_practices__c member = new Member_practices__c();
        member.Account__c = testAccount.Id;
        member.Practice_directory__c = p.Id;
        insert member;
        
        Medication_Directory__c md = new Medication_Directory__c();
        md.Quantity__c = '1';
        insert md;
        
        MemberMedication__c mm = new MemberMedication__c();
        mm.KeenMember__c = testAccount.Id;
        mm.Medication__c = md.Id;
        insert mm;
        
        Hospital_and_health_system__c hh = new Hospital_and_health_system__c();
        hh.City__c = 'Toronto';
        insert hh;
        
        Member_s_hospitals__c    mh = new Member_s_hospitals__c ();
        mh.Hospital_directory__c = hh.Id;
        mh.Account__c = testAccount.Id;
        insert mh;
        
        KeenCampaigns__c keen = new KeenCampaigns__c();
        keen.Campaign_Description__c = 'test';
        insert keen;
        
        Member_campaigns__c mc = new Member_campaigns__c();
        mc.Keen_campaign__c = keen.Id;
        mc.Keen_leads_and_members__c = testAccount.Id;
        insert mc;
        
        // Physicians_List__c ph = new Physicians_List__c();
        // ph.City__c = 'Toronto';
        // insert ph;
        
        // Member_s_physician__c mp = new Member_s_physician__c();
        // mp.Keen_leads_and_members__c = testAccount.Id;
        // mp.Physician_directory__c = ph.Id;
        // insert mp;
        
        Event__c ke = new Event__c();
        ke.name='test';
        insert  ke;
        
        Members_at_event__c  me = new Members_at_event__c ();
        me.Account__c  = testAccount.Id;
        me.Keen_Event__c = ke.Id;
        insert me;
        
        Practice_directory__c pd = new Practice_directory__c();
        pd.Name='test';
        insert pd;
        
        Outbound_Referral_Practice__c op = new Outbound_Referral_Practice__c ();
         op.Keen_leads_and_members__c = testAccount.Id;
        op.Practice_directory__c = pd.Id;
        insert op;
        
        Organizations__c opd = new Organizations__c();
        
        opd.Name='test';
        insert opd;
        
        Outbound_Referral_Organization__c  opo = new Outbound_Referral_Organization__c ();
        opo.Community_and_senior_organization__c= opd.Id;
        opo.Keen_leads_and_members__c = testAccount.Id;
        insert opo;
        
        Pharmacy_directory__c pdd= new Pharmacy_directory__c();
        pdd.name='test123';
        pdd.Zipcode__c = '22442';
        insert pdd;
        
        Member_s_pharmacy__c mpd =  new Member_s_pharmacy__c();
        mpd.Pharmacy_directory__c = pdd.Id;
        mpd.Keen_leads_and_members__c = testAccount.Id;
        insert mpd;
   
    }
    
    @isTest
    static void testRelatedListMethod() {
          
          Id accountId = [Select Id from Account limit 1].Id;
          AccountRelatedListController.getMemberPlans(accountId);
          AccountRelatedListController.getCaregiver(accountId);
          AccountRelatedListController.getMemberPractice(accountId);
          AccountRelatedListController.getMemberMedication(accountId);
          AccountRelatedListController.getMemberHospital(accountId);
          AccountRelatedListController.getMemberCampaign(accountId);
        //   AccountRelatedListController.getMemberPhysician(accountId);
          AccountRelatedListController.getOutboundReferralPractice(accountId);
          AccountRelatedListController.getOutboundReferralOrg(accountId);
          AccountRelatedListController.getMembersEvent(accountId);
          
          
    } 

}