const productId = "njnhw";
const accessCodes = ["GUMR-9F82X-LQ7M5-ZT3VB-YK1CN"];

function isValidSVC(str) {
  if (!str.startsWith("SVC-")) return false;

  const rest = str.slice(4);
  const dashIdx = rest.indexOf("-");
  if (dashIdx < 0) return false;

  const ts = rest.slice(0, dashIdx);
  const enc = rest.slice(dashIdx + 1);
  if (!ts || ts.length !== enc.length) return false;

  const tnum = Number(ts);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isInteger(tnum) || tnum <= now) return false;

  for (let i = 0; i < ts.length; i++) {
    const d = ts[i];
    if (d < "0" || d > "9") return false;
    if (enc[i] !== String.fromCharCode(97 + +d)) return false;
  }

  return true;
}

const licenseIsValid = async (licenseKey) => {
  console.log("licenseIsValid called with:", licenseKey);
  // console.log("accessCodes:", accessCodes);

  if (isValidSVC(licenseKey)) {
    console.log("Found matching SVC code!");
    return true;
  }

  //for launch
  if (accessCodes.includes(licenseKey)) {
    console.log("Found matching access code!");
    return true;
  }
  console.log("No matching access code, checking with Gumroad...");

  const form = new URLSearchParams();
  form.append("product_id", productId);
  form.append("license_key", licenseKey);

  try {
    const response = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });

    const data = await response.json();

    if (!data.success || !data.purchase) return false;

    const p = data.purchase;

    const isActive =
      p.subscription_id !== null &&
      p.subscription_ended_at === null &&
      p.subscription_cancelled_at === null &&
      p.subscription_failed_at === null &&
      p.refunded === false &&
      p.disputed === false;

    return isActive;
  } catch (e) {
    return false;
  }
};

module.exports = { licenseIsValid };
