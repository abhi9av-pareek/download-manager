#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { URL } = require("url");
const path = require("path");

const argv = yargs(hideBin(process.argv))
  .option("download", {
    alias: "d",
    type: "string",
    description: "URL for downloading",
    demandOption: true,
    coerce: (url) => {
      try {
        // url parse ki
        const parsedUrl = new URL(url);

        // Sbse Phele Protocol Validation
        const protocol = parsedUrl.protocol.replace(":", "");
        if (!["http", "https"].includes(protocol)) {
          throw new Error(
            `Invalid protocol: ${protocol}. Only http and https are allowed.`
          );
        }

        // Fir Extension Validation
        const allowedExtensions = [".zip", ".jpg", ".png", ".pdf"];
        const fileExtension = path.extname(parsedUrl.pathname).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          throw new Error(
            `Invalid file type: ${
              fileExtension || "none"
            }. Allowed types: ${allowedExtensions.join(", ")}`
          );
        }

        // agr agr sahbi check pass ho jayenge to original url ko parse krde
        return url;
      } catch (err) {
        throw new Error(`Invalid URL: ${url}. ${err.message}`);
      }
    },
  })
  .option("output", {
    alias: "o",
    type: "string",
    description: "Path to save the downloaded file",
    default: "./downloads",
  })
  .help()
  .parse();

console.log("Download URL:", argv.download);
console.log("Output folder:", argv.output);

// .option("protocol", {
//   alias: "p",
//   type: "string",
//   description: "Protocol to use for downloading",
//   choices: ["http", "https"], // <-- Only allow these
//   demandOption: true,
// })
