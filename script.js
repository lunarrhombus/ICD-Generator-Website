const openai = require("openai");

openai.apiKey = "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";

const generateICD = async (datasheet1, datasheet2) => {
  // Send the component datasheets to the GPT-3 API for processing
  const response = await openai.completion.create({
    model: "text-davinci-002",
    prompt: `Please generate an ICD based on the following two component datasheets:

${datasheet1}

${datasheet2}`,
    temperature: 0.5,
  });

  // Extract the generated ICD from the API response
  const ICD = response.choices[0].text;

  // Return the generated ICD
  return ICD;
};

const form = document.getElementById("datasheet-form");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Check if any files have been uploaded
  if (
    document.getElementById("datasheet-1").files.length === 0 ||
    document.getElementById("datasheet-2").files.length === 0
  ) {
    // If no files have been uploaded, display an error message
    resultDiv.innerHTML =
      "<p>Please upload both component datasheets before generating the ICD.</p>";
    return;
  }

  // Show a loading spinner or progress bar
  resultDiv.innerHTML = '<p>Generating ICD...</p><div class="spinner"></div>';

  // Retrieve the uploaded component datasheets
  const datasheet1 = document.getElementById("datasheet-1").files[0];
  const datasheet2 = document.getElementById("datasheet-2").files[0];

  // Generate the ICD using the component datasheets
  const ICD = await generateICD(datasheet1, datasheet2);

  // Display the generated ICD on the page
  resultDiv.innerHTML = `<p>Generated ICD:</p>
  <pre>${ICD}</pre>`;
});