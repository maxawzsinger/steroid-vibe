const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const { getTokens, getO3DollarValue } = require("./helpers/calculateTokens");
const { minifyTs } = require("./helpers/minifyTs");
const { makeDollarsSavedText } = require("./helpers/makeDollarsSavedText");
const { isTsx } = require("./helpers/isTsx");
const { licenseIsValid } = require("./helpers/licenseIsValid");

let tokensProcessedThisSession = 0;
let dollarsSavedThisSession = 0; //using o3 pricing
let tokensSavedThisSession = 0; //using openai tokensizer

const pick = document.getElementById("pick");
const logBox = document.getElementById("log");
const dollarsSaved = document.getElementById("dollars-saved");
const tokensSaved = document.getElementById("tokens-saved");
const licenseInput = document.getElementById("license-key");
const verifyBtn = document.getElementById("verify-license");
const licenseFeedback = document.getElementById("license-feedback");

pick.disabled = true;

// on load: populate from storage
const savedKey = localStorage.getItem("licenseKey");
if (savedKey) {
  licenseInput.value = savedKey;
  // optionally auto-verify on load:
  verifyKey(savedKey, false);
}

verifyBtn.addEventListener("click", () => verifyKey(licenseInput.value, true));

async function verifyKey(key, showMsg) {
  licenseFeedback.textContent = showMsg ? "Verifying…" : "";
  const ok = await licenseIsValid(key);
  if (ok) {
    localStorage.setItem("licenseKey", key);
    if (showMsg) licenseFeedback.textContent = "License valid";
    pick.disabled = false;
  } else {
    if (showMsg) licenseFeedback.textContent = "Invalid key";
    localStorage.removeItem("licenseKey");
    pick.disabled = true;
  }
}

dollarsSaved.textContent = makeDollarsSavedText(0);

let watcher = null;

//we do want to process all files on start, but not increment the tokens saved
const haveProcessedFileOnStart = {};

function log(msg) {
  logBox.textContent += msg + "\n";
  logBox.scrollTop = logBox.scrollHeight;
}

async function processFile(file) {
  log(`[process] ${file}`);
  if (!isTsx(file)) {
    return;
  }

  try {
    const src = await fs.promises.readFile(file, "utf8");
    const minifiedSrc = minifyTs(src);

    if (minifiedSrc !== src) {
      await fs.promises.writeFile(file, minifiedSrc, "utf8");
      log(`[minified] ${file}`);
      //dont provide tokens saved for the initial process , just when its next sent.
      if (haveProcessedFileOnStart[file]) {
        tokensProcessedThisSession += getTokens(src);
        const tokensSavedo3 = getTokens(src) - getTokens(minifiedSrc);
        const dollarsSavedo3 = getO3DollarValue(tokensSavedo3);
        dollarsSavedThisSession += dollarsSavedo3;
        tokensSavedThisSession += tokensSavedo3;
        dollarsSaved.textContent = makeDollarsSavedText(
          dollarsSavedThisSession
        );
        tokensSaved.textContent = `Tokens saved this session: ${tokensSavedThisSession}, ${(
          (tokensSavedThisSession / tokensProcessedThisSession) *
          100
        ).toFixed(2)}% of total tokens processed`;
      } else {
        haveProcessedFileOnStart[file] = true;
      }
    }
  } catch (err) {
    log(`[error] ${file} → ${err.message}`);
  }
}

pick.addEventListener("change", () => {
  if (watcher) {
    console.log("closing watcher");
    watcher.close();
    watcher = null;
    log("[reset] previous watcher closed");
  }

  if (!pick.files.length) {
    return alert("Please choose a file or folder");
  }

  const folderPath = path.resolve(
    pick.files[0].path.split(pick.files[0].name)[0]
  );

  console.log(folderPath);

  log(`[watching] ${folderPath}`);

  const globs = ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"].map((g) =>
    path.join(folderPath, g)
  );

  watcher = chokidar
    .watch(globs, {
      ignoreInitial: false,
      ignored: /(^|[\/\\])node_modules/,
    })
    .on("add", processFile)
    .on("change", processFile);
});
