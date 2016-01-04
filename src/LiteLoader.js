var LiteLoader = {
  create: function ()
  {
    var loaderObject = Object.create(LiteLoader);
    loaderObject.contentPromises = [];
    loaderObject.content = {};
    return loaderObject;
  },
  allComplete: function ()
  {
    return Promise.all(this.contentPromises);
  },
  getJSON: function (name, url)
  {
    return this.get(name, url, data => JSON.parse(data));
  },
  get: function (name, url, dataTreatment = data => data)
  {
    // Return a new promise.
    var contentPromise = new Promise((resolve, reject) => {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.open('GET', url);

      req.addEventListener('load', () => {
        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          var content = dataTreatment(req.responseText);
          this.content[name] = content;
          resolve(content);
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      });

      // Handle network errors
      req.addEventListener('error', () => {
        reject(Error('Network Error'));
      });

      // Make the request
      req.send();
    });

    this.contentPromises.push(contentPromise);
    return contentPromise;
  }
};

export default LiteLoader;
