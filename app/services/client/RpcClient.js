import { parseJson } from "./util";

class RpcClient {
  async request(service, method, params = {}, responseHandler = null) {
    if (!this.baseUrl) {
      throw new Error("You must call login() before request().");
    }
    params.appId = this.applicationId;
    let response = await fetch(
      this.baseUrl + "/comGpsGate/rpc/" + service + "/v.1/" + method,
      {
        // credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(params)
      }
    );
    if (!response.ok) {
      throw new Error(`Request error. Response status: ${response.status}`);
    }
    if (responseHandler) {
      response = responseHandler(response);
    }
    response = await response.text();
    response = parseJson(response);
    if (response.error) {
      const message = response.error.message
        ? response.error.message
        : "Unknown error.";
      const error = new Error(message);
      error.nativeError = response.error;
      throw error;
    }
    response = response.result;
    if (response && response.__result && !response.result) {
      response.result = response[response.__result];
    }
    return response;
  }

  async login(baseUrl, username, password) {
    this.baseUrl = baseUrl;
    const response = await this.request("Directory", "Login", {
      strUserName: username,
      strPassword: password,
      bStaySignedIn: true
    });
    const applications = Object.values(
      response.result.Session.Applications
    ).filter(
      app => app.BOType === "GpsGate.VehicleTracker.VehicleTrackerApplication"
    );
    if (applications.length === 0) {
      throw new Error("Application error.");
    }
    const userId = response.result.Session.UserId;
    const applicationId = applications[0].id;
    this.applicationId = applicationId;
    return { userId, applicationId };
  }

  async logout() {
    await this.request("Directory", "Logout");
    this.baseUrl = null;
    this.applicationId = null;
  }
}

export default new RpcClient();
