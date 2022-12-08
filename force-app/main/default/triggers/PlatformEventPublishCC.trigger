trigger PlatformEventPublishCC on CaregiverContact__c(after insert, after delete) {
    
    If(trigger.isAfter){
    
        List<newRelatedListRecordCreated__e> publishEvents = new List<newRelatedListRecordCreated__e>();
        
        if(trigger.isInsert){
            for(CaregiverContact__c a : Trigger.new){
                newRelatedListRecordCreated__e eve = new newRelatedListRecordCreated__e();
                eve.recordId__c= a.Id;
               
                publishEvents.add(eve);            
            }
        }
        
        if(trigger.isDelete){
            for(CaregiverContact__c a : Trigger.old){
                newRelatedListRecordCreated__e eve = new newRelatedListRecordCreated__e();
                //eve.recordId__c= a.Id;
               
                publishEvents.add(eve);            
            }
        }
        if(publishEvents.size()>0){
            EventBus.publish(publishEvents);
        }
        
    }
    
}