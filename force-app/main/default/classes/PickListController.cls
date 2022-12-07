public with sharing class PickListController {
    @AuraEnabled(cacheable=true)
    public static List<String> getPickListValues(String objectName, String selectedField){
        List<String> listOfPickListValues = new List<String>();
     try{
        Schema.SObjectType convertToObj = Schema.getGlobalDescribe().get(objectName);
        Schema.DescribeSObjectResult res = convertToObj.getDescribe();
        Schema.DescribeFieldResult fieldResult = res.fields.getMap().get(selectedField).getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            listOfPickListValues.add(pickListVal.getLabel());
        }  
     } catch(Exception e){
            throw new AuraHandledException(e.getMessage());
       }   
        return listOfPickListValues;
    }
}