# CLI - DOWNLOADE MANAGER
A simple and efficient Command Line Download Manager built with Node.js.
This tool allows you to download any file from the internet (HTTP/HTTPS) directly from your terminal with progress tracking.

# Features

Built with Node.js

1. Download files using HTTP/HTTPS

2. CLI with simple flags (--download , --output)

3. Real-time progress tracking

4. Handles invalid URLs & paths gracefully

5. allowedExtensions = [
          ".zip",
          ".jpg",
          ".png",
          ".pdf",
          ".img",
          ".md",
          ".txt",
          ".mp4",
        ];

# Installation

=>Make sure you have Node.js (>=14) installed.

=>Clone this repo and install dependencies:

```
git clone https://github.com/your-username/download-manager.git
cd download-manager-cli
npm install
```

=>To use it globally as a CLI tool:
```
sudo npm i -g
```
# Usage

=>Run the following type of command:
```
dwnldd --download <file-url> --output <path-to-save>
```
=>Example
```
dwnldd --download https://www.example.com/sample.pdf --output ./downloads/sample.pdf
```
This will download sample.pdf into your downloads folder.

=>Example Output
```
📥 Starting download...
Progress: 72% [█████████-----]
✅ Download completed! Saved to ./downloads/sample.pdf
```

# Options
Option	Alias	Description	Example

```
command/option       Alias Description                                       Example

--download <url>  	-d	 File URL to download download-manager               -d https://example.com/file.zip
--output <path>	    -o	 Path where file should be saved download-manager    -d <url> -o ./downloads/file.zip
```



# Project Structure
```
download-manager/
│── index.js          # Main CLI entry point & download logic
│── package.json      # Project metadata, dependencies & CLI command mapping
│── package-lock.json # Auto-generated lock file for dependency versions
```

# Development

If you want to run it without installing globally:
```
node bin/index.js --download <file-url> --output <path>
```
# Future Features

1. Resume paused/incomplete downloads

2. Support multiple parallel downloads

3. Add FTP/SFTP protocol support

4. GUI version (Electron)

# Requirements

1. Requires Node.js v14+ with npm installed.

2. An active internet connection is needed for downloads.



 
