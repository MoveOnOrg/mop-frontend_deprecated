# Testing Actions By Dividing Users into Cohorts

## Purpose
If you are creating a test to decide whether a change to the petition experience should happen, and want to show random users the changed version (or the control), you can use cohorts.

Code points:
[routeCohortSplitter code](https://github.com/MoveOnOrg/mop-frontend/blob/main/src/containers/routes.js#L100)

## How to Use Cohorts

If `AB_TEST_ENABLED` is set to a value, you could use `routeCohortSplitter(cohortQueryText)` in order to break someone who visits the petition signature page (or reloads it) into random cohorts for a mobile field test. The function was passed into a property `mobileTest` for '/sign:petitionName' route.

```
<Route path='sign/:petitionName' component={Sign} mobileTest={routeCohortSplitter(cohortQueryText)} prodReady />
```

Then we could use it's presence in the props or by directly checking in the query string for cohort, whether or not to display the control or changed version.

## Past Tests

We created a test to decide whether adding a mobile field and opt in box to an SMS service would decrease the amount of signatures on a petition. If AB_TEST_ENABLED=10, a user who visited any petition would be randomly redirected to either cohort=1 or cohort=2. Cohort=1 set another property within the SignPetition container which would then display the mobile field. When the test was enabled, form starts and form finishes were tracked by using the [FormTracker](https://github.com/MoveOnOrg/mop-frontend/blob/main/src/lib/form-tracker.js) class which uses the Segment API which are synced to and compared in the data warehouse.
