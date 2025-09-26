const http = require("http");
const fs = require ("fs");
const url = require("url");
const messages = require("./lang/messages/en/user.js");

class Messenger {

  getSavedMessage() {
    return messages.savedMessage;
  }

   getFailedMessage() {
    return messages.failedMessage;
  }

  getIntroMessage() {
    return messages.introMessage;
  }

  getMissingTextMessage() {
    return messages.missingTextMessage;
  }

  getMissingTextMessage() {
    return messages.missingTextMessage;
  }

  getErrorReadingFileMessage(file) {
    return `${messages.errorReadingFileMessage}: ${file}`;
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
  const fullUrl = `http://${req.headers.host}${req.url}`;
  const parsedUrl = new URL(fullUrl);
  const messenger = new Messenger();

  
  //check pathname exactly
  if (parsedUrl.pathname === "/writeFile/") {
    const text = parsedUrl.searchParams.get("text");
    if (!text) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(messenger.getMissingTextMessage());
      return;
    }
    fs.appendFileSync("file.txt", `${text}\n`);

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`${text} : ${messenger.getSavedMessage()}`);
  } else if (parsedUrl.pathname === "/readFile/") {
    const file = parsedUrl.searchParams.get("file");

    if (!file) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(messenger.getMissingFileMessage());
      return;
    }

    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(messenger.getErrorReadingFileMessage(file));
        return;
      }
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(data);
    });

    }else{
    
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(messenger.getIntroMessage());
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
