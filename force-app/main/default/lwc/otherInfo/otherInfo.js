import { LightningElement,api } from 'lwc';

export default class OtherInfo extends LightningElement {


    @api fieldListMedDetail = ["CountryOfOrigin__c","Military_Vet__c", "Preferred_Language__c"]; 
    @api isMedModalOpen;
    @api getIdFromParent;
    @api objectApiName;
    @api otherDetail;
    @api readOnly;
    constructor() {
        super();
        this.isMedModalOpen = false;
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
        if(this.otherDetail != undefined){
      console.log('000000');

      if( this.otherDetail['Preferred_Language__c'] != null)
         this.template.querySelector("lightning-input-field[data-id=Preferred_Language__c]").value = this.otherDetail['Preferred_Language__c'];
       if(this.otherDetail['CountryOfOrigin__c'] != null)
         this.template.querySelector("lightning-input-field[data-id=CountryOfOrigin__c]").value = this.otherDetail['CountryOfOrigin__c'];
      if(this.otherDetail['Military_Vet__c'] != null)
        this.template.querySelector("lightning-input-field[data-id=Military_Vet__c]").value = this.otherDetail['Military_Vet__c'];
       
     
             }
            }


}