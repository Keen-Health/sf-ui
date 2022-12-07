public without sharing class PTCFormController {

    @AuraEnabled(cacheable=false)
    public static ID createAccount(string JSONstr) {
        Account result = (Account)JSON.deserialize(JSONstr, Account.class);
        result.Permission_to_contact_date__c = Date.today();
        system.debug('js 0 '+result);
        insert result;
        return result.ID;
    }
}