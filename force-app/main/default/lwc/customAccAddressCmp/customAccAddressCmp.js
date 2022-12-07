import { LightningElement, api, track } from 'lwc';
import PTC_Source from '@salesforce/schema/Account.Permission_to_contact_source__c';
import PERSON_MAILING_ADDRESS from '@salesforce/schema/Account.PersonMailingAddress';
import PERSON_MAILING_STREET from '@salesforce/schema/Account.PersonMailingStreet';
import PERSON_MAILING_COUNTRY from '@salesforce/schema/Account.PersonMailingCountry';
import PERSON_MAILING_CITY from '@salesforce/schema/Account.PersonMailingCity';
import PERSON_MAILING_POSTAL_CODE from '@salesforce/schema/Account.PersonMailingPostalCode';
import PERSON_MAILING_STATE from '@salesforce/schema/Account.PersonMailingState';
export default class CustomAccAddressCmp extends LightningElement {
    fields = [PERSON_MAILING_STATE,PERSON_MAILING_COUNTRY,PERSON_MAILING_CITY,PERSON_MAILING_STREET,PERSON_MAILING_POSTAL_CODE];
    @api getIdFromParent;
    @api objectApiName;
    @api addressDetail;
    @api disabled;

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
  if(this.addressDetail != undefined && this.addressDetail['PersonMailingAddress'] !=null)
  this.template.querySelector('[data-field="country"').value = this.addressDetail['PersonMailingCountry'];

                     
                    
         
                 }


}