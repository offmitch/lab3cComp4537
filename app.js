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
  const fullUrl = `http://${req.headers.host}${req.url}`;
  const parsedUrl = new URL(fullUrl);
  
  // Check the pathname exactly
  if (parsedUrl.pathname === "/writeFile") {
    const text = parsedUrl.searchParams.get("text") || "Text goes here";

    // Append the text to file.txt
    fs.appendFileSync("file.txt", `${text}\n`);

    const messenger = new Greet();
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`${text} : ${messenger.getMessage()}`);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
