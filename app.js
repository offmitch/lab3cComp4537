const http = require("http");
const fs = require ("fs");
const url = require("url");
const messages = require("./lang/messages/en/user.js");

class Messenger {

  getSavedMessage() {
    return `${messages.savedMessage}`;
  }

   getFailedMessage() {
    return `${messages.failedMessage}`;
  }

}

class FileAdder {
  constructor(filename) {
    this.filename = filename;
    this.messenger = new Messenger();
  }

  addText(text) {
    try {
      fs.appendFileSync(this.filename, text + "\n");
      return `${this.messenger.getSavedMessage()}: "${text}"`;
    } catch (error) {
      throw new Error(`${this.messenger.getFailedMessage()}: ${error.message}`);
    }
  }
}

const appender = new FileAdder("file.txt");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === "/COMP4537/labs/3/writeFile") {
    const text = parsedUrl.query.text || "";

    try {
      const message = appender.addText(text);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(message);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(error.message);
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});
