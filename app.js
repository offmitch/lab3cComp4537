export async function handler(event, context) {
  const params = event.queryStringParameters;
  const text = params.name || "Text goes here";
  const currentTime = new Date().toLocaleString();

  fs.appendFileSync("file.txt", `${text}\n`);
  
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Saved "${text}" into file.txt`
  };
}