const GOOGLE_APPS_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

const form = document.getElementById("subsidyForm");
const statusMessage = document.getElementById("statusMessage");

function showStatus(type, message) {
  statusMessage.className = "status-message " + type;
  statusMessage.textContent = message;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes("PASTE_")) {
    showStatus("error", "Please replace the placeholder Google Apps Script URL in app.js before submitting the form.");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  showStatus("success", "Submitting your application...");

  try {
    const formData = new FormData(form);
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      body: formData,
      mode: "cors"
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      throw new Error(data.message || "The submission failed.");
    }

    showStatus("success", `Application submitted successfully. Your reference number is ${data.applicationId}.`);
    form.reset();
  } catch (error) {
    console.error(error);
    showStatus("error", "Submission failed. Please check the Google Apps Script URL and form data, then try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit application";
  }
});
