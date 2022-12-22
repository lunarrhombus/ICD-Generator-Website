// Function to use GPT-3 to generate the ICD
async function generateICD(
  componentAName,
  componentAFile,
  componentBName,
  componentBFile
) {
  // Use the OpenAI API to generate the ICD
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "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",
    },
    body: JSON.stringify({
      model: "text-davinci-002",
      prompt: `Generate an Interface Control Document for ${componentAName} and ${componentBName}. Use the following technical documents as a reference: ${componentAFile} and ${componentBFile}.`,
      num_images: 1,
      size: "1024x1024",
      response_format: "text",
    }),
  });

  // Get the generated ICD from the API response
  const json = await response.json();
  const icd = json.data[0].text;

  // Create a PDF document with the generated ICD
  const doc = new pdfkit();
  doc.text(icd);

  // Create a download link for the PDF document
  const link = document.createElement("a");
  link.download = "icd.pdf";
  link.href = doc.output("bloburl");
  link.innerHTML = "Download PDF";

  // Add the download link to the page
  const icdDiv = document.querySelector(".icd");
  icdDiv.innerHTML = "";
  icdDiv.appendChild(link);

  // Return the generated ICD
  return icd;
}

// Add an event listener to the form submit button
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the component names and files from the form inputs
  const componentAName = document.querySelector("#component-a-name").value;
  const componentAFile = document.querySelector("#component-a-file").value;
  const componentBName = document.querySelector("#component-b-name").value;
  const componentBFile = document.querySelector("#component-b-file").value;

  // Generate the ICD and display it on the page
  generateICD(
    componentAName,
    componentAFile,
    componentBName,
    componentBFile
  ).then((icd) => {
    const icdDiv = document.querySelector(".icd");
    icdDiv.innerHTML = icd;
  });
});
