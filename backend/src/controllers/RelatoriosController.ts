import { FastifyReply, FastifyRequest } from 'fastify';
import { reportService } from '../services/reportService';
import fs from 'fs';

export class RelatoriosController {
  async downloadLojas(request: FastifyRequest<{ Params: { format: string } }>, reply: FastifyReply) {
    const { format } = request.params;
    let filePath: string;

    try {
      if (format === 'pdf') {
        filePath = await reportService.generateLojasPdf();
        reply.header('Content-Type', 'application/pdf');
        reply.header('Content-Disposition', 'attachment; filename="lojas.pdf"');
      } else if (format === 'excel') {
        filePath = await reportService.generateLojasExcel();
        reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        reply.header('Content-Disposition', 'attachment; filename="lojas.xlsx"');
      } else {
        return reply.status(400).send({ error: 'Invalid format. Use pdf or excel.' });
      }

      const stream = fs.createReadStream(filePath);
      reply.send(stream);

      // Cleanup after sending (might need a better strategy for streams)
      stream.on('close', () => {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      });

    } catch (error) {
      console.error('Error generating report:', error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async downloadFinanceiro(request: FastifyRequest<{ Params: { format: string, tipo: string } }>, reply: FastifyReply) {
    const { format, tipo } = request.params;
    const tipoConta = tipo.toUpperCase() === 'RECEBER' ? 'RECEBER' : 'PAGAR';
    let filePath: string;

    try {
      if (format === 'pdf') {
        filePath = await reportService.generateFinanceiroPdf(tipoConta);
        reply.header('Content-Type', 'application/pdf');
        reply.header('Content-Disposition', `attachment; filename="financeiro_${tipoConta}.pdf"`);
      } else if (format === 'excel') {
        filePath = await reportService.generateFinanceiroExcel(tipoConta);
        reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        reply.header('Content-Disposition', `attachment; filename="financeiro_${tipoConta}.xlsx"`);
      } else {
        return reply.status(400).send({ error: 'Invalid format. Use pdf or excel.' });
      }

      const stream = fs.createReadStream(filePath);
      reply.send(stream);
      
      stream.on('close', () => {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      });

    } catch (error) {
      console.error('Error generating report:', error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
