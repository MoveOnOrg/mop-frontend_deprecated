# Testing Actions By Dividing Users into Cohorts

## Purpose
If you are creating a test to decide whether a change to the petition experience should be changed, and want to show random users the changed version (or the control), you can use cohorts.

Code points:
[testFn](https://github.com/MoveOnOrg/mop-frontend/blob/main/src/containers/routes.js#L100)

## Past Tests

We created a test to decide whether adding a mobile field and opt in box to an SMS service would decrease the amount of signatures on a petition. If AB_TEST_ENABLED=10, a user who visited any petition would be randomly redirected to either cohort=1 or cohort=2. Cohort=1 set another property within the SignPetition container which would then display the mobile field. When the test was enabled, form starts and form finishes were tracked by using the [FormTracker](https://github.com/MoveOnOrg/mop-frontend/blob/main/src/lib/form-tracker.js) class which uses the Segment API which are synced to and compared in the data warehouse.
