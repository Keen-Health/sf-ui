import { LightningElement, api, track } from 'lwc';

import PTC_Source from '@salesforce/schema/Account.Permission_to_contact_source__c';
import PTC_Other from '@salesforce/schema/Account.Other_Permission_to_contact_Details__c';
export default class PermissionToContactInfoCmp extends LightningElement {
    @api fieldListArchive = ["Permission_to_contact_source__c","Other_Permission_to_contact_Details__c"]; 
    @api isPTCModalOpen;
    @api getIdFromParent;
    @api objectApiName;
    ptcSource = PTC_Source;
    PTC_Other = PTC_Other;
    @api ptcDetail;
    @track showOther;
    @api readOnly;
    constructor() {
        super();
        this.isPTCModalOpen = false;
       
        this.showOther = true;
      }
      handlePickChange(event){

        if(event.target.fieldName=="Permission_to_contact_source__c" && event.target.value == "Other")
        {
       
          this.showOther = false;
        }

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
           // this.template.querySelector('lightning-record-edit-form').submit(fields);
            
        }
        handleSuccess(event) {
            this.dispatchEvent(new CustomEvent('close'));

        }

        handleClose() {
            this.dispatchEvent(new CustomEvent('close'));
          }

renderedCallback(){
   console.log('bingooooo');
   if(this.ptcDetail != undefined){
            this.template.querySelector("lightning-input-field[data-id=Ptc]").value = this.ptcDetail['Permission_to_contact_source__c'];
            this.template.querySelector("lightning-input-field[data-id=ptcOtherDetail]").value = this.ptcDetail['Other_Permission_to_contact_Details__c'];
   }

        }

}