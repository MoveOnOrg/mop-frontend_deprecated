# Testing Actions By Dividing Users into Cohorts

## Purpose
If you are creating a test to decide whether a change to the petition experience should happen, and want to show random users the changed version (or the control), you can use cohorts.

Code points:
[loadCohort](https://github.com/MoveOnOrg/mop-frontend/blob/main/src/actions/sessionActions.js#L112)

## How to Use Cohorts

If `AB_TEST_ENABLED` is set to a value or `ab` is present in the query string, we can load a cohort for a user. When `AB_TEST_ENABLED` is set to a number, we can control the probability of someone entering into the experiment. We can also add `ab` directly to the query string, which will randomly assign users into cohort 1 or cohort 2. You can use users cohort information then to decide whether they will experience the treatment.

## Past Tests

### Mobile Field
We created a test to decide whether adding a mobile field and opt in box to an SMS service would decrease the amount of signatures on a petition. Cohort=1 set another property within the SignPetition container which would then display the mobile field. When the test was enabled via AB_TEST_ENABLED, form starts and form finishes were tracked by using the [FormTracker](https://github.com/MoveOnOrg/mop-frontend/blob/main/src/lib/form-tracker.js) class which uses the Segment API. Events are then synced into the data warehouse.


### WhatsApp

We created a test to decide whether we should add a WhatsApp button to the Thanks page. This included two rounds of testing `whatsAppShare1` and `whatsAppShare2`. Users apart of `cohort=1` in experiment `whatsAppShare1` saw a small link for WhatsApp sharing on desktop and mobile. Users apart of `whatsAppShare2` saw a small link for WhatsApp sharing on desktop and a larger button on mobile devices (the assumption being most WhatsApp users would be on mobile anyway). We created [CohortTracker](https://github.com/MoveOnOrg/mop-frontend/blob/main/src/lib/cohort-tracker.js) which allows us to identify which users (by signature hash or recognized user signon id) are apart of each cohort and for what petition.

### Facebook Messenger

We created a test to decide whether we should add a Messenger share button to the Thanks page on mobile devices. Users apart of `cohort=1` in experiment `messengerX` saw a larger share via messenger button. This experiment also used [CohortTracker](https://github.com/MoveOnOrg/mop-frontend/blob/main/src/lib/cohort-tracker.js) in order to tie signatures and signers to cohorts.  
