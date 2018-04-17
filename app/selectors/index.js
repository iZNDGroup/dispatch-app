import { createSelector } from "reselect";
import moment from "moment";
import { object } from "../util/immutable";
import * as uiSelector from "./ui";
import * as calendarSelector from "./calendar";
import * as jobsSelector from "./jobs";
import * as routesSelector from "./routes";
import * as metadataSelector from "./metadata";
import * as customFieldsSelector from "./customFields";

export const _getIsLoading = (jobsByDate, metadata, date) => {
  if (!date) return false;
  date = date.format("YYYYMMDD");
  const jobsDictionary = jobsByDate[date] || {};
  const jobsArray = Object.keys(jobsDictionary);
  const jobsLength = jobsArray.length;
  const metadataDictionary = metadata[date] || {};
  const metadataArray = Object.keys(metadataDictionary);
  const metadataLength = metadataArray.length;
  let isLoading = jobsLength !== metadataLength;
  if (!isLoading) {
    for (const key of jobsArray) {
      if (!metadataDictionary[key]) {
        isLoading = true;
        break;
      }
    }
  }
  return isLoading;
};
export const getIsLoading = createSelector(
  [
    jobsSelector.getByDate,
    metadataSelector.getAll,
    calendarSelector.getSelectedDate
  ],
  _getIsLoading
);

export const _getItems = (
  jobs,
  jobsByDate,
  routes,
  templateCustomFields,
  date,
  jobsSettings
) => {
  if (!date) return [];

  const jobsDictionary = jobsByDate[date.format("YYYYMMDD")];
  if (!jobsDictionary) return [];

  const jobsFiltered = Object.keys(jobsDictionary)
    .reduce((arr, id) => {
      if (jobs[id]) {
        arr.push(jobs[id]);
      }
      return arr;
    }, [])
    .filter(
      job => !job.hidden && !(jobsSettings.hideFinished && job.status === 2)
    )
    .map(job =>
      object.merge(job, {
        orderBy: job.scheduledTime
      })
    );

  const jobsWithoutRoute = jobsFiltered.filter(job => !job.routeId);
  const jobsWithRoute = jobsFiltered.filter(job => !!job.routeId);

  const jobItems = jobsWithoutRoute.map(job =>
    object.merge(job, {
      type: "job"
    })
  );

  const routeIDs = jobsWithRoute
    .map(job => job.routeId)
    .filter((routeId, i, self) => self.indexOf(routeId) === i);
  const routeItems = routeIDs.reduce((arr, routeId) => {
    if (routes[routeId]) {
      const routeJobs = jobsWithRoute
        .filter(job => job.routeId === routeId)
        .sort(itemCompareFn);
      if (routeJobs.length > 0) {
        const route = object.merge(routes[routeId], {
          type: "route",
          orderBy: routeJobs[0].scheduledTime,
          jobs: routeJobs,
          customFields: getCustomFields(
            routes[routeId].customFields,
            templateCustomFields
          )
        });
        arr.push(route);
      }
    }
    return arr;
  }, []);

  return jobItems.concat(routeItems).sort(itemCompareFn);
};
const itemCompareFn = (a, b) => {
  if (a.orderBy && b.orderBy) {
    if (a.orderBy.isAfter(b.orderBy)) {
      return 1;
    } else if (a.orderBy.isBefore(b.orderBy)) {
      return -1;
    }
  } else if (a.orderBy && !b.orderBy) {
    return 1;
  } else if (!a.orderBy && b.orderBy) {
    return -1;
  }
  return a.id === b.id ? 0 : a.id > b.id ? 1 : -1;
};
export const getItemsToday = createSelector(
  [
    jobsSelector.getAll,
    jobsSelector.getByDate,
    routesSelector.getAll,
    customFieldsSelector.getRouteCustomFields,
    calendarSelector.getToday,
    uiSelector.getSettings
  ],
  _getItems
);
export const getItemsByDate = createSelector(
  [
    jobsSelector.getAll,
    jobsSelector.getByDate,
    routesSelector.getAll,
    customFieldsSelector.getRouteCustomFields,
    calendarSelector.getSelectedDate,
    uiSelector.getSettings
  ],
  _getItems
);

export const getJobById = createSelector(
  [jobsSelector.getById, customFieldsSelector.getJobCustomFields],
  (job, templateCustomFields) => {
    if (job) {
      const customFields = getCustomFields(
        job.customFields,
        templateCustomFields
      );
      return object.merge(job, { customFields });
    } else {
      return null;
    }
  }
);

const getCustomFields = (customFields, templateCustomFields) => {
  const customFieldsArr = customFields ? Object.entries(customFields) : [];
  return customFieldsArr.reduce((arr, [key, value]) => {
    const templateField = templateCustomFields[key];
    if (templateField) {
      arr.push({
        id: templateField.id,
        type: templateField.cfType,
        label: templateField.label,
        options:
          templateField.cfType === "List" ? templateField.defaultValue : null,
        value: value
      });
    }
    return arr;
  }, []);
};

export const _getJobsToday = (jobs, jobsByDate, date) => {
  if (!date) return [];
  const jobsDictionary = jobsByDate[date.format("YYYYMMDD")];
  if (!jobsDictionary) return [];
  const jobsFiltered = Object.keys(jobsDictionary)
    .map(id => jobs[id])
    .filter(job => !job.hidden);
  return jobsFiltered;
};
export const getJobsToday = createSelector(
  [jobsSelector.getAll, jobsSelector.getByDate, calendarSelector.getToday],
  _getJobsToday
);

export const _getNewJobIds = (jobs, jobsByDate, today) => {
  if (!today) return [];
  const jobsDictionary = jobsByDate[today.format("YYYYMMDD")];
  if (!jobsDictionary) return [];
  const jobsFiltered = Object.keys(jobsDictionary)
    .reduce((arr, id) => {
      if (jobs[id]) {
        arr.push(jobs[id]);
      }
      return arr;
    }, [])
    .filter(job => job.new)
    .map(job => job.id);
  return jobsFiltered;
};
export const getNewJobIds = createSelector(
  [jobsSelector.getAll, jobsSelector.getByDate, calendarSelector.getToday],
  _getNewJobIds
);

export const _getEventDates = metadataDictionary => {
  const eventDates = Object.entries(metadataDictionary).reduce(
    (arr, [date, jobIDs]) => {
      if (Object.keys(jobIDs).length > 0) {
        arr.push(moment(date).format("YYYY-MM-DD"));
      }
      return arr;
    },
    []
  );
  return eventDates;
};
export const getEventDates = createSelector(
  [metadataSelector.getAll],
  _getEventDates
);
