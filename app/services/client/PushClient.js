import EventSource from "./EventSource";
import { parseJson } from "./util";

class PushClient {
  constructor(
    baseUrl,
    applicationId,
    openCallback = null,
    errorCallback = null
  ) {
    this.baseUrl = baseUrl;
    this.applicationId = applicationId;
    this.openCallback = openCallback;
    this.errorCallback = errorCallback;
    this.connId = -1;
    this.seqId = -1;
    this.hid = 0;
    this.eventSource = null;
    this.isOpened = false;
    this.isClosing = false;
    this.retryHandle = null;
    this.handles = {};
  }

  open() {
    const url = this._buildUrl("open");
    this.eventSource = new EventSource(url, { withCredentials: true });
    this.eventSource.addEventListener("message", e => {
      // this._debug('eventSource message', e)
      const packet = parseJson(e.data);
      const id = packet.id;
      const data = packet.data;
      this.seqId = id;
      if (data.sys) {
        this._onSysMessage(data);
      } else {
        this._onMessage(data);
      }
    });
    this.eventSource.addEventListener("open", e => {
      this._debug("eventSource open");
    });
    this.eventSource.addEventListener("error", e => {
      if (!this.isClosing) {
        this._debug("eventSource error", e);
        this._retry();
        if (this.errorCallback) {
          this.errorCallback();
        }
      }
      this.isClosing = false;
    });
  }

  _onSysMessage(data) {
    data.sys.forEach(sys => {
      const msg = sys.msg;
      if (msg.type === "connInfo") {
        const newConn = msg.connId !== this.connId;
        this.connId = msg.connId;
        this._connInfo(newConn);
      } else if (msg.type === "ping") {
        this._pong();
      }
    });
  }

  _connInfo(newConn) {
    this._debug("connInfo", this.connId, newConn);
    if (newConn) {
      for (let ns in this.handles) {
        for (let hid in this.handles[ns]) {
          this._subscribe(this.handles[ns][hid]);
        }
      }
    }
    this.isOpened = true;
    if (this.openCallback) {
      this.openCallback();
    }
  }

  _pong() {
    // this._debug('ping pong')
    const url = this._buildUrl("pong");
    try {
      fetch(url, { method: "POST" });
    } catch (error) {
      this._debug("pong error", error, url);
    }
  }

  _onMessage(data) {
    for (let ns in data) {
      if (this.handles[ns]) {
        const dataItems = data[ns];
        for (var hid in this.handles[ns]) {
          const handle = this.handles[ns][hid];
          const messages = dataItems
            .filter(dataItem => dataItem.hid.indexOf(handle.id) > -1)
            .map(dataItem => dataItem.msg);
          if (messages.length > 0) {
            handle.callback(messages);
          } else {
            this._debug("no messages for handle", handle.id, dataItems);
          }
        }
      } else {
        this._debug("no handles for namespace", ns);
      }
    }
  }

  _retry() {
    const connId = this.connId;
    this.close();
    this.connId = connId;
    this.retryHandle = setTimeout(() => this.open(), 5000);
  }

  close() {
    this.connId = -1;
    this.isOpened = false;
    this.isClosing = true;
    if (this.retryHandle) {
      clearTimeout(this.retryHandle);
      this.retryHandle = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  subscribe(ns, callback) {
    return this.subscribeId(ns, 0, callback);
  }

  subscribeId(ns, subId, callback) {
    if (!subId) {
      subId = 0;
    }
    if (!this.handles[ns]) {
      this.handles[ns] = {};
    }
    const handle = {
      id: ++this.hid,
      ns: ns,
      subId: subId,
      callback: callback
    };
    this.handles[ns][handle.id] = handle;
    if (this.isOpened) {
      this._subscribe(handle);
    }
    return handle;
  }

  _subscribe(handle) {
    const url = this._buildUrl("subscribe", handle.ns, handle.subId, handle.id);
    try {
      this._debug("subcribe", handle.ns, handle.subId, handle.id);
      fetch(url, { method: "POST" });
    } catch (error) {
      this._debug("subscribe error", error, url);
    }
  }

  unsubscribe(ns, hid) {
    const handle = this.handles[ns][hid];
    if (handle) {
      delete this.handles[ns][hid];
      this._unsubscribe(handle);
    }
  }

  _unsubscribe(handle) {
    const url = this._buildUrl(
      "unsubscribe",
      handle.ns,
      handle.subId,
      handle.id
    );
    try {
      this._debug("unsubscribe", handle.ns, handle.subId, handle.id);
      fetch(url, { method: "POST" });
    } catch (error) {
      this._debug("unsubscribe error", error, url);
    }
  }

  _buildUrl(command, ns, subId, hid) {
    ns = ns ? "/" + ns : "";
    subId = subId ? "/" + subId : "";
    hid = hid || -1;
    const seqId = this.seqId > 0 ? "&seqId=" + this.seqId : "";
    return (
      this.baseUrl +
      "/comGpsGate/sse/" +
      command +
      ns +
      subId +
      "?aid=" +
      this.applicationId +
      "&cid=" +
      this.connId +
      seqId +
      "&hid=" +
      hid
    );
  }

  _debug(message, ...optionalParams) {
    if (PushClient.DEBUG) {
      console.debug(message, ...optionalParams);
    }
  }
}

PushClient.DEBUG = false;

export default PushClient;
