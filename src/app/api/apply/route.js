import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb.js";
import RentalApplication from "../../../models/RentalApplication.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Upload base64 to Cloudinary
async function uploadToCloudinary(base64Data, folder, filename) {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: folder,
      public_id: filename,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
}

// Helper: Process documents - upload to Cloudinary and return URLs
async function processDocuments(documents, applicantId) {
  if (!documents || !Array.isArray(documents) || documents.length === 0) {
    return [];
  }

  const processedDocs = [];

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];

    // If already a URL (not base64), keep it
    if (doc.url && !doc.url.startsWith("data:")) {
      processedDocs.push({
        url: doc.url,
        type: doc.type || "unknown",
        name: doc.name || `document_${i + 1}`,
      });
      continue;
    }

    // Upload base64 to Cloudinary
    const base64Data = doc.url || doc.data;
    if (base64Data && base64Data.startsWith("data:")) {
      const timestamp = Date.now();
      const filename = `doc_${applicantId}_${i}_${timestamp}`;
      const uploadedUrl = await uploadToCloudinary(
        base64Data,
        "rental_documents",
        filename,
      );

      if (uploadedUrl) {
        processedDocs.push({
          url: uploadedUrl,
          type: doc.type || "unknown",
          name: doc.name || `document_${i + 1}`,
        });
      }
    }
  }

  return processedDocs;
}

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    // Enhanced validation
    if (!data.applicant1 || !data.applicant1.name) {
      return NextResponse.json(
        { error: "Applicant 1 name is required" },
        { status: 400 },
      );
    }

    // Validate required fields for applicant1
    const requiredFields = ["name", "email", "phoneHome"];
    for (const field of requiredFields) {
      if (!data.applicant1[field]) {
        return NextResponse.json(
          { error: `Applicant 1 ${field} is required` },
          { status: 400 },
        );
      }
    }

    // Generate a unique ID for this application
    const applicationId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);

    // Process and upload documents for applicant1
    console.log("Processing applicant1 documents...");
    const applicant1Docs = await processDocuments(
      data.applicant1.documents,
      `app1_${applicationId}`,
    );
    console.log(`Uploaded ${applicant1Docs.length} documents for applicant1`);

    // Process and upload documents for applicant2 if exists
    let applicant2Docs = [];
    if (data.applicant2 && data.applicant2.documents) {
      console.log("Processing applicant2 documents...");
      applicant2Docs = await processDocuments(
        data.applicant2.documents,
        `app2_${applicationId}`,
      );
      console.log(`Uploaded ${applicant2Docs.length} documents for applicant2`);
    }

    // Upload signature for applicant1 if exists
    let applicant1Signature = data.applicant1.signature || {
      dataURL: null,
      signedAt: null,
    };
    if (
      applicant1Signature.dataURL &&
      applicant1Signature.dataURL.startsWith("data:")
    ) {
      const sigUrl = await uploadToCloudinary(
        applicant1Signature.dataURL,
        "rental_signatures",
        `sig1_${applicationId}`,
      );
      if (sigUrl) {
        applicant1Signature = {
          dataURL: sigUrl,
          signedAt: applicant1Signature.signedAt,
        };
      }
    }

    // Upload signature for applicant2 if exists
    let applicant2Signature = null;
    if (
      data.applicant2?.signature?.dataURL &&
      data.applicant2.signature.dataURL.startsWith("data:")
    ) {
      const sigUrl = await uploadToCloudinary(
        data.applicant2.signature.dataURL,
        "rental_signatures",
        `sig2_${applicationId}`,
      );
      if (sigUrl) {
        applicant2Signature = {
          dataURL: sigUrl,
          signedAt: data.applicant2.signature.signedAt,
        };
      }
    }

    // Clean and structure the data with uploaded URLs
    const applicationData = {
      applicant1: {
        ...cleanApplicantData(data.applicant1),
        documents: applicant1Docs,
        signature: applicant1Signature,
      },
      applicant2: data.applicant2
        ? {
            ...cleanApplicantData(data.applicant2),
            documents: applicant2Docs,
            signature: applicant2Signature || data.applicant2.signature,
          }
        : null,
      otherOccupants: data.otherOccupants || [],
      pets: data.pets || "",
      waterFurniture: data.waterFurniture || "",
      vehicles: data.vehicles || [],
      delinquentHistory: data.delinquentHistory || "",
      evictionHistory: data.evictionHistory || "",
      applicationFee: data.applicationFee ? Number(data.applicationFee) : null,
    };

    // Save application to MongoDB
    console.log("Saving to MongoDB...");
    const created = await RentalApplication.create(applicationData);
    console.log("Application saved with ID:", created._id);

    // Generate PDF
    console.log("Generating PDF...");
    const pdfBytes = await createApplicationPDF(created);
    console.log("PDF generated, size:", pdfBytes.length);

    // Upload PDF to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "rental_applications",
          public_id: `application_${created._id}`,
          format: "pdf",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      stream.end(Buffer.from(pdfBytes));
    });

    // Save PDF URL to MongoDB
    created.pdfURL = uploadResult.secure_url;
    await created.save();
    console.log("PDF uploaded to:", uploadResult.secure_url);

    // Return PDF as attachment for download
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="rental-application-${created._id}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Apply route error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper function to clean applicant data (remove base64 from documents)
function cleanApplicantData(applicant) {
  return {
    name: applicant.name || "",
    ssn: applicant.ssn || "",
    dlNumber: applicant.dlNumber || "",
    dateOfBirth: applicant.dateOfBirth || null,
    phoneHome: applicant.phoneHome || "",
    phoneWork: applicant.phoneWork || "",
    email: applicant.email || "",
    employment: applicant.employment || {},
    rentalHistory: applicant.rentalHistory || {},
    banking: applicant.banking || {},
    personalReferences: applicant.personalReferences || [],
    // documents and signature are handled separately
  };
}

// Helper: generate a PDF with pdf-lib
async function createApplicationPDF(doc) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4 portrait
  const { width, height } = page.getSize();
  const margin = 40;
  let y = height - margin;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSizeTitle = 14;
  const fontSize = 10;
  const lineHeight = 14;

  const drawLine = (text, options = {}) => {
    if (y < margin + 20) {
      page = pdfDoc.addPage([595, 842]);
      y = page.getHeight() - margin;
    }
    page.drawText(text, {
      x: margin + (options.indent || 0),
      y,
      size: options.size || fontSize,
      font: options.font || font,
      color: options.color || rgb(0, 0, 0),
    });
    y -= lineHeight;
  };

  // Title
  page.drawText("RENTAL APPLICATION", {
    x: margin,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  const drawApplicant = (app, label) => {
    if (!app) return;

    drawLine(label, { size: fontSizeTitle, font: fontBold });
    const lines = [
      `Name: ${app.name || "Not provided"}`,
      `SSN: ${app.ssn || "Not provided"}`,
      `DL#: ${app.dlNumber || "Not provided"}`,
      `DOB: ${app.dateOfBirth && !isNaN(new Date(app.dateOfBirth)) ? new Date(app.dateOfBirth).toLocaleDateString() : "Not provided"}`,
      `Home Phone: ${app.phoneHome || "Not provided"}`,
      `Work Phone: ${app.phoneWork || "Not provided"}`,
      `Email: ${app.email || "Not provided"}`,
      `Employment: ${app.employment?.employer || "Not provided"} - ${app.employment?.position || ""}`,
      `Salary: ${app.employment?.salary || "Not provided"}`,
      `Present Address: ${app.rentalHistory?.presentAddress || "Not provided"}`,
      `Present Rent: $${app.rentalHistory?.presentAmountPaid || "Not provided"}`,
    ];
    lines.forEach((line) => drawLine(line));

    // Documents uploaded
    if (app.documents?.length > 0) {
      y -= 6;
      drawLine(`Documents Uploaded: ${app.documents.length} file(s)`, {
        font: fontBold,
      });
      app.documents.forEach((doc, index) => {
        const docName = doc.name || `Document ${index + 1}`;
        drawLine(`${index + 1}. ${docName}`, { indent: 8 });
      });
    }

    // Personal References
    if (app.personalReferences?.length > 0) {
      y -= 6;
      drawLine("Personal References:", { size: fontSizeTitle, font: fontBold });
      app.personalReferences.forEach((ref, index) => {
        drawLine(
          `${index + 1}. ${ref.name || ""} - ${ref.relationship || ""} - ${ref.phone || ""}`,
          { indent: 8 },
        );
      });
    }

    y -= 10;
  };

  // Draw applicants
  drawApplicant(doc.applicant1, "APPLICANT 1");
  drawApplicant(doc.applicant2, "APPLICANT 2");

  // Other occupants
  if (doc.otherOccupants?.length > 0) {
    drawLine("OTHER OCCUPANTS:", { size: fontSizeTitle, font: fontBold });
    doc.otherOccupants.forEach((oc, index) =>
      drawLine(
        `${index + 1}. ${oc.name || ""} — Age: ${oc.age || ""} — ${oc.relationship || ""}`,
        { indent: 8 },
      ),
    );
    y -= 10;
  }

  // Vehicles
  if (doc.vehicles?.length > 0) {
    drawLine("VEHICLES:", { size: fontSizeTitle, font: fontBold });
    doc.vehicles.forEach((v, index) =>
      drawLine(
        `${index + 1}. ${v.year || ""} ${v.make || ""} ${v.model || ""} — License: ${v.license || ""}`,
        { indent: 8 },
      ),
    );
    y -= 10;
  }

  // Additional Information
  const additionalInfo = [
    `Pets: ${doc.pets || "None"}`,
    `Water Furniture: ${doc.waterFurniture || "None"}`,
    `Delinquent History: ${doc.delinquentHistory || "None"}`,
    `Eviction History: ${doc.evictionHistory || "None"}`,
    `Application Fee: $${doc.applicationFee || "0"}`,
  ];

  drawLine("ADDITIONAL INFORMATION:", { size: fontSizeTitle, font: fontBold });
  additionalInfo.forEach((info) => drawLine(info, { indent: 8 }));
  y -= 20;

  // Signature indication (not embedding image from URL)
  if (doc.applicant1?.signature?.dataURL) {
    drawLine("Applicant 1 Signature: [SIGNED ELECTRONICALLY]", {
      font: fontBold,
    });
    if (doc.applicant1.signature.signedAt) {
      drawLine(
        `Signed at: ${new Date(doc.applicant1.signature.signedAt).toLocaleString()}`,
        { indent: 8 },
      );
    }
    y -= 10;
  }

  if (doc.applicant2?.signature?.dataURL) {
    drawLine("Applicant 2 Signature: [SIGNED ELECTRONICALLY]", {
      font: fontBold,
    });
    if (doc.applicant2.signature.signedAt) {
      drawLine(
        `Signed at: ${new Date(doc.applicant2.signature.signedAt).toLocaleString()}`,
        { indent: 8 },
      );
    }
    y -= 10;
  }

  // Footer
  const createdAt = new Date(doc.createdAt || Date.now()).toLocaleString();
  drawLine(`Application ID: ${doc._id}`, { size: 9 });
  page.drawText(`Submitted: ${createdAt}`, {
    x: margin + 300,
    y: 40,
    size: 9,
    font,
    color: rgb(0, 0, 0),
  });

  return await pdfDoc.save();
}
