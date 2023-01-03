import { LightningElement, api, wire, track } from 'lwc';
import { getRelatedListCount, getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getMemberPlans from '@salesforce/apex/AccountRelatedListController.getMemberPlans';
import getCareGivers from '@salesforce/apex/AccountRelatedListController.getCaregiver';
import getMemberPractice from '@salesforce/apex/AccountRelatedListController.getMemberPractice';
import getMemberMedication from '@salesforce/apex/AccountRelatedListController.getMemberMedication';
import getMemberHospital from '@salesforce/apex/AccountRelatedListController.getMemberHospital';
import getMemberCampaign from '@salesforce/apex/AccountRelatedListController.getMemberCampaign';
import getMemberPhysician from '@salesforce/apex/AccountRelatedListController.getMemberPhysician';
import getOutboundReferralPractice from '@salesforce/apex/AccountRelatedListController.getOutboundReferralPractice';
import getOutboundReferralOrg from '@salesforce/apex/AccountRelatedListController.getOutboundReferralOrg';
import getMembersEvent from '@salesforce/apex/AccountRelatedListController.getMembersEvent';
import getMembersPharmacies from '@salesforce/apex/AccountRelatedListController.getMembersPharmacies';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import { NavigationMixin } from 'lightning/navigation';

export default class CaptureFullMemberDetail extends NavigationMixin(LightningElement) {
    @api recordId;
    error;
    plansCount;
    @track memberPlans;
    showCreatePlan;
    showCareGiver;
    showMemberPractice;
    showMemberMedication;
    showMemberHospital;
    showMemberCampaign;
    showMemberPhysician;
    showOutboundReferralPractice;
    showOutboundReferralOrg;
    showMembersEvent;
    showPharmacy;
    recordLst;
    physicianRecordList;
    medicationsRecordList;
    pharmacyRecordList;
    records;
    empty;
    subscription = {};
    @api channelNamePlans = '/event/newRelatedListRecordCreated__e';
    connectedCallback() {



        this.registerErrorListener();
        this.handleSubscribe();

    }

    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const thisReference = this;
        const messageCallback = function (response) {
            var obj = JSON.parse(JSON.stringify(response));
            thisReference.refreshComponent(null);
            // Response contains the payload of the new message received
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(thisReference.channelNamePlans, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            thisReference.subscription = response;
        });
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError(error => {

            // Error contains the server-side error
        });
    }

    /*Member Plan Section */
    memberPlanColumns = [

        {
            label: 'Name',
            fieldName: 'recordUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'planDetailListName'
                },
                target: '_blank'
            }
        },

        {
            label: 'Carrier Name',
            fieldName: 'carrierName'
        },
        {
            label: 'Enrolled by Keen Status',
            fieldName: 'enrolledByKeenStatus'
        },
        {
            label: 'Effective Date',
            fieldName: 'effectiveDate'
        }
    ];

    memberPlanFieldList = ["KeenMember__c", "PlanDetailList__c", "Enrolled_by_Keen__c", "Carrier_member_ID__c", "HRA_completed__c", "HRA_completed_date__c", "Effective_date__c", "Enrollment_confirmation_number__c", "Plan_end_date__c"]


    /*Caregiver Section */
    caregiverColumns = [

        {
            label: 'Name',
            fieldName: 'recordUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'cargiverContactName'
                },
                target: '_blank'
            }
        },
        {
            label: 'Phone',
            fieldName: 'phone'
        },
        {
            label: 'Relationship',
            fieldName: 'careGiverRelationship'
        }
    ];
    careGiverFieldList = ["Keen_member__c", "Caregiver__c"];

    /*Member Practice Section */
    memberColumns = [
        {
            label: 'Name',
            fieldName: 'recordUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'PracticeName'
                },
                target: '_blank'
            }
        },
        {
            label: 'Phone',
            fieldName: 'phone'
        },
        {
            label: 'Aledade Practice Type',
            fieldName: 'aledadePracticeType'
        },
        {
            label: 'City',
            fieldName: 'city'
        },
        {
            label: 'State',
            fieldName: 'State'
        }
    ];

    memberPracticeFieldList = ["Account__c", "Practice_directory__c"];

    /*Member Medication Section */
    memberMedicationColumns = [
        {
            label: 'Name',
            fieldName: 'recordUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'name'
                },
                target: '_blank'
            }
        },
   
        { label: 'Strength', fieldName: 'strength', type: 'text' },
        { label: 'Packaging', fieldName: 'packaging', type: 'text' },
        { label: 'Refill quantity', fieldName: 'refillQuantity', type: 'text' },
        { label: 'Refill frequency', fieldName: 'refillFrequency', type: 'text' }
     
    ];
    memberMedicationFieldLst = ["KeenMember__c", "Medication__c"];

    /*Member Hospital Section */
    memberHospitalColumns = [

        {
            label: 'Name',
            fieldName: 'recordUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'HospitalName'
                },
                target: '_blank'
            }
        },

        {
            label: 'Hospital Phone',
            fieldName: 'HospitalPhone'
        },
        {
            label: 'City',
            fieldName: 'City'
        },
        {
            label: 'State',
            fieldName: 'State'
        }
    ];
    memberHospitalFieldLst = ["Account__c", "Hospital_directory__c"];

    /*Member Campaign Section */
    memberCampaignColumns = [

        {
            label: 'Campaign Name',
            fieldName: 'recordUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'name'
                },
                target: '_blank'
            }
        },
        {
            label: 'Start Date',
            fieldName: 'Startdate'
        },
        {
            label: 'Type',
            fieldName: 'type'
        }
    ];
    memberCampaignFieldLst = ["Keen_leads_and_members__c", "Keen_campaign__c"];

    /*Member Physician Section */
    memberPhysicianColumns = [
        {
            label: 'Members Physcian Name',
            fieldName: 'recordUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'name'
                },
                target: '_blank'
            }
        },
        {
            label: 'Is Primary',
            fieldName: 'isPrimary',
            type: 'boolean'
        },
        {
            label: 'Specialty',
            fieldName: 'specialty'
        },
        {
            label: 'Phone',
            fieldName: 'phone'
        },
        {
            label: 'City',
            fieldName: 'city'
        },
        {
            label: 'State',
            fieldName: 'state'
        },
        {
            label: 'Zipcode',
            fieldName: 'zipcode'
        }
    ];
    memberPhysicianFieldLst = ["Keen_leads_and_members__c", "Physician_directory__c"];

    memberOutboundReferralPracticeColumns = [

        {
            label: 'Practice Directory',
            fieldName: 'recordUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'name'
                },
                target: '_blank'
            }
        },

        {
            label: 'City',
            fieldName: 'city'
        }
    ];
    memberOutboundReferralPracticeFields = ["Keen_leads_and_members__c", "Practice_directory__c"];

    memberOutboundReferralOrgColumns = [

        {
            label: 'Org. Name',
            fieldName: 'recordUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'name'
                },
                target: '_blank'
            }
        },

        {
            label: 'City',
            fieldName: 'city'
        }
    ];
    memberOutboundReferralOrgFields = ["Keen_leads_and_members__c", "Community_and_senior_organization__c"];


    /*Member Plan Section */
    memberEventColumns = [

        {
            label: 'Name',
            fieldName: 'recordUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'name'
                },
                target: '_blank'
            }
        },

        {
            label: 'Event Name',
            fieldName: 'name'
        },
        {
            label: 'City',
            fieldName: 'city'
        },
        {
            label: 'Start Date',
            fieldName: 'startDate'
        }
    ];

    memberEventFieldList = ["Account__c", "Keen_Event__c"];

    /*Member Pharmacy Section */
    memberPharmacyColumns = [
        {
            label: 'Name',
            fieldName: 'recordUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'name'
                },
                target: '_blank'
            }
        },
        {
            label: 'City',
            fieldName: 'city'
        },
        {
            label: 'Phone',
            fieldName: 'phone'
        },
        {
            label: 'Is Primary?',
            fieldName: 'isPrimary'
        }
    ];

    memberPharmacyFieldList = ["Keen_leads_and_members__c", "Pharmacy_directory__c", "Is_Pharmacy_Primary__c	"];

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'MemberPlanDetail__r',
        field: ['MemberPlanDetail__c.PlanDetailList__r.CarrierName__c']
    }) listInfo9({ error, data }) {
        if (data) {

            this.records = data.records;
            if (data.records.length === 0)
                this.empty = true;


            this.error = undefined;
        } else if (error) {

            this.error = error;

            this.records = undefined;
        }
    }

    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'MemberPlanDetail__r'
    }) listInfo1({ error, data }) {
        if (data) {
            this.plansCount = 'Plans (' + data.count + ')';
            this.template.querySelector('[data-id="plans"]').label = 'Plans (' + data.count + ')';

            this.error = undefined;
        } else if (error) {

            this.error = error;
            this.plansCount = undefined;
        }
    }

    careGiverCount;
    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'CaregiverContact__r'
    }) listInfo2({ error, data }) {
        if (data) {
            this.careGiverCount = 'CareGivers (' + data.count + ')';
            this.template.querySelector('[data-id="caregiver"]').label = 'CareGivers (' + data.count + ')';

            this.error = undefined;
        } else if (error) {

            this.error = error;
            this.careGiverCount = undefined;
        }
    }

    practices;
    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'List_of_practices_for_member__r'
    }) listInfo3({ error, data }) {
        if (data) {
            this.practices = 'Practices (' + data.count + ')';
            this.template.querySelector('[data-id="practices"]').label = 'Practices (' + data.count + ')';

            this.error = undefined;
        } else if (error) {

            this.error = error;
            this.practices = undefined;
        }
    }

    medications;
    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'MemberMedications__r'
    }) listInfo4({ error, data }) {
        if (data) {
            this.medications = 'Medications (' + data.count + ')';
            this.template.querySelector('[data-id="medications"]').label = 'Medications (' + data.count + ')';

            this.error = undefined;
        } else if (error) {

            this.error = error;
            this.medications = undefined;
        }
    }


    hospitals;
    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'Member_s_hospitals__r'
    }) listInfo5({ error, data }) {
        if (data) {
            this.hospitals = 'Hospitals (' + data.count + ')';
            this.template.querySelector('[data-id="hospitals"]').label = 'Hospitals (' + data.count + ')';

            this.error = undefined;
        } else if (error) {

            this.error = error;
            this.hospitals = undefined;
        }
    }

    campaigns;
    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'Member_campaigns__r'
    }) listInfo6({ error, data }) {
        if (data) {
            this.campaigns = 'Campaigns (' + data.count + ')';
            this.template.querySelector('[data-id="campaigns"]').label = 'Campaigns (' + data.count + ')';

            this.error = undefined;
        } else if (error) {

            this.error = error;
            this.campaigns = undefined;
        }
    }

    physicians;
    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'Member_s_physicians__r'
    }) listInfo7({ error, data }) {
        if (data) {
            this.physicians = 'Physicians (' + data.count + ')';
            this.template.querySelector('[data-id="physicians"]').label = 'Physicians (' + data.count + ')';

            this.error = undefined;
        } else if (error) {

            this.error = error;
            this.physicians = undefined;
        }
    }


    outboundReferrals;
    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'Outbound_Referral_Practices__r'
    }) listInfo22({ error, data }) {
        if (data) {
            this.outboundReferrals = 'Outbound Referrals Practice (' + data.count + ')';
            this.template.querySelector('[data-id="outboundReferralsPrac"]').label = 'Outbound Referrals Practice (' + data.count + ')';

            this.error = undefined;
        } else if (error) {

            this.error = error;
            this.outboundReferrals = undefined;
        }
    }

    outboundReferralsOrg;
    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'Outbound_Referral_Organizations__r'
    }) listInfo23({ error, data }) {
        if (data) {
            this.outboundReferralsOrg = 'Outbound Referrals Organization (' + data.count + ')';
            this.template.querySelector('[data-id="outboundReferralsOrg"]').label = 'Outbound Referrals Organization (' + data.count + ')';

            this.error = undefined;
        } else if (error) {

            this.error = error;
            this.outboundReferralsOrg = undefined;
        }
    }

    MemberEventCount;
    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'Members_at_event__r'
    }) listInfo25({ error, data }) {
        if (data) {
            // this.outboundReferralsOrg = 'Outbound Referrals Organization ('+data.count +')';
            // this.template.querySelector('[data-id="outboundReferralsOrg"]').label = 'Outbound Referrals Organization ('+data.count +')' ; 
            this.template.querySelector('[data-id="MemberEvents"]').label = 'Events (' + data.count + ')';

            this.error = undefined;
        } else if (error) {

            this.error = error;
            this.MemberEventCount = undefined;
        }
    }


    @wire(getRelatedListCount, {
        parentRecordId: '$recordId',
        relatedListId: 'Member_s_pharmacies__r'
    }) listInfo26({ error, data }) {
        if (data) {
            // this.outboundReferralsOrg = 'Outbound Referrals Organization ('+data.count +')';
            // this.template.querySelector('[data-id="outboundReferralsOrg"]').label = 'Outbound Referrals Organization ('+data.count +')' ; 
            this.template.querySelector('[data-id="memberPharmacy"]').label = 'Pharmacies (' + data.count + ')';

            this.error = undefined;
        } else if (error) {

            this.error = error;
            this.MemberPharmacyCount = undefined;
        }
    }






    @wire(getMemberPlans, { id: '$recordId' })
    memberPlanResult;

    handlePlanClick(event) {


        this.recordLst = this.memberPlanResult;
        this.showCreatePlan = true;

    }

    @wire(getCareGivers, { id: '$recordId' })
    careGiverResult;

    handleCareGiverClick(event) {


        this.recordLst = this.careGiverResult;
        this.showCareGiver = true;
    }
    @wire(getMemberPractice, { id: '$recordId' })
    memberPracticeResult;

    handlePracticeClick(event) {

        this.recordLst = this.memberPracticeResult;
        this.showMemberPractice = true;

    }

    @wire(getMemberMedication, { id: '$recordId' })
    memberMedicationResult;

    handleMedication(event) {
        this.medicationsRecordList = this.memberMedicationResult;
        this.showMemberMedication = true;
    }

    @wire(getMemberHospital, { id: '$recordId' })
    getMemberHospitalResult;

    handleHospital(event) {
        this.recordLst = this.getMemberHospitalResult;
        this.showMemberHospital = true;
    }


    @wire(getMemberCampaign, { id: '$recordId' })
    getMemberCampaignResult;

    handleCampaign(event) {
        this.recordLst = this.getMemberCampaignResult;
        this.showMemberCampaign = true;
    }

    @wire(getMemberPhysician, { id: '$recordId' })
    getMemberPhysicianResult;

    @wire(getOutboundReferralPractice, { id: '$recordId' })
    OutboundReferralPractice;

    @wire(getOutboundReferralOrg, { id: '$recordId' })
    OutboundReferralOrg;


    @wire(getMembersEvent, { id: '$recordId' })
    MembersEvent;

    @wire(getMembersPharmacies, { id: '$recordId' })
    memberPharmacies;

    handleMemberEvents(event) {
        this.recordLst = this.MembersEvent;
        this.showMembersEvent = true;
    }

    handlePhysician(event) {
        this.physicianRecordList = this.getMemberPhysicianResult;
        this.showMemberPhysician = true;
    }

    handleOutboundReferralPractice(event) {
        this.recordLst = this.OutboundReferralPractice;
        this.showOutboundReferralPractice = true;
    }

    handleOutboundReferralOrg(event) {
        this.recordLst = this.OutboundReferralOrg;
        this.showOutboundReferralOrg = true;
    }

    handlePharmacyClick(event) {
        this.pharmacyRecordList = this.memberPharmacies;
        this.showPharmacy = true;
    }



    closeModal(event) {
        this.showCreatePlan = false;
        this.showCareGiver = false;
        this.showMemberPractice = false;
        this.showMemberMedication = false;
        this.showMemberHospital = false;
        this.showMemberCampaign = false;
        this.showMemberPhysician = false;
        this.showOutboundReferralPractice = false
        this.showOutboundReferralOrg = false;
        this.showMembersEvent = false;
        this.showPharmacy = false;


    }

    navigateToOutBoundReferralRelatedList() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordRelationshipPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Account',
                relationshipApiName: 'Outbound_Referral_Practices__r',
                actionName: 'view'
            },
        });
    }

    refreshComponent(event) {
       // Fix for EN-1842, skipping conditional refresh and loading everytime    
        refreshApex(this.memberPharmacies)
            .then(() => {
                this.pharmacyRecordList = this.memberPharmacies;
                this.template.querySelector('[data-id="memberPharmacy"]').label = 'Pharmacies (' + this.memberPharmacies.data.length + ')';
            });

        refreshApex(this.memberMedicationResult)
            .then(() => {
                this.medicationsRecordList = this.memberMedicationResult;
                this.template.querySelector('[data-id="medications"]').label = 'Medications (' + this.memberMedicationResult.data.length + ')';
            });

        refreshApex(this.getMemberPhysicianResult)
            .then(() => {
                this.physicianRecordList = this.getMemberPhysicianResult;
                this.template.querySelector('[data-id="physicians"]').label = 'Physicians (' + this.getMemberPhysicianResult.data.length + ')';
            });
        // End of fix for EN-1842    

        if (this.showCareGiver) {
            refreshApex(this.careGiverCount);
            refreshApex(this.careGiverResult)
                .then(() => {
                    this.recordLst = this.careGiverResult;
                    this.template.querySelector('[data-id="caregiver"]').label = 'CareGivers (' + this.careGiverResult.data.length + ')';
                });
            return;
        }

        if (this.showCreatePlan) {
            refreshApex(this.memberPlanResult)
                .then(() => {
                    this.recordLst = this.memberPlanResult;
                    this.template.querySelector('[data-id="plans"]').label = 'Plans (' + this.memberPlanResult.data.length + ')';
                });
            return;
        }

        if (this.showMemberPractice) {
            refreshApex(this.memberPracticeResult)
                .then(() => {
                    this.recordLst = this.memberPracticeResult;
                    this.template.querySelector('[data-id="practices"]').label = 'Practices (' + this.memberPracticeResult.data.length + ')';
                });
            return;
        }
        
        if (this.showMemberHospital) {
            refreshApex(this.getMemberHospitalResult)
                .then(() => {
                    this.recordLst = this.getMemberHospitalResult;
                    this.template.querySelector('[data-id="hospitals"]').label = 'Hospitals (' + this.getMemberHospitalResult.data.length + ')';
                });
            return;
        }
        if (this.showMemberCampaign) {
            refreshApex(this.getMemberCampaignResult)
                .then(() => {
                    this.recordLst = this.getMemberCampaignResult;
                    this.template.querySelector('[data-id="campaigns"]').label = 'Campaigns (' + this.getMemberCampaignResult.data.length + ')';
                });
            return;
        }

        

        if (this.showOutboundReferralPractice) {
            refreshApex(this.OutboundReferralPractice)
                .then(() => {
                    this.recordLst = this.OutboundReferralPractice;
                    this.template.querySelector('[data-id="outboundReferralsPrac"]').label = 'Outbound Referrals Practice (' + this.OutboundReferralPractice.data.length + ')';
                });
            return;
        }

        if (this.showOutboundReferralOrg) {
            refreshApex(this.OutboundReferralOrg)
                .then(() => {
                    this.recordLst = this.OutboundReferralOrg;
                    this.template.querySelector('[data-id="outboundReferralsOrg"]').label = 'Outbound Referrals Organization (' + this.OutboundReferralOrg.data.length + ')';
                });
            return;
        }

        if (this.showMembersEvent) {
            refreshApex(this.MembersEvent)
                .then(() => {
                    this.recordLst = this.MembersEvent;
                    this.template.querySelector('[data-id="MemberEvents"]').label = 'Events (' + this.MembersEvent.data.length + ')';
                });
            return;
        }

        // eval("$A.get('e.force:refreshView').fire();");
    }
}