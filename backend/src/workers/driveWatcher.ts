import cron from 'node-cron';
import { googleDriveService } from '../services/googleDriveService';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

export class DriveWatcher {
  private folderId: string;

  constructor() {
    this.folderId = process.env.DRIVE_FOLDER_ID || '';
    if (!this.folderId) {
      console.warn('DRIVE_FOLDER_ID not configured. Drive Watcher will not run.');
    }
  }

  start() {
    if (!this.folderId) return;

    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      console.log('Running Drive Watcher...');
      await this.processNewFiles();
    });
    
    console.log('Drive Watcher started.');
  }

  async processNewFiles() {
    try {
      const files = await googleDriveService.listFiles(this.folderId);
      
      for (const file of files) {
        if (file.mimeType === 'application/pdf') {
          await this.processFile(file);
        }
      }
    } catch (error) {
      console.error('Error in Drive Watcher:', error);
    }
  }

  async processFile(file: any) {
    // Check if file already processed (you might want to store processed file IDs in DB)
    // For now, we'll assume we move processed files or check by name/date logic
    // Simplified: Download -> Parse -> Save -> Log

    const sanitizedFileName = file.name.replace(/[^a-z0-9.]/gi, '_');
    const tempPath = path.join(__dirname, '../../temp', sanitizedFileName);
    
    if (!fs.existsSync(path.dirname(tempPath))) {
      fs.mkdirSync(path.dirname(tempPath), { recursive: true });
    }

    try {
      console.log(`Processing file: ${file.name}`);
      await googleDriveService.downloadFile(file.id, tempPath);
      
      const dataBuffer = fs.readFileSync(tempPath);
      const data = await pdf(dataBuffer);
      
      const extractedData = this.extractDataFromPdf(data.text);
      
      if (extractedData) {
        await this.saveVistoria(extractedData, file.id);
        console.log(`Vistoria saved for file: ${file.name}`);
        
        // Optional: Move file to "Processed" folder
        // await googleDriveService.moveFile(file.id, 'PROCESSED_FOLDER_ID');
      }

      // Cleanup
      fs.unlinkSync(tempPath);

    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }
  }

  extractDataFromPdf(text: string) {
    // Implement regex or logic to extract Placa, Valor, Data, etc.
    // This is highly dependent on the PDF layout.
    // Example placeholder logic:
    
    const placaMatch = text.match(/[A-Z]{3}-\d{4}|[A-Z]{3}\d[A-Z]\d{2}/);
    const valorMatch = text.match(/R\$\s?([\d,.]+)/);
    
    if (placaMatch) {
      return {
        placa: placaMatch[0],
        valor: valorMatch ? parseFloat(valorMatch[1].replace('.', '').replace(',', '.')) : 0,
        // Add more fields as needed
      };
    }
    
    return null;
  }

  async saveVistoria(data: any, fileId: string) {
    // Find a default perito or logic to assign
    const defaultPerito = await prisma.perito.findFirst();
    
    if (!defaultPerito) {
      console.error('No perito found to assign vistoria.');
      return;
    }

    await prisma.servico.create({
      data: {
        data_hora: new Date(),
        placa_veiculo: data.placa,
        tipo: 'pericia', // Default or extracted
        valor: data.valor,
        status_pagamento: 'em_aberto',
        drive_file_id: fileId,
        perito_id: defaultPerito.id,
        // Add other required fields
      }
    });
  }
}

export const driveWatcher = new DriveWatcher();
