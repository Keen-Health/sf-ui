@isTest
private class GenerateQuoteControllerTest {
    @TestSetup
    static void createTestData() {
        Account testAccount = new Account(AccountNumber='A00',Salutation='Mr',FirstName='Test',LastName='Demo',DoB__c=System.today(),
                                          ShippingPostalCode='94040',PersonEmail='info@choosekeen.com',Phone='9703684025',County__c='New York',
                                          URL__c='www.testdemo.com',What_s_most_important_to_the_patient__c='dental',
                                          Enrolled_in_MAP_or_PDP__c='y', Current_Plan_Name__c='Medication',
                                          Plans_to_discuss__c='partd',Plan_Year__c='2022',Doctor_visits_per_year__c='rarely', 
                                          Extra_help_or_low_income_subsidy__c='y',Drug_co_pay_co_insurance__c='partial', Monthly_plan_premium__c='25', 
                                          Hospital_indemnity_information__c='n', Effective_date__c=System.today(),Part_B_effective_date__c=System.today(), 
                                          Tobacco_use__c='y',Household_discount__c='y');
        insert testAccount;
        
        
        Pharmacy_directory__c pharDir = new Pharmacy_directory__c(name='Test',Pharmacy_chain__c='CVS',
                                                                  Mail_Order__c='No',City__c='NJ',
                                                                  Phone__c='8763347654',Zipcode__c='34087');
        insert pharDir;
        
        Member_s_pharmacy__c memPhar = new Member_s_pharmacy__c(Is_Pharmacy_Primary__c=true,Keen_leads_and_members__c=testAccount.Id,
                                                                Pharmacy_directory__c=pharDir.Id);
        insert memPhar;
        
        
        Medication_Directory__c md = new Medication_Directory__c(Name='Test',Sunfire_dosage__c='Demo',
                                                                 Sunfire_package__c='Pack1mg');
        insert md;
       
        
        MemberMedication__c memMed = new MemberMedication__c(Quantity_per_refill__c=12,Refill_frequency__c='Every month',
                                                             KeenMember__c=testAccount.Id,Medication__c=md.Id);
        insert memMed;
        
        
        
        Physicians_List__c phyDir = new Physicians_List__c(First_name__c='Test',name='Demo',Specialty__c='Neurology',
                                                          Phone__c='7655682398');
        insert phyDir;
       
        Member_s_physician__c memPhy = new Member_s_physician__c(City__c='NY',State__c='NY',Zipcode__c='87089',
                                                                 Keen_leads_and_members__c=testAccount.Id,Physician_directory__c=phyDir.Id);
        insert memPhy;
        
        
        }

    @isTest
    static void accountTest() {
          String inputJson = '{"Id":"0015C00000rokK0QAI","FirstName":"Kishore","LastName":"Konda","DoB__c":"08/15/1947","ShippingPostalCode":"10002","PersonEmail":"kishorefx@gmail.com","Phone":"9703684024","County__c":"New York County","PrimaryContact":"phone","Enrolled_in_MAP_or_PDP__c":"y","GenderIdentity__c":"Male","Current_Plan_Name__c":"Medicare plan","Current_Plan_Type__c":"","What_s_most_important_to_the_patient__c":"any_provider,traveller,dental","Plans_to_discuss__c":"med_adv_partd;partd;med_sup;med_adv","Doctor_visits_per_year__c":"occasionally","Extra_help_or_low_income_subsidy__c":"y","Drug_co_pay_co_insurance__c":"partial","Monthly_plan_premium__c":"50","Hospital_indemnity_information__c":"y","Effective_date__c":"01/11/2022","Part_B_effective_date__c":"11/01/2022","Tobacco_use__c":"n","Household_discount__c":"y","Plan_Year__c":"2022","Pharmacies":[{"name":"Test Pharmacy 01","mailOrder":"No","recordUrl":"/lightning/r/Pharmacy_directory__c/a0o8H000000AtkLQAS/view"},{"name":"Test3","mailOrder":"No","recordUrl":"/lightning/r/Pharmacy_directory__c/a0o8H000000Ayf5QAC/view"},{"name":"Test2","mailOrder":"No","recordUrl":"/lightning/r/Pharmacy_directory__c/a0o8H000000Ayf0QAC/view"},{"name":"Test Pharmacy 01","mailOrder":"No","recordUrl":"/lightning/r/Pharmacy_directory__c/a0o8H000000AtkLQAS/view"}],"Medications":[{"name":"Dolo","sunfireDosage":"","sunfirePackage":"","quantityPerRefill":1,"refillFrequency":"Every 12 months","recordUrl":"/lightning/r/Medication_Directory__c/a048H000001BBdpQAG/view"}],"Physicians":[{"FirstName":"Test","LastName":"Physician 1","city":"New York","state":"NY","zipcode":"10001","recordUrl":"/lightning/r/Physicians_List__c/a0N8H000001JPO6UAO/view"}]}';
          Account acc1 = [select FirstName,LastName from Account where FirstName='Test'];  
          Id accountId = [Select Id from Account limit 1].Id;
          GenerateQuoteController.getKeenMembersData(accountId);
          GenerateQuoteController.getMemberMedication(accountId);
          GenerateQuoteController.getMemberPhysician(accountId);
          GenerateQuoteController.getMembersPharmacies(accountId);
          GenerateQuoteController.deleteMedications(accountId);
          GenerateQuoteController.deletePharmacies(accountId);
          GenerateQuoteController.deletePhysicians(accountId);
          List<Account> acc = GenerateQuoteController.getSunFireResponse(accountId);
          System.assertNotEquals(null, accountId);
          Map < String, Object > fullMap = ( Map < String, Object > )JSON.deserializeUntyped( inputJson );
            for(String key : fullMap.keyset()){
                if(key == 'Id'){
                    fullMap.Remove('Id');
                    fullMap.put('Id',accountId);
                    break;
                }
    }
          GenerateQuoteController.updateKeenMemberData(JSON.serialize(fullMap));
          Map<String,Object> keenMemberData = (Map<String, Object>) JSON.deserializeUntyped(inputJson);
          acc1.FirstName = 'Lead';
          acc1.LastName =  'Demo';
          update acc;
}

          
 }