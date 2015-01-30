class Response {
  constructor(body) {
    this.bodyUsed = false;
    this._body = initBody(body);
  }

  text() {
    return new Promise((resolve, reject) => {
      if (!this.bodyUsed) {
        this.bodyUsed = true;
        resolve(this._body);
      } else {
        reject(new TypeError("Already read"));
      }
    });
  }

  json() {
    return this.text().then(JSON.parse);
  }
}


function initBody(body) {
  if (typeof body === "string") {
    return body;
  } else {
    return JSON.stringify(body);
  }
}

export default Response;
