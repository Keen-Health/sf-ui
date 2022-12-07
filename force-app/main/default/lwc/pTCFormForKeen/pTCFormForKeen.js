import { LightningElement,track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
//import KEEN_LOGO from '@salesforce/contentAssetUrl/unknown_content_asset';
import CUSTOMCSS from '@salesforce/resourceUrl/customcss';
import createAccount from '@salesforce/apex/PTCFormController.createAccount';
import HTML2CANVAS from '@salesforce/resourceUrl/HTML2CANVAS';
import jquery from '@salesforce/resourceUrl/jquery';

export default class PTCFormForKeen extends LightningElement {
    @track strfirstName;
    @track strlastName;
    @track strPhone;
    @track zipCode;
    @track email;
    @track bestDatetimetoCall;
    @track MedicareEligibilityDate;
    @track MedicaidEligibilityDate;
    @track signCaptured = false;
    imgsrc = '';
    
    eventId = '';
    ownerId = '';
    value = [];
    valueDays = [];
    //keenLogoUrl = KEEN_LOGO;
    isCssLoaded = false;    

    handleProgressValueChange(event) {
        this.signCaptured = event.detail;
        console.log('this.signCaptured -- '+this.signCaptured);
    }

    get options() {
        return [
            { label: 'I currently have a Medicare plan but am looking for new options', value: 'I currently have a Medicare plan but am looking for new options' },
            { label: 'I\'ll be eligible for Medicare soon (within the next year), but not yet', value: 'I\'ll be eligible for Medicare soon (within the next year), but not yet' },
            { label: 'I have insurance outside of Medicare (via work, Medicaid, ACA, etc)', value: 'I have insurance outside of Medicare (via work, Medicaid, ACA, etc)' },
            { label: 'I\'m not insured but would like to learn more about coverage', value: 'I\'m not insured but would like to learn more about coverage' },
            { label: 'I dont know but would like assistance', value: 'I dont know but would like assistance' }
        ];
    }

    get days() {
        return [
            { label: 'Monday', value: 'Monday' },
            { label: 'Tuesday', value: 'Tuesday' },
            { label: 'Wednesday', value: 'Wednesday' },
            { label: 'Thursday', value: 'Thursday' },
            { label: 'Friday', value: 'Friday' },
            { label: 'Saturday', value: 'Saturday' },
            { label: 'Sunday', value: 'Sunday' }
        ];
    }

    get selectedValues() {
        return this.value.join(',');
    }

    handleChangeforOptions(e) {
        this.value = e.detail.value;
    }

    handleChangeforDays(e) {
        this.valueDays = e.detail.value;
    }

    connectedCallback() {
        this.getUrlParameter();        
    }

    renderedCallback(){
        //this.template.querySelector("lightning-input").style.labelSize="40px";
        loadScript(this, HTML2CANVAS );
        loadScript(this, jquery );
        //
        if(this.isCssLoaded) return
        this.isCssLoaded = true;
        loadStyle(this,CUSTOMCSS).then(()=>{
            //console.log('loaded');
        })
        .catch(error=>{
            console.log('error to load');
        });
    }

    showSuccessToast() {
        const event = new ShowToastEvent({
            title: 'Record Created',
            variant: 'success',
            message:
                'The record submitted successfully & signature has been captured.',
        });
        this.dispatchEvent(event);
    }

    showErrorToast() {
        const event = new ShowToastEvent({
            title: 'Record Submission Failed',
            variant: 'error',
            message:
                'Please fill out all required fields indicated with an *.',
        });
        this.dispatchEvent(event);
    }

    showErrorSignToast() {
        const event = new ShowToastEvent({
            title: 'Record Submission Failed',
            variant: 'error',
            message:
                'Please sign.',
        });
        this.dispatchEvent(event);
    }

    getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('?'),
            sParameterName,
            i;
        
        for (i = 0; i < sURLVariables.length; i++) {            
            sParameterName = sURLVariables[i].split('=');
            this.eventId = sParameterName[1];
            this.ownerId = sParameterName[3];            
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    ChangedHandler(event){
        if(event.target.name === 'firstName'){this.strfirstName = event.target.value;}
        //else if(event.target.name === 'Checkbox'){this.checkBox = event.target.checked;}
        else if(event.target.name === 'lastName'){this.strlastName = event.target.value;}
        else if(event.target.name === 'accountPhone'){this.strPhone = event.target.value;}
        else if(event.target.name === 'ZipCode'){this.zipCode = event.target.value;}
        else if(event.target.name === 'Email'){this.email = event.target.value;}
        else if(event.target.name === 'bestDatetimetoCall'){this.bestDatetimetoCall = event.target.value;}
        else if(event.target.name === 'MedicareEligibilityDate'){this.MedicareEligibilityDate = event.target.value;}
        else if(event.target.name === 'MedicaidEligibilityDate'){this.MedicaidEligibilityDate = event.target.value;}        
    }

    handleCheckValidation() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.fieldvalidate');
        inputFields.forEach(inputField => {
            if(!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }
    
    /*printDiv() {
        this.imgsrc = '';
        console.log('aa');
        html2canvas(this.template.querySelector('.print-preview-div'),{ 
            scale: "5",
            onrendered: (canvas)=> {
                //show image
                var myCanvas = this.template.querySelector('.my_canvas_id');
                var ctx = myCanvas.getContext('2d');
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.imageSmoothingEnabled = false;
                var img = new Image;
                img.onload = function(){
                    ctx.drawImage(img,0,0,270,350); // Or at whatever offset you like
                };
                console.log('img >> ', canvas.toDataURL());
                img.src = canvas.toDataURL();
                this.imgsrc = img.src;
            }
        }).then((result) => {
            console.log('bb');
        }).catch((error) => {
            console.log('error ',error);
            console.log('cc');
        });
        
    }*/

    clearSignature(){
        const objChild1 = this.template.querySelector('c-signature-Panel');
        objChild1.handleClear();
    }

    createAccount(){
        
        if(!this.handleCheckValidation()){
            console.log('hs');
            this.showErrorToast();
        }
        else if(this.signCaptured === false){
            console.log('hs1');
            this.showErrorSignToast();
        }
        else if(this.handleCheckValidation() ) { //&& this.returnValue === false
            console.log('hs2');
            if(this.MedicareEligibilityDate !== '' && this.MedicaidEligibilityDate !== ''){
                var fields = {'AccountSource' : 'CommunityEvent','Status__c' : 'Keen Lead','Permission_to_contact__c' : true,'Event__c' : this.eventId , 'Best_Day_to_Call__c':this.valueDays.join(';'),'InsuranceStatus__c':this.value.join(';'), 'OwnerId' : this.ownerId,'FirstName' : this.strfirstName,'LastName' : this.strlastName, 'Phone' : this.strPhone, 'PersonEmail' : this.email, 'ZipCode__c' : this.zipCode, 'BestDatetimeToCall__c' : this.bestDatetimetoCall, 'MedicareEligibilityDate__c' : this.MedicareEligibilityDate, 'MediaidEligibilityDate__c' : this.MedicaidEligibilityDate};
                console.table('fields1 -- ',fields);
            }
            else if(this.MedicareEligibilityDate === '' && this.MedicaidEligibilityDate !== ''){
                var fields = {'AccountSource' : 'CommunityEvent','Status__c' : 'Keen Lead','Permission_to_contact__c' : true,'Event__c' : this.eventId , 'Best_Day_to_Call__c':this.valueDays.join(';'),'InsuranceStatus__c':this.value.join(';'), 'OwnerId' : this.ownerId,'FirstName' : this.strfirstName,'LastName' : this.strlastName, 'Phone' : this.strPhone, 'PersonEmail' : this.email, 'ZipCode__c' : this.zipCode, 'BestDatetimeToCall__c' : this.bestDatetimetoCall, 'MediaidEligibilityDate__c' : this.MedicaidEligibilityDate};
                console.table('fields2 -- ',fields);
            }
            else if(this.MedicareEligibilityDate !== '' && this.MedicaidEligibilityDate === ''){
                var fields = {'AccountSource' : 'CommunityEvent','Status__c' : 'Keen Lead','Permission_to_contact__c' : true,'Event__c' : this.eventId , 'Best_Day_to_Call__c':this.valueDays.join(';'),'InsuranceStatus__c':this.value.join(';'), 'OwnerId' : this.ownerId,'FirstName' : this.strfirstName,'LastName' : this.strlastName, 'Phone' : this.strPhone, 'PersonEmail' : this.email, 'ZipCode__c' : this.zipCode, 'BestDatetimeToCall__c' : this.bestDatetimetoCall, 'MedicareEligibilityDate__c' : this.MedicareEligibilityDate,};
                console.table('fields3 -- ',fields);
            }
            else if(this.MedicareEligibilityDate === '' && this.MedicaidEligibilityDate === ''){
                var fields = {'AccountSource' : 'CommunityEvent','Status__c' : 'Keen Lead','Permission_to_contact__c' : true,'Event__c' : this.eventId , 'Best_Day_to_Call__c':this.valueDays.join(';'),'InsuranceStatus__c':this.value.join(';'), 'OwnerId' : this.ownerId,'FirstName' : this.strfirstName,'LastName' : this.strlastName, 'Phone' : this.strPhone, 'PersonEmail' : this.email, 'ZipCode__c' : this.zipCode, 'BestDatetimeToCall__c' : this.bestDatetimetoCall};
                console.table('fields4 -- ',fields);
            }
            
            createAccount({ JSONstr: JSON.stringify(fields) })
                .then((result) => {
                    this.showSuccessToast();
                    this.strfirstName ='';
                    this.strlastName ='';
                    this.strPhone ='';
                    this.email ='';
                    this.zipCode ='';
                    this.MedicareEligibilityDate ='';
                    this.MedicaidEligibilityDate ='';
                    this.bestDatetimetoCall = null;
                    this.value = [];
                    this.valueDays = [];  
                    const objChild1 = this.template.querySelector('c-signature-Panel');
                    objChild1.handleSaveSignature(result);
                    objChild1.handleClear();
                    this.signCaptured = false;
                })
                .catch((error) => {
                    this.showErrorToast();
                });
        }
    }
}