const express = require("express");
const http = require("http");
const https = require("https");

const app = express();

// Function to fetch content from a URL
function fetchContent(url, callback) {
  const protocol = url.startsWith("https") ? https : http;

  protocol
    .get(url, (res) => {
      let rawData = "";
      res.setEncoding("binary");

      res.on("data", (chunk) => {
        rawData += chunk;
      });

      res.on("end", () => {
        callback(res.headers["content-type"], rawData);
      });
    })
    .on("error", (error) => {
      console.error("Error fetching URL:", error.message);
      callback(null, null);
    });
}

// Define a route to handle the query parameter
app.get("/", (req, res) => {
  const fetchedUrl = req.query.url;

  if (fetchedUrl) {
    fetchContent(fetchedUrl, (contentType, content) => {
      if (contentType && content) {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "binary");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error fetching content from the URL.");
      }
    });
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end('Missing "url" query parameter.');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
