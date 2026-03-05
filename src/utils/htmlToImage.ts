import html2canvas from 'html2canvas';

export async function htmlToImage(element: HTMLElement, fileName: string, params: Object = {}): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff',
      ...params,
    });

    const imageUrl = canvas.toDataURL('image/png', 1.0);

    const link = document.createElement('a');
    link.download = fileName;
    link.href = imageUrl;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}
// const { handlePrint } = useVueToPrint({
//   content: printRef,
//   documentTitle: '',
//   removeAfterPrint: true,
//   pageStyle: `
//   body {
//     min-width: 210mm !important; /* 适配A4宽度 */
//   }
// `,
// });
// handlePrint();
