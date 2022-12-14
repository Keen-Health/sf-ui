import { api, LightningElement, track, wire } from 'lwc';
import LightningConfirm from 'lightning/confirm';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import postCallout from '@salesforce/apex/ExternalCallout.postCallout';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import getAccountInfo from '@salesforce/apex/GenerateQuoteController.getKeenMembersData';
import updateAccount from '@salesforce/apex/GenerateQuoteController.updateKeenMemberData';
import getMemberMedicationsInfo from '@salesforce/apex/GenerateQuoteController.getMemberMedication';
import getMemberPhysiciansInfo from '@salesforce/apex/GenerateQuoteController.getMemberPhysician';
import getMemberPharmaciesInfo from '@salesforce/apex/GenerateQuoteController.getMembersPharmacies';
import getSunFireStatus from '@salesforce/apex/GenerateQuoteController.getSunFireStatus';
import getSunFireResponse from '@salesforce/apex/GenerateQuoteController.getSunFireResponse';
import deletePhysiciansInfo from '@salesforce/apex/GenerateQuoteController.deletePhysicians';
import deletePharmaciesInfo from '@salesforce/apex/GenerateQuoteController.deletePharmacies';
import deleteMedicationsInfo from '@salesforce/apex/GenerateQuoteController.deleteMedications';
import checkPermissionGenerateQuote from '@salesforce/apex/GenerateQuoteController.checkPermissionGenerateQuote';

export default class GenerateQuote extends NavigationMixin(LightningElement) {
    //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    @api recordId;
    @track isModalOpen = false;
    @track member = {};
    @track years;
    @track isPharmacyFieldVisible = false;
    @track isMedicationsFieldVisible = false;
    @track isDoctorsFieldVisible = false;
    @track isEnrolledFieldVisible = false;
    @track isImpFieldVisible = false;
    @track isSeeDoctorFieldVisible = false;
    @track isSubsidyFieldVisible = false;
    @track isIndemnityFieldVisible = false;
    @track isDrugCoPayFieldVisible = false;
    @track isMonthlyPlanPremiumFieldVisible = false;
    @track isVisibleCurrentPlan = false;
    @track isVisibleCurrentPlanType = false;
    @track isMedicareSupplement = false;
    @track isPharmaciesAvailable = false;
    @track isMedicationsAvailable = false;
    @track isPhysiciansAvailable = false;
    @track isPhoneRequired = false;
    @track isEmailRequired = false;
    selectedPriorities = [];
    userEmail;
    @api listMessagesModalData;
    @track isGenerateQuoteBtnDisabled = false;
    @track GenerateQuoteBtnHelptext = null;
    @track generateQuoteTimeCount = { min: 0, sec: 0 };
    @track strCountDown = null;
    @track isgenerateQuoteTimerEnabled = false;
    @track validationErrors = {
        mediPharm: false, medications: false, pharmacies: false, physicians: false,
        primaryContact: false
    }
    generateQuoteTimer = null;
    isAurthForGenerateQuote = false;
    showListMessagesModal = false;
    primaryContactErrMsg = '';
    updatedPhoneNumbers = {};

    //********************** */
    subscription = {};
    CHANNEL_NAME = '/event/newRelatedListRecordCreated__e';

    connectedCallback() {
        this.isLoading = true;
        checkPermissionGenerateQuote()
            .then(result =>
                this.isAurthForGenerateQuote = result)


        //this.fetchAccounts();
        subscribe(this.CHANNEL_NAME, -1, this.manageEvent).then(response => {
            this.subscription = response;
        });
        onError(error => {
            // console.error('Server Error--->' + error);
            this.showErrorToast(error.body.message);
        });
    }

    manageEvent = event => {
        const refreshRecordEvent = event.data.payload;
        this.getMemberMedications();
        this.getMemberPhysicians();
        this.getMemberPharmacies();
    }

    disconnectedCallback() {
        unsubscribe(this.subscription, response => {
        });
    }

    //********************** */

    pharmaciesTableColumns = [
        { label: 'Name', fieldName: 'recordUrl', type: 'url', typeAttributes: { label: { fieldName: 'name' }, value: { fieldName: 'recordUrl' }, target: '_blank' } },
        { label: 'City', fieldName: 'city', type: 'text' },
        { label: 'Phone', fieldName: 'phone', type: 'text' },
        { label: 'Is Primary', fieldName: 'isPharmacyPrimary', type: 'text' }
    ];
    medicationsTableColumns = [
        { label: 'Medication', fieldName: 'recordUrl', type: 'url', typeAttributes: { label: { fieldName: 'name' }, value: { fieldName: 'recordUrl' }, target: '_blank' } },
        /* { label: 'Sunfire dosage', fieldName: 'sunfireDosage', type: 'text' },
         { label: 'Sunfire package', fieldName: 'sunfirePackage', type: 'text' },*/
        { label: 'Strength', fieldName: 'strength', type: 'text' },
        { label: 'Packaging', fieldName: 'packaging', type: 'text' },
        { label: 'Refill quantity', fieldName: 'quantityPerRefill', type: 'text' },
        { label: 'Refill frequency', fieldName: 'refillFrequency', type: 'text' }
        /* {label: 'Valid Until', fieldName: 'ValidUntil', type: 'text'},
        {label: 'Drug From', fieldName: 'DrugFrom', type: 'text'}*/
    ];
    physiciansTableColumns = [
        { label: 'Name', fieldName: 'recordUrl', type: 'url', typeAttributes: { label: { fieldName: 'name' }, value: { fieldName: 'recordUrl' }, target: '_blank' } },
        { label: 'Specialty', fieldName: 'specialty', type: 'text' },
        { label: 'Phone', fieldName: 'phone', type: 'text' },
        { label: 'City', fieldName: 'city', type: 'text' },
        { label: 'State', fieldName: 'state', type: 'text' }
    ];

    pharmaciesObjectApiName = 'Member_s_pharmacy__c';
    medicationsObjectApiName = 'MemberMedication__c';
    physiciansObjectApiName = 'Member_s_physician__c';

    getMemberInfo() {
        this.member = {};
        getAccountInfo({ accountId: this.recordId })
            .then(result => {
                let keenMemberAccData = JSON.parse(JSON.stringify(result.keenMemberAccountMap));
                this.userEmail = result.userEmail;
                for (var key in keenMemberAccData) {
                    this.setDataToLocalObj(keenMemberAccData[key]);
                }
            })


        this.setIntialDefaultStatus();
        // Get related lists (Pharmacies, Medications and Physicians) data...
        this.getMemberPharmacies();
        this.getMemberMedications();
        this.getMemberPhysicians();

    }

    setIntialDefaultStatus() {
        this.member['isPharmaciesRequired'] = 'y';
        this.member['isPharmaciesRequired_flag'] = this.member['isPharmaciesRequired'] == 'y';
        this.member['isMedicationsRequired'] = 'y';
        this.member['isMedicationsRequired_flag'] = this.member['isMedicationsRequired'] == 'y';
        this.member['isPhysiciansRequired'] = 'y';
        this.member['isPhysiciansRequired_flag'] = this.member['isPhysiciansRequired'] == 'y';
    }

    getMemberPharmacies() {
        getMemberPharmaciesInfo({ id: this.recordId })
            .then(result => {
                this.member['pharmacies'] = result;
                this.isPharmaciesAvailable = this.member['pharmacies'] && this.member['pharmacies'].length > 0;
            })
            .catch(error => {
                this.showErrorToast(error.body.message);
            });
    }

    getMemberMedications() {
        getMemberMedicationsInfo({ id: this.recordId })
            .then(result => {
                this.member['medications'] = result;
                this.isMedicationsAvailable = this.member['medications'] && this.member['medications'].length > 0;
            })
            .catch(error => {
                this.showErrorToast(error.body.message);
            });
    }

    getMemberPhysicians() {
        getMemberPhysiciansInfo({ id: this.recordId })
            .then(result => {
                this.member['physicians'] = result;
                this.isPhysiciansAvailable = this.member['physicians'] && this.member['physicians'].length > 0;
            })
            .catch(error => {
                this.showErrorToast(error.body.message);
            });
    }

    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }

    closeModal() {
        //@TODO: Dispatch an event from here to update the parent component.

        // Reset data
        this.resetData();

        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }

    resetData() {
        this.isPharmacyFieldVisible = false;
        this.isMedicationsFieldVisible = false;
        this.isDoctorsFieldVisible = false;
        this.isEnrolledFieldVisible = false;
        this.isImpFieldVisible = false;
        this.isSeeDoctorFieldVisible = false;
        this.isSubsidyFieldVisible = false;
        this.isIndemnityFieldVisible = false;
        this.isDrugCoPayFieldVisible = false;
        this.isMonthlyPlanPremiumFieldVisible = false;
        this.isVisibleCurrentPlan = false;
        this.isVisibleCurrentPlanType = false;
        this.isMedicareSupplement = false;
        this.isPharmaciesAvailable = false;
        this.isMedicationsAvailable = false;
        this.isPhysiciansAvailable = false;
        this.isPhoneRequired = false;
        this.isEmailRequired = false;
        this.resetValidationErrors();

        this.userEmail = null;
        this.selectedPriorities = [];
        this.patientImportanceOptions.forEach(element => {
            element.isSelected = false;
            element.priority = 0;
        });
        this.member = {};
        this.member['priority'] = [];
    }

    @wire(getSunFireStatus, { recId: '$recordId' })
    getSunFireStatusResponse(result) {
        if (result) {
            if (result.data) {
                let status = result.data[0]['Sunfire_Status__c'];
                // this.member['isGenerateQuoteBtnVisible'] = result.data[0]['Generate_Quote_Enable__c'];
                if (status == 405 || status == undefined || status == null || status == '') { //NULL or 405: ‘Generate Quote’ button: Enabled
                    this.isGenerateQuoteBtnDisabled = false;
                    this.GenerateQuoteBtnHelptext = null;
                } else if (status == 200) { //Tooltip: Quote generated successfully on <date time>  
                    let dt = result.data[0]['Sunfire_Response_Date__c'];
                    this.isGenerateQuoteBtnDisabled = false;
                    this.GenerateQuoteBtnHelptext = 'Quote generated successfully on ' + this.getFormattedDate(dt.toString()) + '.';
                }
                else if (status == 100) {  //Tooltip: Data entry to Sunfire is in progress. Please wait.
                    this.isGenerateQuoteBtnDisabled = false;
                    this.GenerateQuoteBtnHelptext = 'Data entry to Sunfire is in progress. Please wait.';
                }
            }
        }
        else if (error) {
            this.error = error;
            this.member = undefined;
        } else {
            // console.log('No response received.');
        }
    };

    setDataToLocalObj(data) {
        this.member['id'] = data['Id'];
        this.member['salutation'] = data['Salutation'];
        this.member['accountNumber'] = data['AccountNumber'];
        this.member['firstName'] = data['FirstName'];
        this.member['lastName'] = data['LastName'];
        this.updateDobData(data['DoB__c']);
        this.member['shippingPostalCode'] = data['PersonMailingPostalCode'];
        this.member['email'] = data['PersonEmail'];
        this.member['phone'] = data['Phone'];
        this.member['PersonAssistantPhone'] = data['PersonAssistantPhone'];
        this.member['PersonHomePhone'] = data['PersonHomePhone'];
        this.member['PersonMobilePhone'] = data['PersonMobilePhone'];
        this.member['PersonOtherPhone'] = data['PersonOtherPhone'];
        this.member['county'] = data['County__c'];
        this.member['primaryPhone'] = data['PrimaryContactFieldName__c'] ? data['PrimaryContactFieldName__c'] : "";
        this.member['primaryContact'] = data['VerifyPagePrimaryContact__c'];
        this.updateEnrolledData(data['Enrolled_in_MAP_or_PDP__c']);
        this.member['planYear'] = data['Plan_Year__c'] ? data['Plan_Year__c'] : this.planYearOptions[1].value;
        this.member['gender'] = data['GenderIdentity__c'];
        this.member['currentPlan'] = data['Current_Plan_Name__c'];
        this.member['currentPlanType'] = data['Current_Plan_Type__c'];
        this.member['frequency'] = data['Doctor_visits_per_year__c'];
        this.updateExtraHelpData(data['Extra_help_or_low_income_subsidy__c']);
        this.updateDrugCoPayData(data['Drug_co_pay_co_insurance__c']);
        this.member['monthlyPlanPremium'] = data['Monthly_plan_premium__c'];
        if (data['Effective_date__c'] && data['Effective_date__c'].toString() != '1900-01-01') {
            this.member['effectiveDate'] = this.getFormattedDate(data['Effective_date__c']);  //"Effective_date__c":"2022-11-01"
        }
        if (data['Part_B_effective_date__c'] && data['Part_B_effective_date__c'].toString() != '1900-01-01') {
            let part_B_effective_date = new Date(data['Part_B_effective_date__c']); // "Part_B_effective_date__c":"2022-11-05" //partB_EffectiveYear, partB_EffectiveMonth
            this.member['partB_EffectiveMonth'] = (part_B_effective_date.getMonth() + 1).toString();
            if (this.member['partB_EffectiveMonth'] && this.member['partB_EffectiveMonth'].length < 2) {
                this.member['partB_EffectiveMonth'] = '0' + this.member['partB_EffectiveMonth'];
            }
            this.member['partB_EffectiveYear'] = part_B_effective_date.getFullYear().toString();
        }
        this.member['tobaccoUse'] = data['Tobacco_use__c'];
        this.member['householdDiscount'] = data['Household_discount__c'];
        // set plan types to discuss with consumer and call change handler
        if (data['Plans_to_discuss__c']) {
            let values = String(data['Plans_to_discuss__c']).split(';');
            this.updateFieldVisibility(values);
        } else {
            this.member['planTypes'] = [];
        }
        if (data['What_s_most_important_to_the_patient__c']) {
            // call What_s_most_important_to_the_patient field change handler to update patientImportanceOptions property
            //Extected date: "What_s_most_important_to_the_patient__c":"any_provider;traveller;dental"
            let values = data['What_s_most_important_to_the_patient__c'].split(';');
            this.updatePriorityData(values);
        } else {
            // *Note: Don't make it null, it throws error at runtime
            this.member['priority'] = [];
        }
        // call indemnity field change handler
        this.updateIndemnityData(data['Hospital_indemnity_information__c']);
        this.openModal();

        //@TODO: let it be print, till the QA testing completed.

    }

    resetValidationErrors() {
        this.validationErrors['mediPharm'] = false;
        this.validationErrors['physicians'] = false;
        this.validationErrors['medications'] = false;
        this.validationErrors['pharmacies'] = false;
        this.validationErrors['primaryContact'] = false;
    }

    validVariable(variable) {
        if (variable === null || variable === "" || variable === undefined) {
            return false
        }
        return true
    }


    isDataValid() {
        let isValid = { mediPharm: true, fieldValid: true, pharmacies: true, primaryContact: true };
        this.resetValidationErrors();
        let inputFields = this.template.querySelectorAll('.fieldvalidate');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid['fieldValid'] = false;
            }
        });
        /* inputFields = this.template.querySelectorAll('.conditionalValidate');
        inputFields.forEach(inputField => {
            if(!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        }); */


        if (this.isMedicationsAvailable && !this.isPharmaciesAvailable) {
            isValid['mediPharm'] = false;
            this.validationErrors['mediPharm'] = true;
        }

        if (!this.validationErrors['mediPharm'] && this.getMemberData('pharmaciesForSF').length === 0 && this.member['isPharmaciesRequired'] === 'y') {
            isValid['pharmacies'] = false;
            this.validationErrors['pharmacies'] = true;
        }

        if (this.getMemberData('medicationsForSF').length === 0 && this.member['isMedicationsRequired'] === 'y') {
            isValid['medications'] = false;
            this.validationErrors['medications'] = true;
        }

        if (this.getMemberData('physiciansForSF').length === 0 && this.member['isPhysiciansRequired'] === 'y') {
            isValid['physicians'] = false;
            this.validationErrors['physicians'] = true;
        }

        if (this.getMemberData('primaryContact') == 'email' && this.getMemberData('email') == '') {
            this.validationErrors['primaryContact'] = true;
            this.primaryContactErrMsg = 'Email';
        }

        if ((this.getMemberData('primaryContact') == 'phone' || this.getMemberData('primaryContact') == 'text')
            && this.getMemberData('phone') == '') {
            this.validationErrors['primaryContact'] = true;
            this.primaryContactErrMsg = 'Phone number';
        }


        return isValid;
    }

    submitDetails() {
        /* 1. call sunfire POST API
        2. save data to SF
        3. close modal */
        const isValid = this.isDataValid();
        let validator = true;
        Object.values(isValid).forEach(val => validator = val && validator);
        if (validator) {
            this.saveDataToSF();
        } else if (!isValid.fieldValid) {
            //this.showErrorToast('Please fill out all required fields indicated with an *.');
            this.showErrorToast('Please fix the error(s) before initiating the data transfer to Sunfire.');
        }
    }

    saveDataToSF() {
        this.updatePrimaryPhone();
        let req = this.getSalesForceRequestObject();

        updateAccount({ inputJson: JSON.stringify(req) })
            .then(result => {
                getRecordNotifyChange([{recordId: this.recordId}]);
                this.callSunfireAPI();
            })
            .catch(error => {
                this.showErrorToast(error.body.message);
            });
    }

    callSunfireAPI() {
        //calling the sunfire api
        this.generateQuote();

        this.showSuccessToast('Successfully initiated data transfer to Sunfire. Await status updates.');
        this.isGenerateQuoteBtnDisabled = true;
        this.GenerateQuoteBtnHelptext = 'Data entry to Sunfire is in progress. Please wait.';
        this.isgenerateQuoteTimerEnabled = true;
        var timeCounter = 180;
        var tenSecCounter = 0;
        var twentySecCounter = 0;
        var self = this;
        //3 Min Timer starts here
        this.generateQuoteTimer = setInterval(() => {
            timeCounter -= 1
            self.generateQuoteTimeCount['min'] = Math.floor(timeCounter / 60);
            self.generateQuoteTimeCount['sec'] = ('0' + timeCounter % 60).slice(-2);
            tenSecCounter += 1;
            twentySecCounter += 1;

            if (tenSecCounter == 10) {
                tenSecCounter = 0;
                twentySecCounter >= 20 ? self.checkSunfireResponse() : "";
            }

            if (timeCounter === 0) {
                clearInterval(self.generateQuoteTimer);
                self.isgenerateQuoteTimerEnabled = false;
                self.isGenerateQuoteBtnDisabled = false;
                self.GenerateQuoteBtnHelptext = null;
                self.showErrorToast('Quote generation failed. Please regenerate the quote.');
            }
        }, 1000);
    };


    generateQuote() {
        let req = this.getSunfireRequestObject();
        postCallout({ inputJson: JSON.stringify(req) }).then((response) => {

        }).catch((error) => {
            this.showErrorToast('Please try again after sometime.');
            this.showErrorToast(error.body.message);
            this.isGenerateQuoteBtnDisabled = false;
            this.GenerateQuoteBtnHelptext = null;
            clearInterval(this.generateQuoteTimer);
            this.isgenerateQuoteTimerEnabled = false;
        });

        this.closeModal();
    };


    checkSunfireResponse() {
        getSunFireResponse({ recId: this.recordId }).then(response => {
            if (response && response[0] && response[0]['Sunfire_Status__c'] != 100) {
                const statusCode = response[0]['Sunfire_Status__c'];
                if (statusCode == 200) {
                    const bodyData = response[0]['Sunfire_Response__c'];
                    // this.showSuccessToast('Quote generated successfully!');
                    this.isGenerateQuoteBtnDisabled = false;
                    this.GenerateQuoteBtnHelptext = 'Quote generated successfully on ' + this.getFormattedDate(new Date().toString());
                    this.showSucessResponseModal(bodyData);
                } else if (statusCode == 405) {
                    this.showErrorToast('Quote generation failed. Please regenerate the quote.');
                    this.isGenerateQuoteBtnDisabled = false;
                    this.GenerateQuoteBtnHelptext = null;
                }
                clearInterval(this.generateQuoteTimer);
                this.isgenerateQuoteTimerEnabled = false;
            }
        })
    };


    showSucessResponseModal(bodyData) {
        this.listMessagesModalData = {
            title: "Quote created in Sunfire!",
            validation: false,
            body: bodyData,
            buttons: [
                {
                    id: 2, label: "Close",
                    callBack: () => { this.showListMessagesModal = false; },
                    variant: "brand"
                },
            ]
        };

        this.showListMessagesModal = true;
    };



    showSuccessToast(message) {
        const evt = new ShowToastEvent({
            title: 'Success!',
            message: message,
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    };
    showErrorToast(message) {
        const evt = new ShowToastEvent({
            title: 'Error!',
            message: message,
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    };

    getSunfireRequestObject() {
        //this.userEmail,   @TODO: hardcoded email id as per Sunil request
        let reqObj = {
            "advisor_credentials": {
                "advisor_email_id": 'desiree.brown@choosekeen.com',  
                "record_id": '0017700000AQZZXAA5'
            },
            "contact_details": {
                "salutation": this.getMemberData('salutation'),
                "first_name": this.getMemberData('firstName'),
                "last_name": this.getMemberData('lastName'),
                "date_of_birth": this.getMemberData('dob'),
                "zipcode": this.getMemberData('shippingPostalCode'),
                "email": this.getMemberData('email'),
                "phone_number": this.getMemberData('phone'),
                "method_of_contact": this.getMemberData('primaryContact')
            },
            "customer_profile": {
                "county": this.getMemberData('county'),
                "plan_types": this.getMemberData('planTypes'),
                "plan_year": this.getMemberData('planYear'),
                "med_pharmacy": this.getMemberData('pharmacies'),
                "medications": this.getMemberData('medications'),
                "priority": this.getMemberData('priority'),
                "provider_details": this.getMemberData('physicians'),
                "currently_enrolled": 'n',
                "current_plan": '',
                "current_plan_type": 'dont_know',
                "how_often": this.getMemberData('frequency'),
                "extra_help": this.getMemberData('extraHelp'),
                "drug_copay": this.getMemberData('drugCoPay'),
                "monthly_premium": this.getMemberData('monthlyPlanPremium'),
                "add_indemnity": this.getMemberData('indemnity'),
                "indemnity_details": {
                    "effective_date": this.getMemberData('effectiveDate'),
                    "date_of_birth": this.getMemberData('dob'), //this.getMemberData('indemnityDob'),
                    "part_b_effective_date": this.getMemberData('part_b_effective_date'),
                    "gender": this.getMemberData('gender'),
                    "tobacco_use": this.getMemberData('tobaccoUse'),
                    "household_discount": this.getMemberData('householdDiscount')
                }
            }
        };
        return reqObj;
    }

    updatePrimaryPhone() {
        if (this.member['primaryPhone'] == '' && this.getMemberData('phone') != '') {
            this.member['primaryPhone'] = 'PersonHomePhone';
        }

        this.updatedPhoneNumbers = {
            personAssistantPhone: this.member['primaryPhone'] == 'PersonAssistantPhone' ? this.getMemberData('phone') : this.member['PersonAssistantPhone'],
            personHomePhone: this.member['primaryPhone'] == 'PersonHomePhone' ? this.getMemberData('phone') : this.member['PersonHomePhone'],
            personMobilePhone: this.member['primaryPhone'] == 'PersonMobilePhone' ? this.getMemberData('phone') : this.member['PersonMobilePhone'],
            personOtherPhone: this.member['primaryPhone'] == 'PersonOtherPhone' ? this.getMemberData('phone') : this.member['PersonOtherPhone'],
        }

    }
    getSalesForceRequestObject() {


        let reqObj = {
            "Id": this.getMemberData('id'),
            "FirstName": this.getMemberData('firstName'),
            "LastName": this.getMemberData('lastName'),
            "DoB__c": this.getMemberData('dobForSF'),
            "PersonMailingPostalCode": this.getMemberData('shippingPostalCode'),
            "PersonEmail": this.getMemberData('email'),
            "Phone": this.getMemberData('phone'),
            "County__c": this.getMemberData('county'),
            "PersonAssistantPhone": this.updatedPhoneNumbers['personAssistantPhone'],
            "PersonHomePhone": this.updatedPhoneNumbers['personHomePhone'],
            "PersonMobilePhone": this.updatedPhoneNumbers['personMobilePhone'],
            "PersonOtherPhone": this.updatedPhoneNumbers['personOtherPhone'],
            "PrimaryContactFieldName__c": this.member['primaryPhone'],
            "VerifyPagePrimaryContact__c": this.getMemberData('primaryContact'),
            "Enrolled_in_MAP_or_PDP__c": 'n',
            "GenderIdentity__c": this.getMemberData('gender'),
            "Current_Plan_Name__c": '',
            "Current_Plan_Type__c": 'dont_know',
            "What_s_most_important_to_the_patient__c": this.getMemberData('priorityForSF'),
            "Plans_to_discuss__c": this.getMemberData('planTypesForSF'),
            "Doctor_visits_per_year__c": this.getMemberData('frequency'),
            "Extra_help_or_low_income_subsidy__c": this.getMemberData('extraHelp'),
            "Drug_co_pay_co_insurance__c": this.getMemberData('drugCoPay'),
            "Monthly_plan_premium__c": this.getMemberData('monthlyPlanPremium'),
            "Hospital_indemnity_information__c": this.getMemberData('indemnity'),
            "Effective_date__c": this.getMemberData('effectiveDateForSF'),
            "Part_B_effective_date__c": this.getMemberData('part_b_effective_dateForSF'),
            "Tobacco_use__c": this.getMemberData('tobaccoUse'),
            "Household_discount__c": this.getMemberData('householdDiscount'),
            "Plan_Year__c": this.getMemberData('planYear'),
            "Pharmacies": this.getMemberData('pharmaciesForSF'),
            "Medications": this.getMemberData('medicationsForSF'),
            "Physicians": this.getMemberData('physiciansForSF'),
            "Sunfire_Status__c": '100'
        };
        return reqObj;
    }
    getMemberData(field) {
        let data = null;
        switch (field) {
            case "planTypes": {
                data = {
                    "med_adv_partd": this.member['planTypes'].indexOf('med_adv_partd') > -1 ? 'y' : 'n',
                    "partd": this.member['planTypes'].indexOf('partd') > -1 ? 'y' : 'n',
                    "med_sup": this.member['planTypes'].indexOf('med_sup') > -1 ? 'y' : 'n',
                    "med_adv": this.member['planTypes'].indexOf('med_adv') > -1 ? 'y' : 'n',
                    "special_needs": this.member['planTypes'].indexOf('special_needs') > -1 ? 'y' : 'n'
                };
                break;
            }
            case "part_b_effective_date": {
                data = "";
                if (this.member['partB_EffectiveMonth'] && this.member['partB_EffectiveYear']) {
                    let month;
                    this.monthOptions.forEach(element => {
                        if (element.value == this.member['partB_EffectiveMonth']) {
                            month = element.label;
                        }
                    });
                    data = month + '/' + this.member['partB_EffectiveYear'];
                }
                break;
            }
            case "part_b_effective_dateForSF": {
                data = '01/01/1900';
                if (this.member['partB_EffectiveMonth'] && this.member['partB_EffectiveYear']) {
                    data = this.member['partB_EffectiveMonth'] + '/01/' + this.member['partB_EffectiveYear'];
                }
                break;
            }
            case "planTypesForSF": {
                data = this.member['planTypes'] ? this.member['planTypes'].join(';') : "";
                break;
            }
            case "priorityForSF": {
                data = this.member['priority'] ? this.member['priority'].join(';') : "";
                break;
            }
            case 'pharmacies': {
                /*
                    Get the value from the primary pharmacy of the member. 
                    If more than one pharmacies are marked primary, select the record with the most recent association date.
                    If none of the pharmacies are marked as primary, send the most recent associated pharmacy.
                */
                let pharm = "";
                if (this.member['pharmacies'] && this.member['pharmacies'].length > 0) {
                    this.member['pharmacies'].forEach(element => {
                        if (element.isPharmacyPrimary) {
                            pharm = element.name;
                        }
                    });
                    if (!pharm) {
                        pharm = this.member['pharmacies'][0]['name'];
                    }
                }
                data = pharm;
                break;
            }
            case 'pharmaciesForSF': {
                data = [];
                let pharm;
                this.member['pharmacies'].forEach(element => {
                    pharm = {
                        "name": element.name ? element.name : "",
                        "mailOrder": element.mailOrder ? element.mailOrder : "",
                        "recordUrl": element.recordUrl ? element.recordUrl : ""
                    };
                    data.push(pharm);
                });
                break;
            }
            case 'medications': {
                data = [];
                let med;
                this.member['medications'].forEach(element => {
                    med = {
                        "medication_name": element.name,
                        "dosage": element.strength ? element.strength : "",
                        "package": element.packaging ? element.packaging : "",
                        "quantity": element.quantityPerRefill ? element.quantityPerRefill : "",
                        "frequency": element.refillFrequency ? this.getMedicationFrequencyValue(element.refillFrequency) : 0
                        //"frequency": element.refillFrequency ? element.refillFrequency : 0
                    };
                    data.push(med);
                });
                break;
            }
            case 'medicationsForSF': {
                data = [];
                let med;
                this.member['medications'].forEach(element => {
                    med = {
                        "name": element.name ? element.name : "",
                        "sunfireDosage": element.strength ? element.strength : "",
                        "sunfirePackage": element.packaging ? element.packaging : "",
                        "quantityPerRefill": element.quantityPerRefill ? element.quantityPerRefill : "",
                        "refillFrequency": element.refillFrequency ? element.refillFrequency : "",
                        "recordUrl": element.recordUrl ? element.recordUrl : ""
                    };
                    data.push(med);
                });
                break;
            }
            case 'physicians': {
                data = [];
                let physician;
                this.member['physicians'].forEach(element => {
                    physician = {
                        "first_name": element.firstName ? element.firstName : "",
                        "last_name": element.lastName ? element.lastName : "",
                        "city": element.city ? element.city : "",
                        "state": element.state ? element.state : "",
                        "zip_code": element.zipcode ? element.zipcode : ""
                    };
                    data.push(physician);
                });
                break;
            }
            case 'physiciansForSF': {
                data = [];
                let physician;
                this.member['physicians'].forEach(element => {
                    physician = {
                        "FirstName": element.firstName ? element.firstName : "",
                        "LastName": element.lastName ? element.lastName : "",
                        "city": element.city ? element.city : "",
                        "state": element.state ? element.state : "",
                        "zipcode": element.zipcode ? element.zipcode : "",
                        "recordUrl": element.recordUrl ? element.recordUrl : ""
                    };
                    data.push(physician);
                });
                break;
            }
            case 'effectiveDate':
            case 'dob': {
                data = this.member[field] ? this.getFormattedDate(this.member[field]) : "";
                break;
            }
            case 'effectiveDateForSF':
            case 'dobForSF': {
                field = field == 'effectiveDateForSF' ? 'effectiveDate' : 'dob';
                data = (this.member[field] && this.member[field] != undefined) ? this.getFormattedDate(this.member[field]) : '01/01/1900';
                break;
            }
            default: {
                data = this.member[field] ? this.member[field] : "";
                break;
            }
        }
        return data;
    }

    /* Note: this is not a better approach changing the value in LWC. 
    This is the temporariry solution till we get it from SF */
    getMedicationFrequencyValue(frequency) {
        let frequencyValue = 0;
        switch (frequency) {
            case "Every month": {
                frequencyValue = 1;
                break;
            }
            case "Every 2 months": {
                frequencyValue = 2;
                break;
            }
            case "Every 3 months": {
                frequencyValue = 3;
                break;
            }
            case "Every 6 months": {
                frequencyValue = 6;
                break;
            }
            case "Every 12 months": {
                frequencyValue = 12;
                break;
            }
            default: {
                frequencyValue = 0;
                break;
            }
        }
        return frequencyValue;
    }

    getFormattedDate(date) {
        let formattedDate = null;
        const dt = new Date(date.toString());
        const yyyy = dt.getFullYear();
        let mm = dt.getMonth() + 1; // Months start from 0!
        let dd = dt.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        formattedDate = mm + '/' + dd + '/' + yyyy;
        return formattedDate;
    }

    @track patientImportanceOptions = [
        { label: 'Flexibility to see any provider', value: 'any_provider', priority: 0, isSelected: false },
        { label: 'Keep current doctors', value: 'keep_current', priority: 0, isSelected: false },
        { label: 'Frequent traveller', value: 'traveller', priority: 0, isSelected: false },
        { label: 'Dental coverage', value: 'dental', priority: 0, isSelected: false },
        { label: 'Vision coverage', value: 'vision', priority: 0, isSelected: false },
        { label: 'Hearing coverage', value: 'hearing', priority: 0, isSelected: false },
        { label: 'Insulin savings', value: 'insulin', priority: 0, isSelected: false },
        { label: 'Over-the-counter coverage (OTC)', value: 'otc', priority: 0, isSelected: false },
        { label: 'Transportation', value: 'transportation', priority: 0, isSelected: false }
    ];
    get contactOptions() {
        return [
            { label: 'None', value: 'none' },
            { label: 'Phone', value: 'phone' },
            { label: 'Email', value: 'email' },
            { label: 'Text', value: 'text' }
        ];
    }
    get planTypes() {
        return [
            { label: 'Original Medicare', value: 'medicare' },
            { label: 'Medicare Supplement', value: 'supplement' },
            { label: 'Other', value: 'other' },
            { label: 'I don\'t know', value: 'dont_know' }
        ];
    }
    get seeDoctorOptions() {
        return [
            { label: 'Rarely', value: 'rarely' },
            { label: 'Occasionally', value: 'occasionally' },
            { label: 'Frequently', value: 'frequently' },
            { label: 'I don\'t know', value: 'dont_know' }
        ];
    }
    get extraHelpOptions() {
        return [
            { label: 'Yes', value: 'y' },
            { label: 'No', value: 'n' },
            { label: 'I don\'t know', value: 'd' }
        ];
    }
    get drugCoPayOptions() {
        return [
            { label: '$1.35-$4.00 for covered drugs', value: '1to4' },
            { label: '$3.95-$9.85 for covered drugs', value: '3to9' },
            { label: 'Partial low income subsidy', value: 'partial' }
        ];
    }
    get monthlyPlanPremiumsOptions() {
        return [
            { label: '0%', value: '0' },
            { label: '25%', value: '25' },
            { label: '50%', value: '50' },
            { label: '75%', value: '75' }
        ];
    }
    get yesOrNoOptions() {
        return [
            { label: 'Yes', value: 'y' },
            { label: 'No', value: 'n' }
        ];
    }
    get genderOptions() {
        return [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' }
        ];
    }
    get planConsumerTypeOptions() {
        return [
            { label: 'Medicare Advantage/Part D', value: 'med_adv_partd' },
            { label: 'Part D', value: 'partd' },
            { label: 'Medicare Supplement', value: 'med_sup' },
            { label: 'Medicare Advantage', value: 'med_adv' },
            { label: 'Special Needs', value: 'special_needs' }
        ];
    }
    get effectiveDateOptions() {
        /* 1st of the next 6 months.
        Example: If today = Sep. 13, 2022, 
        available options are October 1, 2022, November 1, 2022, December 1, 2022, January 1, 2023, and February 1, 2023. */

        let options = [];
        let currentDate = new Date();
        currentDate.setDate(1);
        let dt = null;
        for (let i = 1; i <= 6; i++) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            dt = this.getFormattedDate(currentDate);
            let date = {
                label: dt,
                value: dt
            };
            options.push(date);
        }
        return options;
    }
    get planYearOptions() {
        //options current year and next year
        let options = [];
        let currentDate = new Date();
        for (let i = 1; i <= 2; i++) {
            let date = {
                label: currentDate.getFullYear().toString(),
                value: currentDate.getFullYear().toString()
            };
            options.push(date);
            currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
        return options;
    }

    get monthOptions() {
        return [
            { label: 'Jan', value: '01' },
            { label: 'Feb', value: '02' },
            { label: 'Mar', value: '03' },
            { label: 'Apr', value: '04' },
            { label: 'May', value: '05' },
            { label: 'Jun', value: '06' },
            { label: 'Jul', value: '07' },
            { label: 'Aug', value: '08' },
            { label: 'Sep', value: '09' },
            { label: 'Oct', value: '10' },
            { label: 'Nov', value: '11' },
            { label: 'Dec', value: '12' }
        ];
    }

    updateYearOptions() {
        /* Years - Year of Birth to next year (Current year + 1) */
        let memberBirthYear = String(this.member['dob']).split('-')[0];
        this.years = [];
        let currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        for (let i = currentDate.getFullYear(); i >= memberBirthYear; i--) {
            let year = {
                label: String(i),
                value: String(i)
            };
            this.years.push(year);
        }
    }
    changeHandler(e) {
        this.member[e.target.name] = e.target.value;
    }
    handleChangeForPrimaryContact(e) {
        this.member[e.target.name] = e.target.value;

        if (e.target.value == this.contactOptions[1] || e.target.value == this.contactOptions[3]) {
            this.isPhoneRequired = true;
            this.isEmailRequired = false;
        } else if (e.target.value == this.contactOptions[2]) {
            this.isEmailRequired = true;
            this.isPhoneRequired = false;
        } else {
            this.isEmailRequired = false;
            this.isPhoneRequired = false;
        }
    }
    handleChangeforExtraHelp(e) {
        this.updateExtraHelpData(e.detail.value);
    }
    updateExtraHelpData(value) {
        this.member['extraHelp'] = value;
        this.isDrugCoPayFieldVisible = value == this.extraHelpOptions[0].value;
        if (!this.isDrugCoPayFieldVisible) {
            this.updateDrugCoPayData(null);
        }
    }
    handleChangeforDrugCoPay(e) {
        this.updateDrugCoPayData(e.detail.value);
    }
    updateDrugCoPayData(value) {
        this.member['drugCoPay'] = value;
        this.isMonthlyPlanPremiumFieldVisible = value == this.drugCoPayOptions[2].value;
        if (!this.isMonthlyPlanPremiumFieldVisible) {
            this.member['monthlyPlanPremium'] = null;
        }
    }
    handleChangeforIndemnity(e) {
        this.updateIndemnityData(e.detail.value);
    }
    updateIndemnityData(value) {
        this.member['indemnity'] = value;
        this.isMedicareSupplement = value == this.yesOrNoOptions[0].value;
        if (!this.isMedicareSupplement) {  // If 'no', reset indemnity details
            this.member['effectiveDate'] = null;
            this.member['indemnityDob'] = null;
            this.member['partB_EffectiveMonth'] = null;
            this.member['partB_EffectiveYear'] = null;
            // this.member['gender'] = null;
            this.member['tobaccoUse'] = null;
            this.member['householdDiscount'] = null;
        }
    }
    dobChangeHandler(e) {
        this.updateDobData(e.target.value);
    }
    updateDobData(value) {
        this.member['dob'] = value;
        this.updateYearOptions();
    }
    /* handleChangeforIndemnityDob(e) {
        this.member[e.target.name] = e.target.value;
        this.updateYearOptions();
    } */
    handleChangeforEnrolled(e) {
        this.updateEnrolledData(e.detail.value);
    }
    updateEnrolledData(value) {
        // this.member['isEnrolled'] = value;
        // //this.isEnrolled = e.detail.value == this.yesOrNoOptions[0].value;
        // if (this.member['isEnrolled'] == 'y') {
        //     this.isVisibleCurrentPlan = true;
        //     this.isVisibleCurrentPlanType = false;
        //     this.member['currentPlanType'] = null;
        // } else if (this.member['isEnrolled'] == 'n') {
        //     this.isVisibleCurrentPlanType = true;
        //     this.isVisibleCurrentPlan = false;
        // }
    }
    handleChangeforRelatedListRequired(e) {
        //e.preventDefault();
        //e.stopPropagation();

        this.updateRelatedListData(e.target.value, e.target.name, e);
    }
    updateRelatedListData(value, relatedListName, event) {
        if (value == 'y') { // when selects YES
            this.member[relatedListName] = value;
            this.member[relatedListName + '_flag'] = true;
        } else if (value == 'n') {   // when selects NO
            switch (relatedListName) {
                case 'isPharmaciesRequired':
                    if (this.isPharmaciesAvailable) {
                        let res = this.handleConfirmClick('pharmacy', relatedListName, event);

                    } else {
                        this.member[relatedListName] = value;
                        this.member[relatedListName + '_flag'] = false;
                    }
                    break;
                case 'isMedicationsRequired':
                    if (this.isMedicationsAvailable) {
                        let res = this.handleConfirmClick('medication', relatedListName, event);
                    } else {
                        this.member[relatedListName] = value;
                        this.member[relatedListName + '_flag'] = false;
                    }
                    break;
                case 'isPhysiciansRequired':
                    if (this.isPhysiciansAvailable) {
                        let res = this.handleConfirmClick('doctor', relatedListName, event);
                    } else {
                        this.member[relatedListName] = value;
                        this.member[relatedListName + '_flag'] = false;
                    }
                    break;
            }
        }
    }

    handleChangeforConsumerPlanType(e) {
        this.updateFieldVisibility(e.target.value);
    }

    updateFieldVisibility(value) {

        this.member['planTypes'] = value;
        let selectedPlanTypes = value;

        this.isPharmacyFieldVisible = selectedPlanTypes.indexOf(this.planConsumerTypeOptions[0].value) > -1
            || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[1].value) > -1
            || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[4].value) > -1;

        this.isMedicationsFieldVisible = selectedPlanTypes.indexOf(this.planConsumerTypeOptions[0].value) > -1
            || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[1].value) > -1
            || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[4].value) > -1;

        this.isDoctorsFieldVisible = selectedPlanTypes.indexOf(this.planConsumerTypeOptions[0].value) > -1
            || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[3].value) > -1
            || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[4].value) > -1;

        // this.isEnrolledFieldVisible = selectedPlanTypes.indexOf(this.planConsumerTypeOptions[0].value) > -1
        //     || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[1].value) > -1
        //     || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[4].value) > -1;

        this.isImpFieldVisible = selectedPlanTypes.indexOf(this.planConsumerTypeOptions[0].value) > -1
            || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[4].value) > -1;

        this.isSeeDoctorFieldVisible = selectedPlanTypes.indexOf(this.planConsumerTypeOptions[0].value) > -1
            || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[3].value) > -1
            || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[4].value) > -1;

        this.isSubsidyFieldVisible = selectedPlanTypes.indexOf(this.planConsumerTypeOptions[0].value) > -1
            || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[1].value) > -1
            || selectedPlanTypes.indexOf(this.planConsumerTypeOptions[4].value) > -1;

        this.isIndemnityFieldVisible = selectedPlanTypes.indexOf(this.planConsumerTypeOptions[2].value) > -1;
    }

    handleChangeforPriority(e) {
        this.updatePriorityDataOnUserSelection(e.target.value);
    }

    updatePriorityDataOnUserSelection(value) {
        this.patientImportanceOptions.forEach(item => {
            if (item.value == value) {
                item.isSelected = !item.isSelected;
                if (item.isSelected) {
                    this.selectedPriorities.push(item.value);
                } else {
                    this.selectedPriorities.splice(this.selectedPriorities.indexOf(item.value), 1);
                }
            }
        });
        let index;
        this.patientImportanceOptions.forEach(item => {
            index = this.selectedPriorities.indexOf(item.value);
            if (index > -1) {
                item.priority = index + 1;
            } else {
                item.priority = 0;
            }
        });
        this.member['priority'] = this.selectedPriorities;
    }

    updatePriorityData(value) {
        this.selectedPriorities = value;
        this.patientImportanceOptions.forEach(item => {
            item.isSelected = value.indexOf(item.value) > -1;
        });
        let index;
        this.patientImportanceOptions.forEach(item => {
            index = this.selectedPriorities.indexOf(item.value);
            if (index > -1) {
                item.priority = index + 1;
            } else {
                item.priority = 0;
            }
        });
        this.member['priority'] = this.selectedPriorities;
    }
    showPharmaciesForm(event) {
        this.handleRelatedListNavigation(this.pharmaciesObjectApiName);
    }
    showMedicationsForm(event) {
        this.handleRelatedListNavigation(this.medicationsObjectApiName);
    }
    showPhysiciansForm(event) {
        this.handleRelatedListNavigation(this.physiciansObjectApiName);
    }
    handleRelatedListNavigation(apiName) {
        /* Note: we may not need these many properties here. 
        Check with @Lavanya and change these fields according to SF Object. */
        const defaultValues = encodeDefaultFieldValues({
            KeenMember__c: this.recordId,
            Account__c: this.recordId,
            Keen_member__c: this.recordId,
            Keen_leads_and_members__c: this.recordId
        });

        // Invoke navigate by passing the config object
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: apiName,
                actionName: 'new'
            },
            state: {
                defaultFieldValues: defaultValues,
                navigationLocation: 'RELATED_LIST'
            }
        });
    }
    async handleConfirmClick(relatedText, relatedListName, event) {
        const result = await LightningConfirm.open({
            message: 'You may lose the ' + relatedText + ' records. Are you sure you want to update?',
            variant: 'header',
            label: 'Please Confirm',
            theme: 'warning',
        });

        if (result == true) {
            this.member[relatedListName] = 'n';
            this.member[relatedListName + '_flag'] = false;
            if (relatedListName == 'isPharmaciesRequired') {

                this.member['pharmacies'] = [];

                deletePharmaciesInfo({ accountId: this.recordId });

                this.isPharmaciesAvailable = false;
            } else if (relatedListName == 'isMedicationsRequired') {
                this.member['medications'] = [];

                deleteMedicationsInfo({ accountId: this.recordId });
                this.isMedicationsAvailable = false;

            } else if (relatedListName == 'isPhysiciansRequired') {
                this.member['physicians'] = [];

                deletePhysiciansInfo({ accountId: this.recordId });

                this.isPhysiciansAvailable = false;
            }


        } else {
            // setTimeout(() => {
            //     this.member[relatedListName] = 'y';
            //     event.target.checked = true;
            //     event.target.value = 'y';
            // }, 0);
            this.member[relatedListName + '_flag'] = true;
            this.member[relatedListName] = '';

            setTimeout(() => {
                this.member[relatedListName] = 'y';
            }, 0);

        }

        //Confirm has been closed
        //result is true if OK was clicked
        //and false if cancel was clicked
    }
}