import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { Inspection, Client, Project, Evidence } from '../shared/schema';

export interface ReportData {
  inspection: Inspection;
  client: Client;
  project: Project;
  evidences: Evidence[];
}

export async function generateInspectionReport(data: ReportData): Promise<Buffer> {
  const { inspection, client, project, evidences } = data;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Cabeçalho
        new Paragraph({
          children: [
            new TextRun({
              text: "RELATÓRIO DE VISTORIA TÉCNICA BRASILIT",
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400,
          },
        }),

        // Número do protocolo
        new Paragraph({
          children: [
            new TextRun({
              text: `Protocolo: ${inspection.protocolNumber}`,
              bold: true,
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 600,
          },
        }),

        // Data da vistoria
        new Paragraph({
          children: [
            new TextRun({
              text: `Data da Vistoria: ${inspection.scheduledDate ? new Date(inspection.scheduledDate).toLocaleDateString('pt-BR') : 'Não agendada'}`,
              size: 22,
            }),
          ],
          spacing: {
            after: 300,
          },
        }),

        // Seção: Informações do Cliente
        new Paragraph({
          children: [
            new TextRun({
              text: "INFORMAÇÕES DO CLIENTE",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 400,
            after: 200,
          },
        }),

        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Nome:", bold: true })],
                    }),
                  ],
                  width: { size: 30, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: client.name || '-' })],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Contato:", bold: true })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: client.contactName || '-' })],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Telefone:", bold: true })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: client.contactPhone || '-' })],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "E-mail:", bold: true })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: client.email || '-' })],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // Seção: Informações do Empreendimento
        new Paragraph({
          children: [
            new TextRun({
              text: "INFORMAÇÕES DO EMPREENDIMENTO",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 400,
            after: 200,
          },
        }),

        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Nome do Projeto:", bold: true })],
                    }),
                  ],
                  width: { size: 30, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: project.name || '-' })],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Endereço:", bold: true })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: project.address || '-' })],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Cidade:", bold: true })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: project.city || '-' })],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Estado:", bold: true })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: project.state || '-' })],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // Seção: Detalhes da Inspeção
        new Paragraph({
          children: [
            new TextRun({
              text: "DETALHES DA INSPEÇÃO",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 400,
            after: 200,
          },
        }),

        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Produto:", bold: true })],
                    }),
                  ],
                  width: { size: 30, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: inspection.roofModel || '-' })],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Quantidade:", bold: true })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: `${inspection.quantity || '-'} unidades` })],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Área:", bold: true })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: `${inspection.area || '-'} m²` })],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "Data de Instalação:", bold: true })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ 
                        text: inspection.installationDate 
                          ? new Date(inspection.installationDate).toLocaleDateString('pt-BR') 
                          : '-' 
                      })],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // Seção: Análise Técnica
        new Paragraph({
          children: [
            new TextRun({
              text: "ANÁLISE TÉCNICA",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 400,
            after: 200,
          },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: inspection.technicalAnalysis 
                ? JSON.stringify(inspection.technicalAnalysis, null, 2)
                : 'Nenhuma análise técnica registrada.',
            }),
          ],
          spacing: {
            after: 300,
          },
        }),

        // Seção: Conclusão
        new Paragraph({
          children: [
            new TextRun({
              text: "CONCLUSÃO",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 400,
            after: 200,
          },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: inspection.conclusion || 'Sem conclusão registrada',
            }),
          ],
          spacing: {
            after: 300,
          },
        }),

        // Seção: Recomendações
        new Paragraph({
          children: [
            new TextRun({
              text: "RECOMENDAÇÕES",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 400,
            after: 200,
          },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: inspection.recommendation || 'Sem recomendações registradas',
            }),
          ],
          spacing: {
            after: 600,
          },
        }),

        // Evidências
        new Paragraph({
          children: [
            new TextRun({
              text: "EVIDÊNCIAS",
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 400,
            after: 200,
          },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: evidences.length > 0 
                ? `${evidences.length} evidência(s) anexada(s) a esta vistoria.`
                : 'Nenhuma evidência anexada.',
            }),
          ],
          spacing: {
            after: 300,
          },
        }),

        // Rodapé
        new Paragraph({
          children: [
            new TextRun({
              text: "Assinatura: ______________________",
              bold: true,
            }),
          ],
          spacing: {
            before: 800,
            after: 300,
          },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: `Documento gerado em ${new Date().toLocaleString('pt-BR')}`,
              size: 18,
              italics: true,
            }),
          ],
          spacing: {
            after: 200,
          },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: `Para validar este documento, acesse www.brasilit.com.br/validar e informe o código ${inspection.protocolNumber}`,
              size: 18,
              italics: true,
            }),
          ],
        }),
      ],
    }],
  });

  return await Packer.toBuffer(doc);
}