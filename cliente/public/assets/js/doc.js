document.querySelector("#pdfFile").addEventListener("change", () => {
  let pdfFile = document.querySelector("#pdfFile").files[0];
  let pdfFileURL = URL.createObjectURL(pdfFile) + "#toolbar=0";

  console.log(pdfFile);

  document.querySelector("#vistaPrevia").setAttribute("src", pdfFileURL);
});
