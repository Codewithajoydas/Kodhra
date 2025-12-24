const express = require("express");
const downloadRouter = express.Router();
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");
const Folder = require("../models/folder");
const archiver = require("archiver");
const { default: mongoose } = require("mongoose");

const languageExtensions = [
  { language: "JavaScript", extension: ".js" },
  { language: "CSS", extension: ".css" },
  { language: "HTML", extension: ".html" },
  { language: "C", extension: ".c" },
  { language: "C++", extension: ".cpp" },
  { language: "C#", extension: ".cs" },
  { language: "Java", extension: ".java" },
  { language: "TypeScript", extension: ".ts" },
  { language: "Python", extension: ".py" },
  { language: "Ruby", extension: ".rb" },
  { language: "PHP", extension: ".php" },
  { language: "Go", extension: ".go" },
  { language: "Rust", extension: ".rs" },
  { language: "Swift", extension: ".swift" },
  { language: "Kotlin", extension: ".kt" },
  { language: "Objective-C", extension: ".m" },
  { language: "Scala", extension: ".scala" },
  { language: "Perl", extension: ".pl" },
  { language: "R", extension: ".r" },
  { language: "Dart", extension: ".dart" },
  { language: "Haskell", extension: ".hs" },
  { language: "Lua", extension: ".lua" },
  { language: "Elixir", extension: ".ex" },
  { language: "Clojure", extension: ".clj" },
  { language: "Shell", extension: ".sh" },
  { language: "PowerShell", extension: ".ps1" },
  { language: "SQL", extension: ".sql" },
  { language: "GraphQL", extension: ".graphql" },
  { language: "MATLAB", extension: ".m" },
  { language: "Assembly", extension: ".asm" },
  { language: "Fortran", extension: ".f90" },
  { language: "COBOL", extension: ".cob" },
  { language: "Erlang", extension: ".erl" },
  { language: "VB.NET", extension: ".vb" },
];
function getExtensionByLanguage(language) {
  const entry = languageExtensions.find((l) => l.language === language);
  return entry ? entry.extension : ".txt";
}

downloadRouter.get("/download", async (req, res) => {
  const token = req.cookies.token;
  const selected = req.query.selected.split(",");
  if (!token) return res.status(401).end();

  const { _id } = jwt.verify(token, process.env.SECRET).checkUser;

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=download.zip");

  const archive = archiver("zip");
  archive.pipe(res);

  const folders = await Folder.find({ _id: { $in: selected } }).populate(
    "cards"
  );
  if (folders.length === 0) {
    return res.status(404).json({ error: "Folder not found" });
  }

  for (const folder of folders) {
    let path = folder.folderName;
    let parent = folder.parent;

    while (parent) {
      const p = await Folder.findById(parent).select("folderName parent");
      path = p.folderName + "/" + path;
      parent = p.parent;
    }

    for (const card of folder.cards || []) {
      const extension = getExtensionByLanguage(card.category);

      archive.append(card.content || "", {
        name: `${path}/${card.title}${extension}`,
      });
    }
  }

  archive.finalize();
});

downloadRouter.get("/download/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid card ID" });
  }

  const card = await Card.findById(id);
  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }

  const extension = getExtensionByLanguage(card.category);
  const safeTitle = card.title.replace(/[^a-z0-9]/gi, "_");

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${safeTitle}${extension}"`
  );

  res.send(card.content); 
});

module.exports = downloadRouter;
