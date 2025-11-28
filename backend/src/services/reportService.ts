import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma';

export class ReportService {
  
  // --- PDF GENERATION ---

  async generateLojasPdf(): Promise<string> {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, '../../temp', `lojas_report_${Date.now()}.pdf`);
    
    // Ensure temp dir exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('Relatório de Lojas', { align: 'center' });
    doc.moveDown();

    const lojas = await prisma.loja.findMany();

    lojas.forEach(loja => {
      doc.fontSize(12).text(`Nome: ${loja.nome}`);
      doc.text(`Documento: ${loja.documento || 'N/A'}`);
      doc.text(`Status: ${loja.status ? 'Ativo' : 'Inativo'}`);
      doc.moveDown();
    });

    doc.end();

    return new Promise((resolve) => {
      stream.on('finish', () => resolve(filePath));
    });
  }

  async generateFinanceiroPdf(tipo: 'RECEBER' | 'PAGAR'): Promise<string> {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, '../../temp', `financeiro_${tipo}_${Date.now()}.pdf`);

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text(`Relatório Financeiro - Contas a ${tipo === 'RECEBER' ? 'Receber' : 'Pagar'}`, { align: 'center' });
    doc.moveDown();

    let contas;
    if (tipo === 'RECEBER') {
      contas = await prisma.contaReceber.findMany();
    } else {
      contas = await prisma.contaPagar.findMany();
    }

    contas.forEach((conta: any) => {
      doc.fontSize(12).text(`Descrição: ${conta.descricao || 'N/A'}`);
      doc.text(`Valor: R$ ${Number(conta.valor || conta.valor_total).toFixed(2)}`);
      doc.text(`Vencimento: ${new Date(conta.data_vencimento).toLocaleDateString()}`);
      doc.text(`Status: ${conta.status}`);
      doc.moveDown();
    });

    doc.end();

    return new Promise((resolve) => {
      stream.on('finish', () => resolve(filePath));
    });
  }

  // --- EXCEL GENERATION ---

  async generateLojasExcel(): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Lojas');

    worksheet.columns = [
      { header: 'Nome', key: 'nome', width: 30 },
      { header: 'Documento', key: 'documento', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Status', key: 'status', width: 10 },
    ];

    const lojas = await prisma.loja.findMany();

    lojas.forEach(loja => {
      worksheet.addRow({
        nome: loja.nome,
        documento: loja.documento,
        email: loja.email,
        status: loja.status ? 'Ativo' : 'Inativo',
      });
    });

    const filePath = path.join(__dirname, '../../temp', `lojas_report_${Date.now()}.xlsx`);
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }

  async generateFinanceiroExcel(tipo: 'RECEBER' | 'PAGAR'): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Contas a ${tipo === 'RECEBER' ? 'Receber' : 'Pagar'}`);

    worksheet.columns = [
      { header: 'Descrição', key: 'descricao', width: 30 },
      { header: 'Valor', key: 'valor', width: 15 },
      { header: 'Vencimento', key: 'vencimento', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    let contas;
    if (tipo === 'RECEBER') {
      contas = await prisma.contaReceber.findMany();
    } else {
      contas = await prisma.contaPagar.findMany();
    }

    contas.forEach((conta: any) => {
      worksheet.addRow({
        descricao: conta.descricao,
        valor: Number(conta.valor || conta.valor_total),
        vencimento: new Date(conta.data_vencimento).toLocaleDateString(),
        status: conta.status,
      });
    });

    const filePath = path.join(__dirname, '../../temp', `financeiro_${tipo}_${Date.now()}.xlsx`);
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }
}

export const reportService = new ReportService();
