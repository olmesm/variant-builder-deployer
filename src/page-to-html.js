const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const prettier = require("prettier");
const { startCase } = require("lodash");

const regexClean = [
  ' *\\b(via|vbq|vhy|vhz|vib|vic|vio|vir|vjs|voh|vrh|nav-id)="[A-z0-9-]*\\b"',
  " *\\b(via|vbq|vhy|vhz|vib|vic|vio|vir|vjs|voh|vrh)-[A-z0-9-]*\\b",
  " *\\b(via|vbq|vhy|vhz|vib|vic|vio|vir|vjs|voh|vrh)\\b",
  ' *contenteditable="[A-z]*\\b"',
  " *variant-[A-z0-9-]*\\b",
  //    Always class clean last please!
  'class="vir"',
  ' *class="( )*"'
];

const regexList = regexClean.map(reg => new RegExp(reg, "gi"));

const regexCleaner = (html, regexFilter) => html.replace(regexFilter, "");

exports.pageToHtml = filePath => {
  let fileBlob;
  let dom;
  let elems;
  const fileString = fs.readFileSync(filePath);
  const head = fs.readFileSync(__dirname + "/head.html");
  const footer = fs.readFileSync(__dirname + "/footer.html");

  try {
    fileBlob = JSON.parse(fileString);
  } catch (e) {
    console.log({ e });
    throw new Error("Couldn't parse file: " + filePath);
  }

  try {
    dom = new JSDOM(fileBlob.masterHtml);
    dom.window.document.head.innerHTML = head;

    dom.window.document.body.innerHTML += footer;

    elems = dom.window.document.querySelectorAll(".vib");

    elems.forEach(element => {
      element.parentNode.removeChild(element);
    });
  } catch (e) {
    console.log({ e });
    throw new Error("Couldn't JSDOM file: " + filePath);
  }

  try {
    const cleanHtml = regexList
      .reduce(regexCleaner, dom.serialize())
      .replace(/\.\.\//gi, "")
      .replace("<html>", '<!doctype html>\n<html lang="en">')
      .replace(
        "{{pageTitle}}",
        fileBlob.pageTitle ||
          "Radically Digital - " + startCase(fileBlob.pageName)
      )
      .replace(
        "{{metaDescription}}",
        fileBlob.metaDescription ||
          "Find out more about " +
            startCase(fileBlob.pageName) +
            " at Radically Digital"
      );

    fs.writeFileSync(
      "dist/pages/" + fileBlob.pageName.replace(/ /gi, "-") + ".html",
      prettier.format(cleanHtml, { parser: "html" })
    );
  } catch (e) {
    throw new Error("Couldn't write file: " + filePath);
  }
};
