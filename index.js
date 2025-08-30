#!/usr/bin/env node
const yargs = require("yargs/yargs");
const fs = require("fs");
const { hideBin } = require("yargs/helpers");
const { URL } = require("url");
const path = require("path");
const http = require("http");
const https = require("https");


const argv = yargs(hideBin(process.argv))
  .option("download", {
    alias: "d",
    type: "string",
    description: "URL for downloading",
    demandOption: true,
    coerce: (url) => {
      try {
        const parsedUrl = new URL(url);

      
        const protocol = parsedUrl.protocol.replace(":", "");
        if (!["http", "https"].includes(protocol)) {
          throw new Error(
            `❌ Invalid protocol: ${protocol}. Only http and https are allowed.`
          );
        }

        const allowedExtensions = [".zip", ".jpg", ".png", ".pdf"];
        const fileExtension = path.extname(parsedUrl.pathname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          throw new Error(
            `❌ Invalid file type: ${
              fileExtension || "none"
            }. Allowed types: ${allowedExtensions.join(", ")}`
          );
        }

        return url;
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    },
  })
  .option("output", {
    alias: "o",
    type: "string",
    description: "Output file path",
    demandOption: false,
    coerce: (outputPath) => {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }); 
      }
      return outputPath;
    },
  })
  .help()
  .parse();

// Extract values
const url = argv.download;
const protocol = url.startsWith("https") ? https : http;

const fileNameFromUrl = url.split("/").pop() || "downloaded_file";
const finalPath = argv.output
  ? argv.output
  : path.join(process.cwd(), fileNameFromUrl);

// Function to download file with proper headers
function downloadFile(downloadUrl, maxRedirects = 5) {
  if (maxRedirects <= 0) {
    console.error("❌ Too many redirects");
    return;
  }

  console.log(`⬇️ Starting download from: ${downloadUrl}`);

  const options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
  };

  const req = protocol.get(downloadUrl, options, (response) => {
  
    if (response.statusCode === 301 || response.statusCode === 302) {
      const location = response.headers.location;
      if (location) {
        console.log(`🔄 Redirecting to: ${location}`);
        downloadFile(location, maxRedirects - 1);
        return;
      }
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      const file = fs.createWriteStream(finalPath);

      const totalSize = parseInt(response.headers["content-length"], 10);
      let downloadedSize = 0;

      response.on("data", (chunk) => {
        downloadedSize += chunk.length;
        if (totalSize) {
          const progress = ((downloadedSize / totalSize) * 100).toFixed(1);
          process.stdout.write(`\r📥 Downloading... ${progress}%`);
        }
      });

      response.pipe(file);

      file.on("finish", () => {
        process.stdout.write("\n"); 
        console.log(`✅ Download complete: ${finalPath}`);
        if (totalSize) {
          console.log(
            `📊 File size: ${(downloadedSize / 1024 / 1024).toFixed(2)} MB`
          );
        }
      });

      file.on("error", (err) => {
        console.error(`❌ File write error: ${err.message}`);
        fs.unlink(finalPath, () => {}); 
      });
    } else {
      console.error(
        `❌ Failed to download. Status code: ${response.statusCode}`
      );
      console.error(`📝 Response: ${response.statusMessage}`);

      let errorData = "";
      response.on("data", (chunk) => {
        errorData += chunk;
      });

      response.on("end", () => {
        if (errorData) {
          console.error(`📄 Error details: ${errorData.substring(0, 200)}...`);
        }
      });
    }
  });

  req.on("error", (err) => {
    console.error(`❌ Network error: ${err.message}`);
  });

  req.on("timeout", () => {
    console.error("❌ Request timeout");
    req.destroy();
  });
  
  req.setTimeout(30000); 
}

downloadFile(url);
