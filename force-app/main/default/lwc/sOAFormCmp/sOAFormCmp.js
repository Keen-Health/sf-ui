import { api, LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';


import createAccount from '@salesforce/apex/SOAFormController.createAccount';
import createSOARecord from '@salesforce/apex/SOAFormController.createSOARecord';
import updateSOARecord from '@salesforce/apex/SOAFormController.updateSOARec';
import deleteSOAFormRecord from '@salesforce/apex/SOAFormController.deleteSOAFormRec';
import getMatchedAccounts from '@salesforce/apex/SOAFormController.matchedAccounts';
import savePDFToSF from '@salesforce/apex/SOAFormController.savePDFToSF';

import fetchSOAForminputData from '@salesforce/apex/SOAFormPDFController.fetchSOAForminputData';




import getAccountInfo from '@salesforce/apex/GenerateQuoteController.getKeenMembersData';
import getAgentData from '@salesforce/apex/GenerateQuoteController.getAgentData';
import getPickListValues from '@salesforce/apex/PickListController.getPickListValues';
// import sendPDFData from '@salesforce/apex/SOAFormPDFController.sendPDFData';
// import jspdf from '@salesforce/resourceUrl/jspdf';


export default class SOAFormCmp extends NavigationMixin(LightningElement) {


    // recordId = '0018B00000JcXjUQAV';
    @api recordId;
    @api soaRecordID;
    existingSOARecord = false;
    fromHomePage = true;
    agentInfo;
    memberInfo;
    stateList = [];
    carrierList = [];
    isDupModal = false;
    showOtherInputBox = false;
    dupModaldata;
    soaMaxDate;
    userSelectedDupID;
    disableAssociateSOABtn = true;
    agentSignRequired = false;
    isAgentSignatureDisabled = true;
    isLoading = false;
    formatedDate = "";
    dupColumns = [
        {
            label: 'Name', fieldName: 'nameUrl', type: 'url',
            typeAttributes: { label: { fieldName: 'Full_Name__c' }, target: '_blank' }
        },

        { label: 'Phone', fieldName: 'Phone', type: 'Phone' },
        { label: 'Email', fieldName: 'PersonEmail', type: 'email' },
    ];


    @track inputFieldData = {
        "typeOfProducts": [],
        "memberSignature": "",
        "agentSignatureURL": "",
        "agentName": "",
        "agentPhone": "",
        "beneficiaryFirstName": "",
        "beneficiaryLastName": "",
        "beneficiaryPhone": "",
        "date": this.formatedDate,
        "explanation": "",
        "streetAddress": "", 
        "addressLineTwo": "",
        "city": "",
        "zipCode": "",
        "county": "",
        "state": "",
        "intialMethodOfContact": "",
        "intialMethodOfContactOther": "", 
        "agentSignatureStatus": false,
        "plansByAgent": "all_carriers",
        "carrierListItems": [],
        "dateOfAppointment": "",
        "signaturesStatus":"None"

    };


    productType = [];
    memberSignCaptured = false;
    agentSignCaptured = false;
    jsPdfInitialized = false;
    showPlanList = false;

    toastMesssages = {
        'newAccount' : "Successfully created member record for " +
        this.inputFieldData['beneficiaryFirstName'] + " " + this.inputFieldData['beneficiaryLastName'] +
        " and associated the SOA", 
        'existingAccount' : "Successfully added SOA to " +
        this.inputFieldData['beneficiaryFirstName'] + " " + this.inputFieldData['beneficiaryLastName'] +
        " and associated the SOA"
    };


    @wire(getAgentData)
    wiredAgentData({ error, data }) {
        const future = new Date();
        future.setDate(future.getDate() + 30);
        this.soaMaxDate = future.getFullYear() + '-' + (future.getMonth() + 1) + '-' + future.getDate();
        console.log("AgentInfo--->" + JSON.stringify(data));
        console.log("recordId--->" + this.recordId);
        if (this.validVariable(data)) {
            const info = data[0];
            this.inputFieldData['agentName'] = info['Name'];
            this.inputFieldData['agentPhone'] = info['Phone'];
        }

    };


    @wire(getPickListValues, { objectName: 'Account', selectedField: 'Carrier_list__c' })
    wiredCarrierList({ error, data }) {
        console.log("Carrier_list__c--->" + JSON.stringify(data));
        if (this.validVariable(data)) {
            this.carrierList = data;
        }
    };

    @wire(getPickListValues, { objectName: 'Account', selectedField: 'StatePicklist__c' })
    wiredStateList({ error, data }) {
        // console.log("StatePicklist__c--->" + JSON.stringify(data));
        if (this.validVariable(data)) {
            this.stateList = data;
        }
    };

    validVariable(variable) {
        if (variable === null || variable === "" || variable === undefined ||  variable === "undefined") {
            return false;
        }
        return true;
    }


    connectedCallback(){
        console.log("this.recordId " +  this.recordId);
        console.log("this.soaRecordID" + this.soaRecordID);

        this.existingSOARecord = this.validVariable(this.soaRecordID);

        this.fromHomePage = !this.validVariable(this.recordId) ? true : false;
        console.log("this.fromHomePage --->>" +this.fromHomePage );
        if(!this.fromHomePage){
            getAccountInfo({ accountId: this.recordId }).then(memberData => {
                            if (memberData != undefined) {
                                let keenMemberAccData = JSON.parse(JSON.stringify(memberData.keenMemberAccountMap));
                                for (var key in keenMemberAccData) {
                                    this.memberInfo = keenMemberAccData[key];
                                }
                                console.log("Member Info--->" + JSON.stringify(this.memberInfo))
                                this.setDataToLocalObj();
                            };
                        });
            
        }else if(this.existingSOARecord){
             console.log("=======> Pending Fetch Record Data <=======")
        }
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

    updateDateField(){
        const todaysDate = new Date();
        this.formatedDate = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate ();
        this.inputFieldData['date'] = this.formatedDate;
    }
 
    validVariable(variable) {
        if (variable === null || variable === "" || variable === undefined) {
            return false
        }
        return true
    }


    onCancel() {
        this.fromHomePage ? this.goToHomePage() : this.goToMemberPage();
    }

    onDelete() {
        if(this.validVariable(this.soaRecordID)){
            deleteSOAFormRecord({soaFormId : this.soaRecordID }).then((response) => {
                console.log("--->deleteSOAFormRecord Success ::" + JSON.stringify(response));
                this.soaRecordID = "";
            }).catch((error) => {
                console.error("--->deleteSOAFormRecord Error ::" + JSON.stringify(error));
            });
        }
 
    }

    onSave(){
        const formJson = this.soaFormJSON();
        this.existingSOARecord = this.validVariable(this.soaRecordID);
        if(this.existingSOARecord){
            updateSOARecord({soaRecordId: this.soaRecordID, inputJson: JSON.stringify(formJson) }).then((response) => {
                console.log("--->OnSAVE Update Success :: " + JSON.stringify(response));
            }).catch((error) => {
                console.error("--->OnSAVE Update Error :: " + JSON.stringify(error)); 
            });
        }else{
            createSOARecord({inputJson : JSON.stringify(formJson)}).then((responseSOAId) =>{
                console.log("---> OnSAVE Create Success ::"  + responseSOAId);
            }).catch((err)=>{
                console.error("---> OnSAVE Create Error ::"  + JSON.stringify(err));
            });
        };

    }

    goToHomePage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home'
            },
        });
    };

    goToMemberPage() {
        console.log("goToMemberPage--->" );
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId:  this.recordId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        }).then(() => {
            this.isLoading = false;
        }).catch((err) => {
            console.error("---->goToMemberPage Error: " + JSON.stringify(err));
        })
    }


    setDataToLocalObj() {
        const data = this.memberInfo;
        this.inputFieldData['beneficiaryFirstName'] = data['FirstName'];
        this.inputFieldData['beneficiaryLastName'] = data['LastName'];
        this.inputFieldData['beneficiaryPhone'] = data['Phone'];
        this.inputFieldData['streetAddress'] = data['PersonMailingStreet'];
        this.inputFieldData['city'] = data['PersonMailingCity'];
        this.inputFieldData['zipCode'] = data['PersonMailingPostalCode'];
        this.inputFieldData['county'] = data['County__c'];
        this.inputFieldData['primaryPhone'] = data['PrimaryContactFieldName__c'] ? data['PrimaryContactFieldName__c'] : "PersonHomePhone";

    };

    handleAgentValueChange(event) {
        this.inputFieldData['agentSignatureStatus'] = event.detail;
    };

    clearSignature() {
        const objChild1 = this.template.querySelector('c-signature-Panel');
        objChild1.handleClear();
    };


    handleChange(e) {
        this.inputFieldData[e.target.name] = e.target.value;

    };

    handleIntialMethodOfContact(event) {
        console.log("handleIntialMethodOfContact" + event.target.value + ">>>" + event.target.name)
        const value = event.target.value;
        this.showOtherInputBox = value === 'other' ? true : false;
        this.inputFieldData[event.target.name] = event.target.value;
    }

    handlePlansInputChange(event) {
        const value = event.target.value;
        this.showPlanList = value === 'all_carriers' ? false : true;
        this.inputFieldData[event.target.name] = event.target.value;
    };

    handleMemberSignature(event) {
        const value = event.target.value;
        if(value != ""){
            this.inputFieldData['memberSignature'] = value;
            this.isAgentSignatureDisabled = false;
            this.updateDateField();
        }else{
            this.isAgentSignatureDisabled = true;
            this.inputFieldData['agentSignatureStatus'] = false;
            this.inputFieldData['agentSignatureURL'] = false;
            this.formatedDate = "";
            this.inputFieldData['date'] = "";
        }
    }

    handleCheckValidation() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.fieldvalidate');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });

        if (!this.inputFieldData['agentSignatureStatus']) {
            // this.clearSignature();
            this.agentSignRequired = true;
        } else {
            this.agentSignRequired = false;
        }



        return isValid && this.inputFieldData['agentSignatureStatus'];
    };

    onSelectDupRow(e) {
        console.log("DUP evnt -->" + JSON.stringify(e));
        const selectedRows = e.detail.selectedRows
        if (selectedRows) {
            this.userSelectedDupID = selectedRows[0].Id;
            this.disableAssociateSOABtn = false;
            console.log("ID's:::" + this.userSelectedDupID)
        }

    }

    getAgentSignature(){
        if(this.inputFieldData['agentSignatureStatus']){
            const objChild1 = this.template.querySelector('c-signature-Panel');
            this.inputFieldData['agentSignatureURL'] = objChild1.getImageURL();
        }

        console.log("getAgentSignature" + this.inputFieldData['agentSignatureURL']);

    }

    submitDetails() {
        console.log("----------> ONSUBMIT <------------");
        console.log("FromHomePage--->" + this.fromHomePage);

        const isValid = this.handleCheckValidation();
        
        if (isValid && this.fromHomePage) {
            this.getAgentSignature();
            this.isLoading = true;
            getMatchedAccounts({
                firstName: this.inputFieldData['beneficiaryFirstName'],
                lastName: this.inputFieldData['beneficiaryLastName'],
            }).then((matchedAccountList) => {
                console.log("^^^^MatchedAccountList Success:" + JSON.stringify(matchedAccountList));
                if (matchedAccountList.length == 0) {
                    this.createMemberAccount();
                } else {
                    this.showDuplicateAccModal(matchedAccountList);
                }
            }).catch(err => {
                console.error("^^^^MatchedAccountList Error:" + JSON.stringify(err));
            })
        } else if (isValid && !this.fromHomePage) {
            this.getAgentSignature();
            console.log("^^^^Existing Account^^^^");
            this.isLoading = true;
            this.existingSOARecord ? this.saveAndGeneratePDF() : this.createAndGeneratePDF();
            // this.generatePDF(this.recordId, msg);
        }
        else {
            window.alert("Validation Failed!!!");
            console.log("$$$$$ Validation Failed $$$$$");
            this.showErrorToast('Please fill out all required fields to submit.');
        };

    };

    updateSignaturesStatus(){
        this.inputFieldData['signaturesStatus'] = this.inputFieldData['memberSignature'] != "" ? "Member Only" : "None";
        this.inputFieldData['signaturesStatus'] = this.inputFieldData['memberSignature'] != "" 
                                                 && this.inputFieldData['agentSignatureStatus']? "Both" : "None"; 
    }


    soaFormJSON(){
        this.getAgentSignature();
        this.updateSignaturesStatus();
        
        console.log("%%%%%inputFieldData%%%%%      " + JSON.stringify(this.inputFieldData));

        const sfJson = {
            "Keen_leads_and_members__c": this.recordId,
            "Initial_method_of_contact__c": this.inputFieldData['intialMethodOfContact'], 
            "Initial_method_of_contact_Other__c": this.inputFieldData['intialMethodOfContactOther'],
            "Plan_s_the_agent_represented__c": this.inputFieldData['plansByAgent'],
            "Type_of_product_s__c": this.inputFieldData['typeOfProducts'].join(';'),
            "Carrier_List_Items__c": this.inputFieldData['carrierListItems'].join(';'),
            "State__c": this.inputFieldData['state'],
            "City__c": this.inputFieldData['city'],
            "County__c": this.inputFieldData['county'],
            "Street_address__c": this.inputFieldData['streetAddress'],
            "Address_line_2__c": this.inputFieldData['addressLineTwo'],
            "ZIP_code__c": this.inputFieldData['zipCode'],
            "Name": this.inputFieldData['agentName'],
            "Agent_phone__c": this.inputFieldData['agentPhone'],
            "Agent_s_signature__c": this.inputFieldData['agentSignatureURL'],
            "Signatures_Status__c": this.inputFieldData['signaturesStatus'],
            "Beneficiary_first_name__c": this.inputFieldData['beneficiaryFirstName'],
            "Beneficiary_last_name__c": this.inputFieldData['beneficiaryLastName'],
            "Beneficiary_phone__c": this.inputFieldData['beneficiaryPhone'],
            "Member_s_signature__c": this.inputFieldData['memberSignature'],
            "why_SOA_was_not_documented__c": this.inputFieldData['explanation'],
            "Date__c" : this.validVariable(this.inputFieldData['date'])? this.getFormattedDate(this.inputFieldData['date']) : null , 
            "Date_of_appointment_completed__c": this.validVariable(this.inputFieldData['dateOfAppointment']) ?
                                                this.getFormattedDate(this.inputFieldData['dateOfAppointment']) : null ,
            "Completed_Date__c": '01/01/1900'
        }
        console.log("****** sfJson *******"+ JSON.stringify(sfJson)); 
        return sfJson;
    }

    createAndGeneratePDF(){
        const formJson = this.soaFormJSON();
        createSOARecord({inputJson : JSON.stringify(formJson)}).then((responseSOAId) =>{
          this.soaRecordID = responseSOAId;
          console.log("--->>> Newly Generated SOA Record ID::: " + responseSOAId);
          this.generatePDF();
        }).catch((err) =>{
            console.log("createSOARecord Error "+ JSON.stringify(err))
        });
    };

    saveAndGeneratePDF(){
        const formJson = this.soaFormJSON();
        updateSOARecord({soaRecordId: this.soaRecordID, inputJson: JSON.stringify(formJson) }).then((response) => {
            console.log("--->updateSOAFormRecord Success :: " + JSON.stringify(response));
            this.generatePDF();
        }).catch((error) => {
            console.error("--->updateSOAFormRecord Error :: " + JSON.stringify(error)); 
        });
    }

    generatePDF() {
        fetchSOAForminputData({soaRecordId : this.soaRecordID}).then(res =>{
            console.log("--->fetchSOAForminputData Success:: " + JSON.stringify(res));
            const id = this.recordId;
            savePDFToSF({ accoundId: id }).then((data) => {
                console.log("---->>>savePDFToSF Success::  " + id);
                const msg = this.fromHomePage ? this.toastMesssages['newAccount'] : this.toastMesssages['existingAccount'];
                this.showSuccessToast(msg);
                this.isLoading = false;
                // this.goToMemberPage();
     
            }).catch(error => { 
                console.error("---> savePDFToSF Error-->" + JSON.stringify(error)) 
    
                // const msg = this.fromHomePage ? this.toastMesssages['newAccount'] : this.toastMesssages['existingAccount'];
    
                // this.showSuccessToast(msg);
                // this.goToMemberPage();
                
            });
            // setTimeout(()=>{ this.generatePDF();}, 3000);
          }).catch(err =>{console.error("fetchSOAForminputData Error: " + JSON.stringify(err))});

        // );
    }


    showDuplicateAccModal(accountList) {
        this.isLoading = false;
        this.isDupModal = true;
        let duplicateData = JSON.parse(JSON.stringify(accountList));
        duplicateData.forEach(item => {
            item['nameUrl'] = '/lightning/r/Account/' + item['Id'] + '/view';
            this.dupModaldata = duplicateData;
        });
    };

    createMemberAccount() {
        const jSONstr = {
            "beneficiaryFirstName": this.inputFieldData['beneficiaryFirstName'],
            "beneficiaryLastName": this.inputFieldData['beneficiaryLastName'],
            "beneficiaryPhone": this.inputFieldData['beneficiaryPhone'],
            "personMailingCity": this.inputFieldData['city'],
            "personMailingState": "Texas",
            "personMailingStreet": this.inputFieldData['streetAddress'],
            "personalMailingCounty": this.inputFieldData['county'],
            "personMailingPostalCode": this.inputFieldData['zipCode'],
            "PrimaryContactFieldName__c": this.inputFieldData['primaryPhone']
        };

        createAccount({ jSONstr: JSON.stringify(jSONstr) })
            .then(response => {
                const id = response;
                this.recordId = id;

                console.log("--->Member Account Created successfully---" + JSON.stringify(response));

                
                this.createAndGeneratePDF();
                // this.generatePDF(id, msg);

            })
            .catch(err => {
                this.isLoading = false;
                this.showErrorToast('Failed to create account!');
                console.error("--->Member Account Created Failed---" + JSON.stringify(err));
            });
    }

    generateNewLead() {
        this.isDupModal = false;
        this.isLoading = true;
        this.createMemberAccount();
    }

    associateSOA() {
        this.isDupModal = false;
  
        this.recordId =  this.userSelectedDupID;
        console.log("AssociateSOA--->" + this.userSelectedDupID + ":::::" +  this.recordId);
        this.isLoading = true;
        // const msg = "Successfully added SOA to " +
        //     this.inputFieldData['beneficiaryFirstName'] + " " + this.inputFieldData['beneficiaryLastName'] +
        //     " and associated the SOA";
        this.createAndGeneratePDF();
    }

    closeDupModal() {
        this.isDupModal = false;
    }



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
        console.log("in the function" + message);
        // const evt = new ShowToastEvent({
        //     title: 'Error!',
        //     message: message,
        //     variant: 'error',
        //     mode: 'dismissable'
        // });

        sforce.one.showToast({
            "title": "Error!",
            "message": "Welcome to salesforce code crack.",
            "type": "error"
        });
        // this.dispatchEvent(evt);
    };


    get productTypeOptions() {
        return [
            { label: 'Stand-alone Medicare Prescription Drug Plans (Part D)', value: 'stand_alone_medicare_partd' },
            { label: 'Medicare Advantage Plans (Part C) and Cost Plans', value: 'medicare_adv_partc' },
            { label: 'Dental/Vision/Hearing Products', value: 'dental_vision_hearing_prd' },
            { label: 'Hospital Indemnity Products', value: 'hsptl_indem' },
            { label: 'Medicare Supplement (Medigap) Products', value: 'medicare_supple_prd' }
        ];
    }

    get methodOfContactOptions() {
        return [
            { label: 'Email', value: 'email' },
            { label: 'In person', value: 'in_person' },
            { label: 'Inbound call', value: 'inbound_call' },
            { label: 'Text', value: 'text' },
            { label: 'Walk-in', value: 'walk_in' },
            { label: 'Warm transfer', value: 'warm_transfer' },
            { label: 'Other', value: 'other' }
        ];
    }

    get plansByAgent() {
        return [
            { label: 'All carriers', value: 'all_carriers' },
            { label: 'Choose from the list of carriers', value: 'list_of_carriers' },
        ];
    }

    get carrierListOptions() {
        var renderList = [];
        for (let i = 0; i < this.carrierList.length; i++) {
            const newItem = this.carrierList[i].toLowerCase();
            const val = newItem.replace(/[- )(\/]/g, '_');
            const obj = {}
            obj['label'] = this.carrierList[i];
            obj['value'] = val;
            renderList.push(obj);
        }
        return renderList;
    }

    get stateInputOptions() {
        var renderList = [];
        for (let i = 0; i < this.stateList.length; i++) {
            const newItem = this.stateList[i];
            const obj = {}
            obj['label'] = newItem
            obj['value'] = newItem;
            renderList.push(obj);
        }

        return renderList;
    }





    // generatePDF() {
    //     try {
    //         const element = this.template.querySelector('.main-container').innerHTML;
    //         // console.log("element" + element)
    //         // // doc.save("a4.pdf");
    //         // const { ; } = window.jspdf;
    //         // var doc = new jspdf();
    //         // // doc.setFont('Helvetica', 'Italic')
    //         // //                     .setFontSize(12)

    //         // // doc.text("Hello SalesforceCodex!", 10, 10);
    //         // doc.html(element, {
    //         //     callback : function(doc){
    //         //        doc.save('html.pdf');
    //         //     },
    //         //     margin : [10, 10, 10, 10],
    //         //     autoPaging : 'text',
    //         //     x:0,
    //         //     y:0,
    //         //     width: 190, 
    //         //     windowWidth: 675
    //         // })
    //         console.log("mtl-------------->>")



    //         // var blob = doc.output('blob');
    //         // var formData = new FormData();
    //         // formData.append('pdf', blob);

    //         // console.log(formData)


    //     }
    //     catch (error) {
    //         alert("Error " + error);
    //     }
    // }





}