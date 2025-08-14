document.addEventListener("DOMContentLoaded", () => {
  window.onload = () => {
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
      document.getElementById("mainContent").style.display = "block";
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

    const imageFiles = [];
    for (let i = 1; i <= 20; i++) {
      const file = formData.get(`img${i}`);
      if (file && file.type.startsWith("image/")) {
        imageFiles.push(file);
      }
    }

    // Generate PDF directly
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;
    const lineHeight = 8;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("COLLABORATION AGREEMENT", 105, y, { align: "center" });
    y += lineHeight * 2;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("LANEIGE SKIN CARE", 20, y); y += lineHeight;
    doc.text("Website: us.laneige.com", 20, y); y += lineHeight;
    doc.text("Instagram: @laneige_us", 20, y); y += lineHeight * 2;

    doc.setFont("helvetica", "bold");
    doc.text("Influencer Details", 20, y); y += lineHeight;
    doc.setFont("helvetica", "normal");
    doc.text(`Full Name: ${name}`, 20, y); y += lineHeight;
    doc.text(`Email Address: ${email}`, 20, y); y += lineHeight;
    doc.text(`Instagram Handle: ${insta}`, 20, y); y += lineHeight;
    doc.text(`Phone Number: ${phone}`, 20, y); y += lineHeight;
    doc.text(`Delivery Address: ${address}`, 20, y); y += lineHeight * 2;

    doc.setFont("helvetica", "bold");
    doc.text("Selected Product Screenshots:", 20, y); y += lineHeight;

    for (let i = 0; i < imageFiles.length; i++) {
      const imgData = await readFileAsDataURL(imageFiles[i]);
      if (y > 230) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "normal");
      doc.text(`Item ${i + 1}:`, 25, y);
      y += 4;
      doc.addImage(imgData, "JPEG", 25, y, 50, 50);
      y += 58;
    }

    y += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Summary", 20, y); y += lineHeight;
    doc.setFont("helvetica", "normal");
    doc.text(`Items Provided (${imageFiles.length}): $0`, 25, y);
    y += lineHeight;
    doc.text("Delivery Fee (Risk Management): $219", 25, y); y += lineHeight;
    doc.text("------------------------------------------------------", 25, y); y += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.text("Total Payable: $219", 25, y); y += lineHeight * 2;

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "By submitting this agreement, the influencer agrees to promote the brand’s products under the stated collaboration terms and conditions.",
      20, y,
      { maxWidth: 170 }
    );

    const safeName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    doc.save(`collaboration_agreement_${safeName}.pdf`, {
      returnPromise: true
    }).then(() => {
      // Show success page
      form.style.display = "none";
      document.getElementById("success").style.display = "block";

      const emailIcon = `<i class="fas fa-envelope"></i>`;
      const emailLink = document.getElementById("emailLink");
      emailLink.innerHTML = `${emailIcon} Send Email`;
      emailLink.href = `mailto:laneigeskincarecollaboration@gmail.com?subject=Collaboration Submission from ${name}&body=Hi LANEIGE,%0A%0AMy name is ${name} and I have completed the collaboration form and downloaded the agreement. Please find my attachment below.`;
    });
  });

  function readFileAsDataURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }
});
