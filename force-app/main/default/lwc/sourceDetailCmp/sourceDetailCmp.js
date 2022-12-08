import { LightningElement, api } from 'lwc';

export default class SourceDetailCmp extends LightningElement {
    @api fieldListArchive = ["Type","Source_Contact_Name__c"]; 
    @api isSourceModalOpen;
    @api getIdFromParent;
    @api sourcePickValue;
    @api objectApiName;
    @api otherProvider;
    @api sourceDetail;
    @api readOnly;
    constructor() {
        super();
        this.isSourceModalOpen = false;
      }
      get showCommunityLookup()
      {
        return this.sourcePickValue.includes("Community") ? true : false;
      }
      get showPracticeDirectoryLookup()
      {
        if(this.otherProvider == true || this.sourcePickValue.includes("Provider") || this.sourcePickValue.includes("Community") )
        return true;
        else
        return false;

      }
 
      get showReferringMemberLookup()
      {
        return this.sourcePickValue.includes("Referral") ? true : false;
      }
      get showEventLookup()
      {
        return this.sourcePickValue.includes("Event") ? true : false;
      }

      get showCampaignLookup()
      {
        if(this.sourcePickValue.includes("Phreesia") == true || this.sourcePickValue.includes("Campaign") == true )
        return true;
        else
        return false;

      }
      submitPhoneDetail(event) {

            event.preventDefault();       // stop the form from submitting
            const fields = event.detail.fields;
           
            const selectEvent = new CustomEvent('selection', {
                detail: fields
            });
            // Fire the custom event
            this.dispatchEvent(selectEvent);
            this.dispatchEvent(new CustomEvent('close'));
         //   this.template.querySelector('lightning-record-edit-form').submit(fields);
            
        }
        handleSuccess(event) {
            this.dispatchEvent(new CustomEvent('close'));

        }

        handleClose() {
            this.dispatchEvent(new CustomEvent('close'));
          }

          renderedCallback(){
            
            if(this.sourceDetail != undefined){
                 if(this.sourcePickValue.includes("Community"))
                     this.template.querySelector("lightning-input-field[data-id=Source_Community_organization__c]").value = this.sourceDetail['Source_Community_organization__c'];
                if(this.otherProvider == true || this.sourcePickValue.includes("Provider") || this.sourcePickValue.includes("Community") )   
                     this.template.querySelector("lightning-input-field[data-id=Practice_directory__c]").value = this.sourceDetail['Practice_directory__c'];
                 if(this.sourcePickValue.includes("Referral"))   {
                     this.template.querySelector("lightning-input-field[data-id=Source_Referring_member__c]").value = this.sourceDetail['Source_Referring_member__c'];
                     this.template.querySelector("lightning-input-field[data-id=Referring_member_s_relationship__c]").value = this.sourceDetail['Referring_member_s_relationship__c'];
                 }
                     if(this.sourcePickValue.includes("Event"))    
                     this.template.querySelector("lightning-input-field[data-id=Ev]").value = this.sourceDetail['Event__c'];
                 if(this.sourcePickValue.includes("Phreesia"))    
                     this.template.querySelector("lightning-input-field[data-id=Source_Keen_campaign__c]").value = this.sourceDetail['Source_Keen_campaign__c'];
            }
         
                 }

}