import JobsTab from "../components/JobsTab";
import CalendarTab from "../components/CalendarTab";
import MapTab from "../components/MapTab";
import SettingsTab from "../components/SettingsTab";
import JobList from "../components/JobList";
import JobViewContainer from "../components/JobViewContainer";
import CalendarList from "../components/CalendarList";
import MapView from "../components/MapView";
import LoginView from "../components/LoginView";
import Signature from "../components/Signature";
import CustomFieldPhotoView from "../components/CustomFieldPhotoView";

const _createTab = (id, component, name, icon) => ({
  id,
  component,
  label: { name, icon }
});
const _tabs = [
  _createTab("jobs", JobsTab, "Jobs", "md-car"),
  _createTab("calendar", CalendarTab, "Calendar", "md-calendar"),
  _createTab("map", MapTab, "Map", "md-globe"),
  _createTab("settings", SettingsTab, "Settings", "md-settings")
];
export const tabs = _tabs.reduce((obj, tab, index) => {
  tab.index = index;
  obj[tab.id] = tab;
  return obj;
}, {});

const _createRoute = (id, component, props = undefined, gestures = true) => ({
  id,
  component,
  props,
  gestures
});
export const routes = {
  jobList: () => _createRoute("jobList", JobList),
  signature: onSave => _createRoute("signature", Signature, { onSave }, false),
  photoView: payload =>
    _createRoute("photoView", CustomFieldPhotoView, { ...payload }, false),
  jobView: (id, showActions = true) =>
    _createRoute("jobView", JobViewContainer, { id, showActions }),
  calendarList: () => _createRoute("calendarList", CalendarList),
  mapView: () => _createRoute("mapView", MapView),
  loginView: () => _createRoute("loginView", LoginView)
};
