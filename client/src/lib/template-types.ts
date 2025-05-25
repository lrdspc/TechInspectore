export interface Template {
  id: string;
  name: string;
  sections: TemplateSection[];
  styles: {
    [key: string]: string;
  };
  variables?: TemplateVariable[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  content: string;
  order: number;
  style?: string;
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: string[];
  required?: boolean;
  defaultValue?: any;
  section?: string;
}

export const DEFAULT_TEMPLATE: Template = {
  id: 'default',
  name: 'Modelo Padrão',
  sections: [
    {
      id: 'header',
      title: 'Cabeçalho',
      content: 'RELATÓRIO DE VISTORIA TÉCNICA\n\nProtocolo: {{inspection.protocolNumber}}\nData: {{date}}',
      order: 0
    },
    {
      id: 'client-info',
      title: 'Informações do Cliente',
      content: 'Cliente: {{client.name}}\nContato: {{client.contactName}}\nTelefone: {{client.contactPhone}}\nE-mail: {{client.email}}',
      order: 1
    },
    {
      id: 'inspection-details',
      title: 'Detalhes da Vistoria',
      content: 'Local: {{project.location}}\nData: {{inspection.scheduledDate}}\nTécnico: {{inspection.technician}}',
      order: 2
    },
    {
      id: 'conclusion',
      title: 'Conclusão',
      content: '{{inspection.conclusion}}',
      order: 3
    }
  ],
  styles: {},
  variables: [
    {
      key: 'inspection.conclusion',
      label: 'Conclusão',
      type: 'text',
      required: true,
      section: 'conclusion'
    },
    {
      key: 'inspection.technician',
      label: 'Nome do Técnico',
      type: 'text',
      required: true,
      section: 'inspection-details'
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
