import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { WorksheetResponse } from '@/types/worksheet';
import html2canvas from 'html2canvas';

export const exportToPDF = async (worksheet: WorksheetResponse, elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found for PDF export');
      throw new Error('Worksheet content not found');
    }

    // Hide export buttons during capture
    const exportButtons = document.querySelectorAll('.export-buttons, .no-print');
    exportButtons.forEach(btn => {
      (btn as HTMLElement).style.display = 'none';
    });

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    // Restore export buttons
    exportButtons.forEach(btn => {
      (btn as HTMLElement).style.display = '';
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate dimensions to fit page
    const ratio = Math.min(pdfWidth / imgWidth * 72/25.4, pdfHeight / imgHeight * 72/25.4);
    const imgScaledWidth = imgWidth * ratio * 25.4/72;
    const imgScaledHeight = imgHeight * ratio * 25.4/72;
    
    // Center the image
    const x = (pdfWidth - imgScaledWidth) / 2;
    const y = 10; // Small top margin
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', x, y, imgScaledWidth, imgScaledHeight);
    
    // If content is too tall, split into multiple pages
    if (imgScaledHeight > pdfHeight - 20) {
      const pageCount = Math.ceil(imgScaledHeight / (pdfHeight - 20));
      for (let i = 1; i < pageCount; i++) {
        pdf.addPage();
        const currentY = y - (i * (pdfHeight - 20));
        pdf.addImage(imgData, 'PNG', x, currentY, imgScaledWidth, imgScaledHeight);
      }
    }

    // Save the PDF
    pdf.save(`${worksheet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    
  } catch (error) {
    console.error('PDF export error:', error);
    // Fallback to simple text-based PDF
    return exportToPDFSimple(worksheet);
  }
};

// Fallback simple PDF export
const exportToPDFSimple = (worksheet: WorksheetResponse) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(worksheet.title, margin, yPosition);
  yPosition += 15;

  // Instructions
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const splitInstructions = pdf.splitTextToSize(worksheet.instructions, pageWidth - 2 * margin);
  pdf.text(splitInstructions, margin, yPosition);
  yPosition += splitInstructions.length * 5 + 10;

  // Questions
  worksheet.questions.forEach((question, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }

    // Question text
    pdf.setFont('helvetica', 'bold');
    const questionText = `${index + 1}. ${question.question} (${question.points} points)`;
    const splitQuestion = pdf.splitTextToSize(questionText, pageWidth - 2 * margin);
    pdf.text(splitQuestion, margin, yPosition);
    yPosition += splitQuestion.length * 5 + 5;

    pdf.setFont('helvetica', 'normal');

    // Handle different question types
    if (question.type === 'multiple-choice' && question.options) {
      question.options.forEach((option, optIndex) => {
        const optionText = `${String.fromCharCode(65 + optIndex)}. ${option}`;
        pdf.text(optionText, margin + 10, yPosition);
        yPosition += 6;
      });
    } else if (question.type === 'fill-blank') {
      pdf.text('_'.repeat(30), margin + 10, yPosition);
      yPosition += 10;
    } else if (question.type === 'short-answer') {
      // Add lines for short answer
      for (let i = 0; i < 3; i++) {
        pdf.line(margin + 10, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
      }
    } else if (question.type === 'true-false') {
      pdf.text('True ☐    False ☐', margin + 10, yPosition);
      yPosition += 10;
    }

    yPosition += 5;
  });

  // Answer Key (on new page)
  if (worksheet.answerKey && worksheet.answerKey.length > 0) {
    pdf.addPage();
    yPosition = margin;
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Answer Key', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    worksheet.answerKey.forEach((answer, index) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }

      const answerText = `${index + 1}. ${Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}`;
      const splitAnswer = pdf.splitTextToSize(answerText, pageWidth - 2 * margin);
      pdf.text(splitAnswer, margin, yPosition);
      yPosition += splitAnswer.length * 5;

      if (answer.explanation) {
        pdf.setFont('helvetica', 'italic');
        const splitExplanation = pdf.splitTextToSize(`Explanation: ${answer.explanation}`, pageWidth - 2 * margin);
        pdf.text(splitExplanation, margin + 10, yPosition);
        yPosition += splitExplanation.length * 5;
        pdf.setFont('helvetica', 'normal');
      }
      yPosition += 5;
    });
  }

  pdf.save(`${worksheet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
};

export const exportToDocx = async (worksheet: WorksheetResponse) => {
  const children: any[] = [];

  // Title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: worksheet.title,
          bold: true,
          size: 32,
        }),
      ],
      heading: HeadingLevel.TITLE,
    })
  );

  // Instructions
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Instructions:",
          bold: true,
          size: 24,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: worksheet.instructions,
          size: 22,
        }),
      ],
    })
  );

  children.push(new Paragraph({ text: "" })); // Empty line

  // Questions
  worksheet.questions.forEach((question, index) => {
    // Question text
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${question.question} (${question.points} points)`,
            bold: true,
            size: 22,
          }),
        ],
      })
    );

    // Handle different question types
    if (question.type === 'multiple-choice' && question.options) {
      question.options.forEach((option, optIndex) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${String.fromCharCode(65 + optIndex)}. ${option}`,
                size: 20,
              }),
            ],
          })
        );
      });
    } else if (question.type === 'fill-blank') {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "_".repeat(30),
              size: 20,
            }),
          ],
        })
      );
    } else if (question.type === 'short-answer') {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "\n\n\n",
              size: 20,
            }),
          ],
        })
      );
    } else if (question.type === 'true-false') {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "True ☐    False ☐",
              size: 20,
            }),
          ],
        })
      );
    }

    children.push(new Paragraph({ text: "" })); // Empty line between questions
  });

  // Answer Key
  if (worksheet.answerKey && worksheet.answerKey.length > 0) {
    children.push(new Paragraph({ text: "" })); // Page break simulation
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Answer Key",
            bold: true,
            size: 28,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
      })
    );

    worksheet.answerKey.forEach((answer, index) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. ${Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}`,
              bold: true,
              size: 20,
            }),
          ],
        })
      );

      if (answer.explanation) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Explanation: ${answer.explanation}`,
                italics: true,
                size: 18,
              }),
            ],
          })
        );
      }

      children.push(new Paragraph({ text: "" })); // Empty line
    });
  }

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${worksheet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;
  saveAs(blob, filename);
};
