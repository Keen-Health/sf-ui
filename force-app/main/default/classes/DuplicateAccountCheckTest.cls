@isTest
private class DuplicateAccountCheckTest {
    Account acc;
    
    @TestSetup
    static void createTestData() {
        
        List<Account> accList  = new List<Account>();
        Account acc = new Account();
        acc.FirstName ='Test';
        acc.LastName ='Lead';
        acc.DoB__c=system.today();
        accList.add(acc);
        insert accList;
     }
      
      @istest
      static void testDupCheck() {
           List<Account> acc1 = [select Id,Name from Account];
           List<Account> accList = DuplicateAccountCheck.duplicateAccCheck('Test','Lead',system.today());
           System.assertNotEquals(accList, null);
           DuplicateAccountCheck.updateKeenMemberData(acc1[0].Id,'Create',accList);
           
      }
    
    	
}