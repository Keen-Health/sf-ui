import { LightningElement, api } from 'lwc';

export default class ArchiveNotesCmp extends LightningElement {

    @api fieldListArchive = ["Archive_reason__c","Archive_Reason_Other__c"]; 
    @api isArchiveModalOpen;
    @api getIdFromParent;
    @api objectApiName;
    @api archiveDetail;
    constructor() {
        super();
        this.isArchiveModalOpen = false;
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
            //this.template.querySelector('lightning-record-edit-form').submit(fields);
            
        }
        handleSuccess(event) {
            this.dispatchEvent(new CustomEvent('close'));

        }

        handleClose() {
            this.dispatchEvent(new CustomEvent('close'));
          }

          renderedCallback(){
if(this.archiveDetail != undefined){
                     this.template.querySelector("lightning-input-field[data-id=Archive_reason__c]").value = this.archiveDetail['Archive_reason__c'];
                     this.template.querySelector("lightning-input-field[data-id=Archive_Reason_Other__c]").value = this.archiveDetail['Archive_Reason_Other__c'];
}    
         
                 }
         

}