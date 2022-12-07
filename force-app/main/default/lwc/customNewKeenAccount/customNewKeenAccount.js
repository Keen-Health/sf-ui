import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue,getRecordNotifyChange  } from 'lightning/uiRecordApi';
import LightningConfirm from 'lightning/confirm';
import getDuplicateAccounts from '@salesforce/apex/DuplicateAccountCheck.duplicateAccCheck';
import getKeenNewDupAccounts from '@salesforce/apex/DuplicateAccountCheck.updateKeenMemberData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import PTC_Source from '@salesforce/schema/Account.Permission_to_contact_source__c';
import PRIMARYCONTACT_FIELD from '@salesforce/schema/Account.PrimaryContactFieldName__c';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import PERSONASSISTANTPHONE from '@salesforce/schema/Account.PersonAssistantPhone';
import PERSONHOMEPHONE from '@salesforce/schema/Account.PersonHomePhone';
import PERSONMOBILE from '@salesforce/schema/Account.PersonMobilePhone';
import PERSONOTHER from '@salesforce/schema/Account.PersonOtherPhone';
import OWNER_FIELD from '@salesforce/schema/Account.Owner.Name';
import PERSON_MAILING_STREET from '@salesforce/schema/Account.PersonMailingStreet';
import PERSON_MAILING_ADDRESS from '@salesforce/schema/Account.PersonMailingAddress';
import ACCOUNT_SOURCE from '@salesforce/schema/Account.AccountSource';


const fields = [NAME_FIELD,PRIMARYCONTACT_FIELD,OWNER_FIELD, PERSONASSISTANTPHONE,PERSONHOMEPHONE,PERSONMOBILE,PERSONOTHER,PHONE_FIELD,PERSON_MAILING_STREET,ACCOUNT_SOURCE, PTC_Source];
export default class CustomNewKeenAccount extends NavigationMixin(LightningElement) {
    @api fieldList = ["DoB__c","GenderIdentity__c","PersonEmail","Permission_to_contact_date__c", "Phone","Status__c","Scope_of_appointment_date__c", "AccountSource","PersonMailingAddress","PersonMailingStreet","Appointment_Date_Time__c","Do_not_call__c"]; 
    columns = [
        {label: 'Name', fieldName: 'nameUrl', type:'url',
            typeAttributes: {label: {fieldName: 'Full_Name__c'},target: '_blank'}
        },
         {label: 'DoB', fieldName: 'DoB__c', type: 'Date'},
        {label: 'Status', fieldName: 'Status__c', type: 'Picklist'},
     ];
     @api title = NAME_FIELD;
    showEditField;
    showphonModal;
    @track primariContactField;
    @api primaryPhone = this.primariContactField;
    @api recordId;
    @api objectApiName = "Account";
    @track isModalOpen = false;
    @track isArchiveModalOpen = false;
    @track isSourceModalOpen = false;
    @track isPTCModalOpen = false;
    @track isAddressModalOpen = false;
    @track isMedModalOpen = false;
    @track isOtherModalOpen = false;
    @track areDetailsVisible=false;
    @api sourcePickValue;
    @api sourceOtherProviders;
    @track phoneDetail;
    @api ptcDetail;
    @api medDetail;
    @track sourceDetail;
    @api archiveDetail;
    @api addressDetail;
    @api otherDetail;
    @track showValidationModal = false;
    validationModalData;
    FirstName;
    LastName;
    DoB__c;
    advisorResolution = false;
    listOfDuplicates;
    isShowModal = false;
    isLoaded = true;
    isPhoneChanged;
    inpFieldsVal;

    @wire(getRecord, { recordId: '$recordId', fields })
    account;

   
    constructor() {
        super();
        this.phoneDetail = {
            Phone:"",
            PersonAssistantPhone:"",
            PersonHomePhone:"",
            PersonMobilePhone:"",
            PersonOtherPhone:""
  
        }
       
      }

    openModal() {
        // to open modal set isModalOpen track value as true
        this.isModalOpen = true;
    }
    
    primeContact;
    closeModal() {
        // to close modal set isModalOpen track value as false
        this.isShowModal = false;
        this.isModalOpen = false;
        this.isArchiveModalOpen = false;
        this.isSourceModalOpen = false;
        this.isAddressModalOpen = false;
        this.isPTCModalOpen = false;
        this.isMedModalOpen = false;
        this.isOtherModalOpen =  false;
        
    }

    handlePhoneClick(event) {
   
        this.phoneDetail['Phone'] = this.template.querySelector("lightning-input-field[data-id=phn]").value;
        
        this.phoneDetail['PrimaryContactFieldName__c'] = 'PersonHomePhone';
        this.phoneDetail['PersonHomePhone'] = this.template.querySelector("lightning-input-field[data-id=phn]").value;
        this.isModalOpen = true;
    }
    changePhoneNumber(event) {
        this.isPhoneChanged = true;
    }

    handleAddressClick(event) {
        
      
        this.isAddressModalOpen = true;
    }
    handlePTCClick(event) {
        this.isPTCModalOpen = true;
    }
    handleStatusClick(event) {
        if(event.target.value.includes("Archive"))
        this.isArchiveModalOpen = true;
    }
    handleMedDetailClick(event) {
      
        this.isMedModalOpen = true;
    }

    handleOtherDetailClick(event) {
      
        this.isOtherModalOpen = true;
    }
    handleFieldClick(event) {
       
        
        
        if(event.target.fieldName=="Phone")
      {
        this.isModalOpen = true;
    }
    if(event.target.fieldName=="Status__c" )
    {
      this.isArchiveModalOpen = true;
  }
    }
    handleSourceClick(event) {
     
        this.sourcePickValue = this.template.querySelector("lightning-input-field[data-id=source]").value;
       

        if(this.sourcePickValue.includes("Aledade") || this.sourcePickValue.includes("Archwell") || this.sourcePickValue.includes("ChenM_Ded_Call center") || this.sourcePickValue.includes("ChenM / Ded MCG") || this.sourcePickValue.includes("Homeward") || this.sourcePickValue.includes("IORA")  ){
            this.sourceOtherProviders = true;
            this.isSourceModalOpen = true;
        }
        if(this.sourcePickValue.includes("Community") || this.sourcePickValue.includes("Provider") || this.sourcePickValue.includes("Referral") || this.sourcePickValue.includes("Event")) 
        this.isSourceModalOpen = true;


    }
    handleSourceChange(event) {
        this.sourcePickValue = event.target.value;
        if(this.sourcePickValue.includes("Aledade") || this.sourcePickValue.includes("Archwell") || this.sourcePickValue.includes("ChenM_Ded_Call center") || this.sourcePickValue.includes("ChenM / Ded MCG") || this.sourcePickValue.includes("Homeward") || this.sourcePickValue.includes("IORA")  ){
            this.sourceOtherProviders = true;
            this.isSourceModalOpen = true;
        }
        if(this.sourcePickValue.includes("Community") || this.sourcePickValue.includes("Provider") || this.sourcePickValue.includes("Referral") || this.sourcePickValue.includes("Event") || this.sourcePickValue.includes("Campaign")) 
        this.isSourceModalOpen = true;
    }
    handleFieldChange(event) {

        if(event.target.fieldName=="Status__c" && event.target.value == "Keen Archive")
        {
          this.isArchiveModalOpen = true;
        }
        if(event.target.fieldName=="AccountSource")
        {
            
          this.sourcePickValue = event.target.value;
          if(this.sourcePickValue.includes("Community") || this.sourcePickValue.includes("Provider") || this.sourcePickValue.includes("Referral") || this.sourcePickValue.includes("Event") )
          this.isSourceModalOpen = true;
        }

        if(event.target.fieldName=="Permission_to_contact_date__c" )
        {
          
          this.isPTCModalOpen = true;
        }

    }

    checkForDuplicate(fields){
        getDuplicateAccounts({firstName: this.FirstName, lastName: this.LastName, dob: this.DoB__c})
        .then(result => {
            if(result.length){
                this.listOfDuplicates = result;
                this.isShowModal = true;
                let duplicateData = JSON.parse(JSON.stringify(result));
                duplicateData.forEach(item => {
                item['nameUrl'] = '/lightning/r/Account/' +item['Id'] +'/view';
                this.data = duplicateData;
            });
            }
            else{
                this.insertNewKeen(fields);
            }
        })
        .catch(error => {
            // console.error(error)

        });
}
    validVariable(variable) {
        if (variable === null || variable === "" || variable === undefined) {
            return false
        }
        return true
    }

    customValidations(fields) {
        const soaDate = this.template.querySelector("lightning-input-field[data-id=scopeOfAppointment]").value;
        const status = this.template.querySelector("lightning-input-field[data-id=status]").value;
        const phoneNumber = this.template.querySelector("lightning-input-field[data-id=phn]").value;
        const emailId = this.template.querySelector("lightning-input-field[data-id=emailAddress]").value;
        const ptcFromApi = getFieldValue(this.account.data, PTC_Source);
        var isAllValid = true;

        this.validationModalData = { 
        title:"Warning!",
        body:[
            { id: 1, text: 'If the status is Member, SOA should be complete.', show: false },
            { id: 2, text: 'If the  SOA  is complete, status should be Prospect or Member.', show: false },
            { id: 3, text: 'Members with PTC should have an email or phone number.', show: false },
        ],
                buttons : [
            {
                id: 2, label: "Back to Edit",
                callBack: () => { this.showValidationModal = false; },
                variant: "neutral"
            },
            {
                id: 1, label: "Continue",
                callBack: () => { this.template.querySelector('lightning-record-edit-form').submit(fields);
                this.showValidationModal = false; },
                variant : "brand"
            }
            
        ]};

        if (status === "Keen Member (Sold)" && soaDate == null) {
            isAllValid = false;
            this.validationModalData.body[0]['show'] = true;
        } else if (status === "Keen Lead" && soaDate != null) {
            isAllValid = false;
            this.validationModalData.body[1]['show'] = true;
        }

        if (ptcFromApi != null && !(this.validVariable(phoneNumber) || this.validVariable(emailId))) {
            isAllValid = false;
            this.validationModalData.body[2]['show'] = true;
        } else if (this.ptcDetail != undefined && this.validVariable(this.ptcDetail['Permission_to_contact_source__c']) 
        && !(this.validVariable(phoneNumber) || this.validVariable(emailId))) {
            isAllValid = false;
            this.validationModalData.body[2]['show'] = true;
        }

            isAllValid ? this.template.querySelector('lightning-record-edit-form').submit(fields) : this.showValidationModal = true;
    }
    
    handleSubmit(event) {
        event.preventDefault();       // stop the form from submitting
        const fields = event.detail.fields;
        this.inpFieldsVal = fields;
        this.FirstName = fields['FirstName'];
        this.LastName= fields['LastName'];
        this.DoB__c = fields['DoB__c'];
        if(this.FirstName != null && this.LastName != null && this.DoB__c != null){
            this.checkForDuplicate(fields);
    }else{
        this.insertNewKeen(fields);
    }
    }
    handleSuccess(event) {
        
        this.isShowModal = false;
        this.recordId = event.detail.id;
       
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'The record has been created',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
        this.navigateToRecordPage();
        if(this.advisorResolution)
            getKeenNewDupAccounts({recordId: this.recordId, advisorResolution: 'Create' ,accList: this.listOfDuplicates})
    }
    handleCancel(event) {
        window.location.href ='../lightning/o/Account/list';

    }
    navigateToRecordPage() {

       // window.location.href ='https://choosekeen--agrinfo.sandbox.lightning.force.com/lightning/r/Account/' +this.recordId+ '/view';
       this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.recordId,
            objectApiName: 'Account',
            actionName: 'view'
        },
    });
}
    
   
    handleLoad(event) {
        this.areDetailsVisible=true; 
        //  window.console.time("LDS call");
         //details coming on the load of form
         // The LDS will take a few seconds to load the component.
         const recUi = event.detail;
        //  window.console.timeEnd("LDS call");
         //  window.
     }

getPhoneDataFromModal(event){
    //this.phoneDetail = event.detail;
    let temPhnDetail = JSON.parse(JSON.stringify(event.detail)); 
    if (temPhnDetail.hasOwnProperty("Phone")) 
    this.phoneDetail["Phone"]  = temPhnDetail["Phone"];
    if (temPhnDetail.hasOwnProperty("PersonAssistantPhone")) 
    this.phoneDetail["PersonAssistantPhone"] = temPhnDetail["PersonAssistantPhone"];
    if (temPhnDetail.hasOwnProperty("PersonHomePhone")) 
    this.phoneDetail["PersonHomePhone"] = temPhnDetail["PersonHomePhone"];
    if (temPhnDetail.hasOwnProperty("PersonMobilePhone")) 
    this.phoneDetail["PersonMobilePhone"] = temPhnDetail["PersonMobilePhone"];
    if (temPhnDetail.hasOwnProperty("PersonOtherPhone")) 
    this.phoneDetail["PersonOtherPhone"] = temPhnDetail["PersonOtherPhone"];
    if (temPhnDetail.hasOwnProperty("PrimaryContactFieldName__c")) 
    this.phoneDetail["PrimaryContactFieldName__c"] = temPhnDetail["PrimaryContactFieldName__c"];
 
     
     if(this.phoneDetail[this.phoneDetail["PrimaryContactFieldName__c"]] != null)
     this.template.querySelector(".primaryPhone").value = this.phoneDetail[this.phoneDetail["PrimaryContactFieldName__c"]];
     else
     this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
     this.isModalOpen = false;
     this.isPhoneChanged = false;
}

getPTCDataFromModal(event){

    this.ptcDetail =  event.detail;
    
    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isModalOpen = false;
}
getSourceDataFromModal(event){

    this.sourceDetail =  event.detail;
    
    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isModalOpen = false;
}
getMeddataFromModal(event){
    

    this.medDetail =  event.detail;
    
    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isMedModalOpen = false;
}

getOtherDataFromModal(event){
    

    this.otherDetail =  event.detail;
    
    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isOtherModalOpen = false;
}

getArchiveDataFromModal(event){
    

    this.archiveDetail =  event.detail;
    
    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isModalOpen = false;
}

getAddressdataFromModal(event){
    

    this.addressDetail =  event.detail;

   let tempAddr = JSON.parse(JSON.stringify( this.addressDetail));
    
    this.template.querySelector("lightning-input-field[data-id=addressOutput]").value = tempAddr["PersonMailingStreet"];
    //this.template.querySelector(".primaryPhone").value = this.phoneDetail["Phone"];
    this.isModalOpen = false;
}
 
    submitDetails(event){
        this.isShowModal = false;
        this.advisorResolution = true;
        this.insertNewKeen(this.inpFieldsVal);
    }
    insertNewKeen(fields){
        if(this.phoneDetail!= undefined){
                fields['PersonAssistantPhone'] = this.phoneDetail['PersonAssistantPhone'];
                fields['PersonHomePhone'] = this.phoneDetail['PersonHomePhone'];
                fields['PersonMobilePhone'] = this.phoneDetail['PersonMobilePhone'];
                fields['PersonOtherPhone'] = this.phoneDetail['PersonOtherPhone'];
                if(this.phoneDetail[this.phoneDetail['PrimaryContactFieldName__c']] != undefined)
                fields['Phone'] = this.phoneDetail[this.phoneDetail['PrimaryContactFieldName__c']];
                fields['PrimaryContactFieldName__c']= this.phoneDetail['PrimaryContactFieldName__c'];
            }
            if(this.ptcDetail!= undefined){
                fields['Permission_to_contact_source__c']= this.ptcDetail['Permission_to_contact_source__c'];
                fields['Other_Permission_to_contact_Details__c']= this.ptcDetail['Other_Permission_to_contact_Details__c']; 
            }    
            if(this.sourceDetail!= undefined){
                fields['Source_Community_organization__c']= this.sourceDetail['Source_Community_organization__c'];
                fields['Practice_directory__c']= this.sourceDetail['Practice_directory__c'];
                fields['Source_Referring_member__c']= this.sourceDetail['Source_Referring_member__c'];
                fields['Referring_member_s_relationship__c']= this.sourceDetail['Referring_member_s_relationship__c'];
                fields['Event__c']= this.sourceDetail['Event__c'];
                fields['Source_Keen_campaign__c']= this.sourceDetail['Source_Keen_campaign__c'];
            }
            if(this.archiveDetail!= undefined){
                fields['Archive_reason__c']= this.archiveDetail['Archive_reason__c'];
                fields['Archive_Reason_Other__c']= this.archiveDetail['Archive_Reason_Other__c'];
            } 
            if(this.addressDetail!= undefined){
            fields["PersonMailingStreet"] = this.addressDetail['PersonMailingStreet'];
            fields['PersonMailingAddress']= this.addressDetail['PersonMailingAddress'];
            fields['PersonMailingCountry']= this.addressDetail['PersonMailingCountry'];
            fields['PersonMailingCity']= this.addressDetail['PersonMailingCity'];
            fields['PersonMailingStateCode']= this.addressDetail['PersonMailingStateCode'];
            fields['PersonMailingPostalCode']= this.addressDetail['PersonMailingPostalCode'];
            }
            if(this.medDetail != undefined){
                fields['MedicareID__c']=  this.medDetail['MedicareID__c'];
                fields['MedicareEligibilityDate__c']=this.medDetail['MedicareEligibilityDate__c'];
                fields['PlanEnrollmentDate__c']=this.medDetail['PlanEnrollmentDate__c'];
                fields['Part_A_enrollment_date__c']=this.medDetail['Part_A_enrollment_date__c'];
                fields['Part_B_enrollment_date__c']=this.medDetail['Part_B_enrollment_date__c']; 
                fields['MedcaidID__c']=this.medDetail['MedcaidID__c'];
                fields['MediaidEligibilityDate__c']=this.medDetail['MediaidEligibilityDate__c'];
                fields['SSN__c']=this.medDetail['SSN__c'];
                fields['Medicaid_status_verification_date__c']=this.medDetail['Medicaid_status_verification_date__c'];
            }
            if(this.otherDetail != undefined){
                fields['Preferred_Language__c']=  this.otherDetail['Preferred_Language__c'];
                fields['CountryOfOrigin__c']=this.otherDetail['CountryOfOrigin__c'];
                fields['Military_Vet__c']=this.otherDetail['Military_Vet__c'];
            }
            this.customValidations(fields);
    }
}