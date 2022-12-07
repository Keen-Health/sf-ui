import { LightningElement,api } from 'lwc';

export default class MedicareDetailCmp extends LightningElement {

    @api fieldListMedDetail = ["MedicareID__c","MedcaidID__c","MedicareEligibilityDate__c","MediaidEligibilityDate__c", "Part_A_enrollment_date__c","PlanEnrollmentDate__c","Part_B_enrollment_date__c","Medicaid_status_verification_date__c","SSN__c"]; 
    @api isMedModalOpen;
    @api getIdFromParent;
    @api objectApiName;
    @api medDetail;
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
        if(this.medDetail != undefined){
      console.log('000000');
      if( this.medDetail['MedicareID__c'] != null)
         this.template.querySelector("lightning-input-field[data-id=MedicareID__c]").value = this.medDetail['MedicareID__c'];
       if(this.medDetail['MedicareEligibilityDate__c'] != null)
         this.template.querySelector("lightning-input-field[data-id=MedicareEligibilityDate__c]").value = this.medDetail['MedicareEligibilityDate__c'];
      if(this.medDetail['PlanEnrollmentDate__c'] != null)
        this.template.querySelector("lightning-input-field[data-id=PlanEnrollmentDate__c]").value = this.medDetail['PlanEnrollmentDate__c'];
       if(this.medDetail['MedcaidID__c'] != null)
        this.template.querySelector("lightning-input-field[data-id=MedcaidID__c]").value = this.medDetail['MedcaidID__c'];
        if(this.medDetail['MediaidEligibilityDate__c'] != null)
        this.template.querySelector("lightning-input-field[data-id=MediaidEligibilityDate__c]").value = this.medDetail['MediaidEligibilityDate__c'];
        if(this.medDetail['SSN__c'] != null)
        this.template.querySelector("lightning-input-field[data-id=SSN__c]").value = this.medDetail['SSN__c'];
        if(this.medDetail['Medicaid_status_verification_date__c'] != null) 
        this.template.querySelector("lightning-input-field[data-id=Medicaid_status_verification_date__c]").value = this.medDetail['Medicaid_status_verification_date__c'];

        if(this.medDetail['Part_A_enrollment_date__c'] != null) 
        this.template.querySelector("lightning-input-field[data-id=Part_A_enrollment_date__c]").value = this.medDetail['Part_A_enrollment_date__c'];

        if(this.medDetail['Part_B_enrollment_date__c'] != null) 
        this.template.querySelector("lightning-input-field[data-id=Part_B_enrollment_date__c]").value = this.medDetail['Part_B_enrollment_date__c'];
      
     
             }
            }

}