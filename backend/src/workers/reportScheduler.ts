import cron from 'node-cron';
import { reportService } from '../services/reportService';
import { emailService } from '../services/emailService';
import fs from 'fs';

export class ReportScheduler {
  
  start() {
    // Daily Report at 18:00
    cron.schedule('0 18 * * *', async () => {
      console.log('Running Daily Report Job...');
      await this.sendDailyReport();
    });

    // Weekly Report on Friday at 18:00
    cron.schedule('0 18 * * 5', async () => {
      console.log('Running Weekly Report Job...');
      await this.sendWeeklyReport();
    });

    console.log('Report Scheduler started.');
  }

  async sendDailyReport() {
    try {
      const pdfPath = await reportService.generateLojasPdf();
      const excelPath = await reportService.generateLojasExcel();
      
      const emailDestino = process.env.EMAIL_DESTINO_RELATORIOS;
      if (!emailDestino) {
        console.warn('EMAIL_DESTINO_RELATORIOS not set. Skipping email.');
        return;
      }

      await emailService.sendEmail({
        to: emailDestino,
        subject: 'Relatório Diário - Lojas',
        html: '<p>Segue em anexo o relatório diário de lojas.</p>',
        attachments: [
          { filename: 'lojas_diario.pdf', path: pdfPath },
          { filename: 'lojas_diario.xlsx', path: excelPath },
        ],
      });

      // Cleanup
      fs.unlinkSync(pdfPath);
      fs.unlinkSync(excelPath);

    } catch (error) {
      console.error('Error sending daily report:', error);
    }
  }

  async sendWeeklyReport() {
    // Similar logic for weekly reports, maybe different content
    try {
      const pdfPath = await reportService.generateFinanceiroPdf('RECEBER');
      
      const emailDestino = process.env.EMAIL_DESTINO_RELATORIOS;
      if (!emailDestino) return;

      await emailService.sendEmail({
        to: emailDestino,
        subject: 'Relatório Semanal - Financeiro',
        html: '<p>Segue em anexo o relatório financeiro semanal.</p>',
        attachments: [
          { filename: 'financeiro_semanal.pdf', path: pdfPath },
        ],
      });

      fs.unlinkSync(pdfPath);
    } catch (error) {
      console.error('Error sending weekly report:', error);
    }
  }
}

export const reportScheduler = new ReportScheduler();
