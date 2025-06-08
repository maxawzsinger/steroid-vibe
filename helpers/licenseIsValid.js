const productId = "";
const accessCodes = ["GUMR-9F82X-LQ7M5-ZT3VB-YK1CN"];
const licenseIsValid = async (licenseKey) => {
  //for launch
  if (accessCodes.includes(licenseKey)) return true;

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
