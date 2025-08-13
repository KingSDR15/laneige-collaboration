document.addEventListener("DOMContentLoaded", () => {
  // Loader fade-out
  window.onload = () => {
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
      document.getElementById("mainContent").style.display = "block";
      window.scrollTo(0, 0);
    }, 1200);
  };

  const form = document.getElementById("collabForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const insta = formData.get("insta").trim();
    const phone = formData.get("phone").trim();
    const address = formData.get("address").trim();

    // Collect only valid image files
    const imageFiles = [];
    for (let i = 1; i <= 8; i++) {
      const file = formData.get(`img${i}`);
      if (file && file.type && file.type.startsWith("image/")) {
        imageFiles.push(file);
      }
    }

    // Fill preview modal
    document.getElementById("previewName").textContent = name || "—";
    document.getElementById("previewInsta").textContent = insta || "—";
    document.getElementById("previewEmail").textContent = email || "—";

    const imgContainer = document.getElementById("previewImages");
    imgContainer.innerHTML = "";

    for (let file of imageFiles) {
      const dataURL = await readFileAsDataURL(file);
      const imgEl = document.createElement("img");
      imgEl.src = dataURL;
      imgEl.className = "preview-thumb";
      imgEl.loading = "lazy";
      imgContainer.appendChild(imgEl);
    }

    // Store form data for download
    window.previewData = { name, email, insta, phone, address, imageFiles };

    // Show modal and ensure it's scrollable on small screens
    const modal = document.getElementById("previewModal");
    modal.style.display = "flex";
    modal.scrollTop = 0;
    document.body.style.overflow = "hidden"; // Prevent background scroll
  });

  // Cancel preview
  document.getElementById("cancelPreview").addEventListener("click", () => {
    closePreviewModal();
  });

  // Confirm download
  document.getElementById("confirmDownload").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = window.previewData;
    let y = 20;
    const lineHeight = 8;

    // Title
    doc.setFontSize(16).setFont("helvetica", "bold");
    doc.text("COLLABORATION AGREEMENT", 105, y, { align: "center" });
    y += lineHeight * 2;

    // Brand Info
    doc.setFontSize(12).setFont("helvetica", "normal");
    doc.text("Clothing Brand: LANEIGE", 20, y); y += lineHeight;
    doc.text("Website: us.laneige.com", 20, y); y += lineHeight;
    doc.text("Instagram: @laneige_us", 20, y); y += lineHeight * 2;

    // Influencer details
    doc.setFont("helvetica", "bold").text("Influencer Details", 20, y); y += lineHeight;
    doc.setFont("helvetica", "normal");
    doc.text(`Full Name: ${data.name}`, 20, y); y += lineHeight;
    doc.text(`Email Address: ${data.email}`, 20, y); y += lineHeight;
    doc.text(`Instagram Handle: ${data.insta}`, 20, y); y += lineHeight;
    doc.text(`Phone Number: ${data.phone}`, 20, y); y += lineHeight;
    doc.text(`Delivery Address: ${data.address}`, 20, y); y += lineHeight * 2;

    // Images
    doc.setFont("helvetica", "bold").text("Selected Product Screenshots:", 20, y); y += lineHeight;
    for (let i = 0; i < data.imageFiles.length; i++) {
      const imgData = await readFileAsDataURL(data.imageFiles[i]);
      if (y > 230) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "normal").text(`Item ${i + 1}:`, 25, y);
      y += 4;
      doc.addImage(imgData, "JPEG", 25, y, 50, 50);
      y += 58;
    }

    // Invoice summary
    y += lineHeight;
    doc.setFont("helvetica", "bold").text("Invoice Summary", 20, y); y += lineHeight;
    doc.setFont("helvetica", "normal");
    doc.text("Items Provided (8): $0", 25, y); y += lineHeight;
    doc.text("Delivery Fee (Risk Management): $219", 25, y); y += lineHeight;
    doc.text("------------------------------------------------------", 25, y); y += lineHeight;
    doc.setFont("helvetica", "bold").text("Total Payable: $219", 25, y); y += lineHeight * 2;

    // Terms
    doc.setFontSize(10).setFont("helvetica", "italic").text(
      "By submitting this agreement, the influencer agrees to promote the brand’s products under the stated collaboration terms and conditions.",
      20, y,
      { maxWidth: 170 }
    );

    // Save PDF then show success
    const safeName = data.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    doc.save(`collaboration_agreement_${safeName}.pdf`, { returnPromise: true })
       .then(() => afterDownloadSuccess(data));
  });

  function afterDownloadSuccess(data) {
    closePreviewModal();
    form.style.display = "none";
    document.getElementById("success").style.display = "block";
    const message = encodeURIComponent(
      `Hi POSSE,\n\nMy name is ${data.name} and I have completed the collaboration form and downloaded the agreement. Please find my attachment below.`
    );
    document.getElementById("emailLink").href =
      `mailto:laneigeskincarecollaboration@gmail.com?subject=Collaboration Submission from ${data.name}&body=${message}`;
  }

  function closePreviewModal() {
    const modal = document.getElementById("previewModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }
});
