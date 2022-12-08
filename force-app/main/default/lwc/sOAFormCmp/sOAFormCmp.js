import { api, LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import createAccount from '@salesforce/apex/SOADupCheckAndCreateController.createAccount';
import getMatchedAccounts from '@salesforce/apex/SOADupCheckAndCreateController.matchedAccounts';
import savePDFToSF from '@salesforce/apex/SOAFormPDFController.savePDFToSF';
// import sendVFData from '@salesforce/apex/SOAFormPDFController.sendVFData';
import getAccountInfo from '@salesforce/apex/GenerateQuoteController.getKeenMembersData';
import getAgentData from '@salesforce/apex/GenerateQuoteController.getAgentData';
import getPickListValues from '@salesforce/apex/PickListController.getPickListValues';
// import sendPDFData from '@salesforce/apex/SOAFormPDFController.sendPDFData';
// import jspdf from '@salesforce/resourceUrl/jspdf';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class SOAFormCmp extends NavigationMixin(LightningElement) {

    @api recordId;
    @api fromHomePage;
    agentInfo;
    memberInfo;
    // @api carrierList;
    // @api stateList;
    stateList = [];
    carrierList = [];
    isDupModal = false;
    dupModaldata;
    soaMaxDate;
    userSelectedDupID;
    disableAssociateSOABtn = true;
    dupColumns = [
        {
            label: 'Name', fieldName: 'nameUrl', type: 'url',
            typeAttributes: { label: { fieldName: 'Full_Name__c' }, target: '_blank' }
        },
        { label: 'DoB', fieldName: 'DoB__c', type: 'Date' },
        { label: 'Phone', fieldName: 'Phone', type: 'Phone' },
    ];
    isLoading = false;
    todaysDate = new Date();
    formatedDate = this.todaysDate.getFullYear() + '-' + (this.todaysDate.getMonth() + 1) + '-' + this.todaysDate.getDate();
  

    @track inputFieldData = {
        "typeOfProducts": [],
        // "memberSignature": "",
        // "agentName": "",
        // "agentPhone": "",
        // "beneficiaryFirstName": "",
        // "beneficiaryLastName": "",
        // "beneficiaryPhone": "",
        "date": this.formatedDate,
        // "streetAddress": "",
        // "addressLineTwo": "",
        // "city": "",
        // "zipCode": "",
        // "county": "",
        // "state": "",
        // "intialMethodOfContact": "",
        // "agentSignatureStatus": false,
        "plansByAgent": "all_carriers",
        "carrierListByAgent": [],
        // "dateOfAppointment": "",

    };
    // isModalOpen = false;
    productType = [];
    memberSignCaptured = false;
    agentSignCaptured = false;
    jsPdfInitialized = false;
    showPlanList = false;

    @wire(getAgentData)
    wiredAgentData({ error, data }) {
        const future = new Date();
        future.setDate(future.getDate() + 30);
        this.soaMaxDate = future.getFullYear() + '-' + (future.getMonth() + 1) + '-' + future.getDate();
        console.log("getAgentData--->" + JSON.stringify(data))
        console.log("recordId--->" + this.recordId);
        if (this.validVariable(data)) {
            this.inputFieldData['agentName'] = data['name'];
        }
        if (this.recordId != undefined) {
            getAccountInfo({ accountId: this.recordId }).then(memberData => {
                if (memberData != undefined) {
                    let keenMemberAccData = JSON.parse(JSON.stringify(memberData.keenMemberAccountMap));
                    for (var key in keenMemberAccData) {
                        this.memberInfo = keenMemberAccData[key];
                    }
                    this.setDataToLocalObj();
                    console.log("getAccountInfo--->" + JSON.stringify(this.memberInfo))
                };
            });

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
        console.log("StatePicklist__c--->" + JSON.stringify(data));
        if (this.validVariable(data)) {
            this.stateList = data;
        }
    };

    validVariable(variable) {
        if (variable === null || variable === "" || variable === undefined) {
            return false
        }
        return true
    }

    renderedCallback() {


        console.log("renderedCallback--------------------->");

        //    this.apiCalls();
        // if (this.jsPdfInitialized) {
        //     return;
        // }
        // this.jsPdfInitialized = true;
        // console.error("before latest new from PDFFFFFF");
        // Promise.all([

        //     loadScript(this, jspdf).then(() => {
        //         console.log("jsPDF loaded");
        //     }).catch(error => {
        //         console.error("Error from jsPDF");
        //         console.error("jsPDF " + error);
        //     })
        // ]);

    }

    onCancel() {
        this.fromHomePage ? this.goToHomePage() : this.goToMemberPage();
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
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Account',
                // relationshipApiName: 'CaseComments',
                actionName: 'view'
            }
        });
    }




    apiCalls() {
        getAgentData().then(agentData => {
            console.log("agentData: " + JSON.stringify(agentData));
            this.agentInfo = agentData;
            getPickListValues({ objectName: 'Account', selectedField: 'Carrier_list__c' }).then(carrierList => {
                console.log("Carrier_list__c" + JSON.stringify(carrierList) + carrierList);
                this.carrierList = carrierList;
                getPickListValues({ objectName: 'Account', selectedField: 'StatePicklist__c' }).then(stateList => {
                    this.stateList = stateList;
                    if (this.recordId != undefined) {
                        getAccountInfo({ accountId: this.recordId }).then(memberData => {
                            if (this.agentInfo != undefined) {
                                this.inputFieldData['agentName'] = this.agentInfo['name'];
                            }
                            if (!this.fromHomePage && memberData != undefined) {
                                let keenMemberAccData = JSON.parse(JSON.stringify(memberData.keenMemberAccountMap));
                                for (var key in keenMemberAccData) {
                                    this.memberInfo = keenMemberAccData[key];
                                }
                                this.setDataToLocalObj();
                                console.log("this.memberInfo in Create" + JSON.stringify(this.memberInfo))
                            }
                        })
                    } else if (this.agentInfo != undefined) {
                        this.inputFieldData['agentName'] = this.agentInfo['name'];
                    }

                })
            })
        });
    }

    setDataToLocalObj() {
        const data = this.memberInfo;
        this.inputFieldData['beneficiaryFirstName'] = data['FirstName'];
        this.inputFieldData['beneficiaryLastName'] = data['LastName'];
        this.inputFieldData['beneficiaryPhone'] = data['Phone'];
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

    handlePlansInputChange(event) {
        const value = event.target.value;
        this.showPlanList = value === 'all_carriers' ? false : true;
        this.inputFieldData[event.target.name] = event.target.value;
    };

    handleCheckValidation() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.fieldvalidate');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });

        return isValid && this.inputFieldData['agentSignatureStatus'];
    };

    onSelectDupRow(e) {
        console.log("++++ DUP evnt -->" + JSON.stringify(e));
        const selectedRows = e.detail.selectedRows
        if (selectedRows) {
            this.userSelectedDupID = selectedRows[0].Id;
            this.disableAssociateSOABtn = false;
            console.log("++++ ID:::" + this.userSelectedDupID)
        }

    }

    submitDetails() {
        console.log("---------->neww ONSUBMIT");
        // this.generatePDF(this.recordId);

        const objChild1 = this.template.querySelector('c-signature-Panel');
        this.inputFieldData['agentSignatureURL'] = JSON.stringify(objChild1.getImageURL());

        console.log("Agent Signature Link-->" + JSON.stringify(objChild1.getImageURL()));

        const isValid = this.handleCheckValidation();
        // this.fromHomePage = this.recordId == this.recordId ? true : false;
        console.log("------>" + this.fromHomePage);
        if (isValid && this.fromHomePage) {
            this.isLoading = true;
            getMatchedAccounts({
                firstName: this.inputFieldData['beneficiaryFirstName'],
                lastName: this.inputFieldData['beneficiaryLastName']
            }).then((matchedAccountList) => {

                console.log("matchedAccountList" + JSON.stringify(matchedAccountList));
                if (matchedAccountList.length == 0) {
                    this.createMemberAccount();
                } else {
                    this.showDuplicateAccModal(matchedAccountList);
                }
            })
        } else if (isValid && !this.fromHomePage) {
            console.log("----> savePDFInSF <----")

            this.generatePDF(this.recordId, msg);
        }
        else {
            this.showErrorToast('Please fill out all required fields to submit.');
        };




        console.log("inputFieldData" + JSON.stringify(this.inputFieldData));
        console.log("@api recordId;" + this.recordId);
        console.log("isValid" + typeof isValid + isValid);

        // isValid ? () => {
        //     this.isLoading = true;
        //     setTimeout(() => {
        //         this.isLoading = false;
        //         this.onCancel();
        //     }, 5000)
        // } : "";

    };

    generatePDF(id, msg) {
        console.log("generatePDF" + id);
        //    const jsonStr=  {'inputOne' : 'nameis', 'inputTwo' : 'phone number'}
        //    sendVFData().then(() => {

        savePDFToSF({ accoundId: id }).then((data) => {
            console.log("---->>> PDF SAVED--ID:" + id);
            this.showSuccessToast(msg);
            if (this.fromHomePage) {
                this.goToHomePage();
            } else {
                this.goToMemberPage();
            }
            this.isLoading = false;
        }).catch(error => { console.log("sOAFormData" + error) });

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
    }

    createMemberAccount() {
        const jSONstr = {
            "beneficiaryFirstName": this.inputFieldData['beneficiaryFirstName'],
            "beneficiaryLastName": this.inputFieldData['beneficiaryLastName'],
            "beneficiaryPhone": this.inputFieldData['beneficiaryPhone'],
            "personMailingCity": this.inputFieldData['city'],
            "personMailingState": "Texas",
            "personalMailingCounty": this.inputFieldData['county'],
            "personMailingPostalCode": this.inputFieldData['zipCode'],
            "PrimaryContactFieldName__c": this.inputFieldData['primaryPhone']
        };

        createAccount({ jSONstr: JSON.stringify(jSONstr) })
            .then(response => {
                const id = response;
                
                console.log("--->Member Account Created successfully---" + JSON.stringify(response));
                
                const msg = "Successfully created member record for " +
                this.inputFieldData['beneficiaryFirstName'] + " " + this.inputFieldData['beneficiaryLastName'] +
                " and associated the SOA";
                this.generatePDF(id,msg);
           
            })
            .catch(err => {
                this.isLoading = false;
                this.showErrorToast('Failed to create account!');
                console.log("--->Member Account Created Failed---" + JSON.stringify(err));
            });
    }

    generateNewLead() {
        this.isDupModal = false;
        this.isLoading = true;
        this.createMemberAccount();
    }

    associateSOA() {
        this.isDupModal = false;
        console.log("associateSOA---" + this.userSelectedDupID);
        this.isLoading = true;
        const msg = "Successfully added SOA to " +
        this.inputFieldData['beneficiaryFirstName'] + " " + this.inputFieldData['beneficiaryLastName'] +
        " and associated the SOA"
        this.generatePDF(this.userSelectedDupID, msg);
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
        const evt = new ShowToastEvent({
            title: 'Error!',
            message: message,
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    };


    get productTypeOptions() {
        return [
            { label: 'Stand-alone Medicare Prescription Drug Plans (Part D)', value: 'stand_alone_medicare-partd' },
            { label: 'Medicare Advantage Plans (Part C) and Cost Plans', value: 'medicare_adv_partc' },
            { label: 'Dental/Vision/Hearing Products', value: 'dental_vision_hearing_prd' },
            { label: 'Hospital Indemnity Products', value: 'hsptl_indem' },
            { label: 'Medicare Supplement (Medigap) Products', value: 'medicare_supple_prd' }
        ];
    }

    get methodOfContactOptions() {
        return [
            { label: 'Inbound call', value: 'inbound_call' },
            { label: 'In person', value: 'in_person' },
            { label: 'Email', value: 'email' },
            { label: 'Warm transfer', value: 'warm_transfer' },
            { label: 'Text', value: 'text' }
        ];
    }

    get plansByAgent() {
        return [
            { label: 'All carriers', value: 'all_carriers' },
            { label: 'List from the carriers picklist', value: 'list_from_carriers' },
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
    //         // const { jspdf } = window.jspdf;
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