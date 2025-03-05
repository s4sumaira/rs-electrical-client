// pdf-export.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { type SiteInduction } from '@/lib/types/induction';
import logoImage from '@/public/images/logo.png'; // Keep your logo import
import { DocumentStatus } from '@/lib/helpers/enum';
import { StaticImageData } from 'next/image'; // Import StaticImageData type

// Add TypeScript support for the autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

/**
 * Exports site induction data to a PDF file that matches the paper form layout
 * @param induction The site induction data to export
 */
export function exportInductionToPDF(induction: SiteInduction): void {
  // Create new PDF document (A4 format)
  const doc = new jsPDF();
  
  // Add the logo to the top left
  try {
    // For Next.js imported static images, we need to use the src property
    const logoSrc = (logoImage as StaticImageData).src;
    
    // Add logo directly
    doc.addImage(logoSrc, 'PNG', 20, 15, 70, 35);
    
    // Continue with the rest of the PDF generation after adding the logo
    generatePdfContent(doc, induction);
  } catch (error) {
    console.error('Error adding logo to PDF:', error);
    // Continue without the logo if there's an error
    generatePdfContent(doc, induction);
  }
}

/**
 * Generates the PDF content after handling the logo
 */
function generatePdfContent(doc: jsPDF, induction: SiteInduction): void {
  const pageWidth = doc.internal.pageSize.getWidth(); // Get page width

  doc.setFont("helvetica", "bold"); // Set font to bold
  doc.setFontSize(18);
  doc.setTextColor(0, 128, 128); // Set font color to teal

  // Right-align "Site Induction"
  let textWidth = doc.getTextWidth("Site Induction");
  doc.text("Site Induction", pageWidth - textWidth - 10, 25); // Align to right with 10px margin

  doc.setFontSize(16);

  // Right-align "Record Form"
  textWidth = doc.getTextWidth("Record Form");
  doc.text("Record Form", pageWidth - textWidth - 10, 35);
  
  let yPos = 60; // Start content below the logo/header area
  
  // Define the grey background color for labels
  const greyBgColor = [240, 240, 240]; // Light grey
  
  // Project Information Table
  doc.autoTable({
    startY: yPos,
    head: [['Project Name', 'Project Address', 'Inducted By', 'Induction Number']],
    body: [[
      induction.project?.name || '',
      induction.project?.fullAddress, // Project address not in data model
      induction.inductedBy?.fullName || '',
      induction.inductionNumber || ''
    ]],
    theme: 'grid',
    styles: { 
      halign: 'left',
      valign: 'middle',
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: { 
        fillColor: [0, 128, 128], 
        textColor: [255, 255, 255], 
        fontStyle: 'bold'
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Personal Details Table
  doc.autoTable({
    startY: yPos,
    head: [['Personal Details', '']],
    body: [
      [{ content:'Name', styles: { fontStyle: 'bold', fillColor: greyBgColor }},
       { content: 'Telephone Number', styles: { fontStyle: 'bold', fillColor: greyBgColor }}],
      [induction.inductedPerson?.fullName || '', ''],
      [{ content:'Company', styles: { fontStyle: 'bold', fillColor: greyBgColor }},
       { content: 'Trade', styles: { fontStyle: 'bold', fillColor: greyBgColor }}],
      ['', induction.trade || ''],
      [{ content:'Name of Emergency Contact', styles: { fontStyle: 'bold', fillColor: greyBgColor }},
       { content: 'Emergency Contact Phone Number', styles: { fontStyle: 'bold', fillColor: greyBgColor }}],
      [induction.emergencyContact?.name || '', induction.emergencyContact?.phoneNumber || ''],
      [{ content:'Name of Supervisor', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       induction.supervisedBy?.fullName || '']
    ],
    theme: 'grid',
    styles: { 
      halign: 'left', 
      valign: 'middle',
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: { 
        fillColor: [0, 128, 128],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 'auto' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Right to work 
  doc.autoTable({
    startY: yPos,
    head: [['Right to work in the UK', '', '']],
    body: [
      [{ content: '', styles: { fillColor: greyBgColor }}, 
       { content: 'Yes', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       { content: 'No', styles: { fontStyle: 'bold', fillColor: greyBgColor }}],
      [{ content: 'Do you have the right to work in the UK?', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.rightToWorkInUK ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.rightToWorkInUK ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'If No, please detail', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       { content: induction.rightToWorkDetails || '', colSpan: 2 }]
    ],
    theme: 'grid',
    styles: { 
      halign: 'left', 
      valign: 'middle',
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: { 
      fillColor: [0, 128, 128],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Check if we need to move to next page
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  
  // Occupational Health Table
  doc.autoTable({
    startY: yPos,
    head: [['Occupational Health', '', '']],
    body: [
      [{ content: '', styles: { fillColor: greyBgColor }}, 
       { content: 'Yes', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       { content: 'No', styles: { fontStyle: 'bold', fillColor: greyBgColor }}],
      [{ content: 'Do you suffer from any medical condition that may affect your or other safety or health whilst working', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.occupationalHealth?.hasCondition ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.occupationalHealth?.hasCondition ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'Epilepsy', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.occupationalHealth?.epilepsy ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.occupationalHealth?.epilepsy ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'Deafness', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.occupationalHealth?.deafness ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.occupationalHealth?.deafness ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'Asthma', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.occupationalHealth?.asthma ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.occupationalHealth?.asthma ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'Heart Conditions', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.occupationalHealth?.heartConditions ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.occupationalHealth?.heartConditions ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'If yes to any of the above, please detail below', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       { content: induction.occupationalHealth?.details || '', colSpan: 2 }],
      [{ content: 'Do you currently need to take any form of medication that may affect your or others health and safety whilst at work?', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.occupationalHealth?.requiresMedication ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.occupationalHealth?.requiresMedication ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'If yes, please detail below', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.occupationalHealth?.medicationDetails || '', colSpan: 2 }],
      [{ content: 'If applicable, have you undertaken an annual health and safety assessment for night time working?', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.occupationalHealth?.nightWorkAssessment ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.occupationalHealth?.nightWorkAssessment ? 'NO' : '', styles: { textColor: [255, 0, 0] }}]
    ],
    theme: 'grid',
    styles: { 
      halign: 'left', 
      valign: 'middle',
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak'
    },
    headStyles: { 
      fillColor: [0, 128, 128], 
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Check if we need a new page
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  
  // Compliance and Training Table
  doc.autoTable({
    startY: yPos,
    head: [['Compliance and Training', '', '']],
    body: [
      [{ content: '', styles: { fillColor: greyBgColor }}, 
       { content: 'Yes', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       { content: 'No', styles: { fontStyle: 'bold', fillColor: greyBgColor }}],
      [{ content: 'Do you have a CSCS / ECS Card or equivalent? (If yes please say which and provide your registration number)', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.compliance?.hasCSCSCard ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.compliance?.hasCSCSCard ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'Card Type:', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       { content: induction.compliance?.cardType || '', colSpan: 2 }],
      [{ content: 'Card Number:', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       { content: induction.compliance?.cardNumber || '', colSpan: 2 }],
      [{ content: 'Do you hold a current Asbestos Awareness Certificate?', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.compliance?.hasAsbestosAwareness ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.compliance?.hasAsbestosAwareness ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'If no, please advise when this will be completed by:', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, { 
        content: induction.compliance?.hasAsbestosAwareness ? '' : 
          (induction.compliance?.asbestosCompletionDate ? formatDate(induction.compliance.asbestosCompletionDate) : ''), 
        colSpan: 2 
      }],
      [{ content: 'Do you hold any other vocational or other safety training qualifications?', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.compliance?.hasOtherQualifications ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.compliance?.hasOtherQualifications ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'If yes, please detail:', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       { content: induction.compliance?.otherQualificationsDetails || '', colSpan: 2 }],
      [{ content: 'Are you under 18 years of age?', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.compliance?.isUnder18 ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.compliance?.isUnder18 ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'If yes, please state who your mentor is and provide your "young persons" risk assessment:', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, { 
        content: induction.compliance?.under18Details || '', 
        colSpan: 2 
      }]
    ],
    theme: 'grid',
    styles: { 
      halign: 'left', 
      valign: 'middle',
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak'
    },
    headStyles: { 
      fillColor: [0, 128, 128], // Teal green for header
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Check if we need a new page
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  
  // Documents Table
  if (induction.documents && induction.documents.length > 0) {
    doc.autoTable({
      startY: yPos,
      head: [['Document Type', 'File Name']],
      body: induction.documents.map(doc => [
        { content: doc.docType || 'Document', styles: { fontStyle: 'bold', fillColor: greyBgColor }},
        doc.fileName
      ]),
      theme: 'grid',
      styles: { 
        halign: 'left', 
        valign: 'middle',
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: { 
        fillColor: [0, 128, 128], 
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 'auto' }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    // Check if we need a new page
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
  }
  
  // Risk Assessment Table
  doc.autoTable({
    startY: yPos,
    head: [['Risk Assessment & Method Statement', '', '']],
    body: [
      [{ content: '', styles: { fillColor: greyBgColor }}, 
       { content: 'Yes', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       { content: 'No', styles: { fontStyle: 'bold', fillColor: greyBgColor }}],
      [{ content: 'Have you been briefed / trained in the RAMS and Safe Systems of Works appropriate to the works you will be carrying out on the project?', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.riskAssessment?.briefed ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.riskAssessment?.briefed ? 'NO' : '', styles: { textColor: [255, 0, 0] }}],
      [{ content: 'I have read, understood, and signed all required parts of the RAMS', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
        { content: induction.riskAssessment?.understood ? 'YES' : '', styles: { textColor: [0, 128, 0] }}, 
        { content: !induction.riskAssessment?.understood ? 'NO' : '', styles: { textColor: [255, 0, 0] }}]
    ],
    theme: 'grid',
    styles: { 
      halign: 'left', 
      valign: 'middle',
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak'
    },
    headStyles: { 
      fillColor: [0, 128, 128], // Teal green for header
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 130 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' }
    }
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Confirmation Table
  doc.autoTable({
    startY: yPos,
    head: [['Confirmation', '', '']],
    body: [
      [{ content: 'Name', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       { content: 'Signature', styles: { fontStyle: 'bold', fillColor: greyBgColor }}, 
       { content: 'Date', styles: { fontStyle: 'bold', fillColor: greyBgColor }}],
      [
        induction.inductedPerson?.fullName || '', 
        '', // Signature will be added below if available
        induction.confirmation?.signedAt ? formatDate(induction.confirmation.signedAt) : ''
      ]
    ],
    theme: 'grid',
    styles: { 
      halign: 'left', 
      valign: 'middle',
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: { 
        fillColor: [0, 128, 128], // Teal green for header
        textColor: [255, 255, 255],
        fontStyle: 'bold'
    }
  });
  
  // Add signature if available
  if (induction.confirmation?.signature) {
    try {
      // Position signature in the middle cell of the last row
      const signatureY = (doc as any).lastAutoTable.finalY - 15; // Adjust based on table cell height
      const signatureX = 105; // Middle of the page
      doc.addImage(induction.confirmation.signature, 'PNG', signatureX - 25, signatureY, 50, 15);
    } catch (e) {
      console.error('Error adding signature to PDF:', e);
    }
  }
  
  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    const pageWidth = doc.internal.pageSize.getWidth(); // Get page width

    doc.setPage(i);
    doc.setFontSize(10);
    
    // Define texts
    const pageNumberText = `Page ${i} of ${pageCount}`;
    const printedDateText = `Printed on: ${new Date().toLocaleString()}`;
    
    // Center-align the "Printed on" text
    doc.text(printedDateText, pageWidth / 2, 285, { align: 'center' });
    
    // Right-align the page number
    const pageNumberWidth = doc.getTextWidth(pageNumberText);
    doc.text(pageNumberText, pageWidth - pageNumberWidth - 10, 285);
  }
  
  // Add status watermark based on induction status
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(220, 220, 220); // Light gray for watermark
    doc.setFontSize(40);
    doc.text(induction.status || 'DRAFT', 105, 150, { 
      align: 'center',
      angle: 45
    });
    doc.setTextColor(0, 0, 0); // Reset text color
  }
  
  // Save the PDF with a meaningful filename
  const fileName = `Site_Induction_${induction.inductionNumber || induction.inductedPerson?.fullName || 'Form'}.pdf`;
  doc.save(fileName);
}

// Helper function for date formatting
function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (error) {
    return String(dateString) || '';
  }
}