const fs = require("fs");
const globSync = require("glob").sync;
const unzipper = require("unzipper");
const { pageToHtml } = require("./page-to-html");

const archive =
  __dirname + "/../sample/bkp_variant-exported-thu-sep-19-2019.variant";
const output = "/Users/oliversmit/personal/variant-exporter/dist";

fs.createReadStream(archive).pipe(
  unzipper.Extract({ path: output }).on("close", () => {
    const fileList = globSync("dist/**/*.page");

    fileList.map(pageToHtml);

    fileList.forEach(file => {
      pageToHtml(file);
    });
  })
);
