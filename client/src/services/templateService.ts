import { Template, DEFAULT_TEMPLATE } from '@/lib/template-types';

const TEMPLATES_STORAGE_KEY = 'document_templates_v2';

function ensureDefaultTemplate(templates: Template[]): Template[] {
  const hasDefault = templates.some(t => t.id === 'default');
  return hasDefault ? templates : [DEFAULT_TEMPLATE, ...templates];
}

export async function getTemplates(): Promise<Template[]> {
  if (typeof window === 'undefined') return [DEFAULT_TEMPLATE];
  
  try {
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    const templates = saved ? JSON.parse(saved) : [DEFAULT_TEMPLATE];
    return ensureDefaultTemplate(templates);
  } catch (error) {
    console.error('Error loading templates:', error);
    return [DEFAULT_TEMPLATE];
  }
}

export async function getTemplate(id: string): Promise<Template | undefined> {
  const templates = await getTemplates();
  return templates.find(t => t.id === id) || DEFAULT_TEMPLATE;
}

export async function saveTemplate(template: Partial<Template>): Promise<Template> {
  const templates = await getTemplates();
  const now = new Date().toISOString();
  
  const templateToSave: Template = {
    ...template,
    id: template.id || `tpl-${Date.now()}`,
    updatedAt: now,
    createdAt: template.createdAt || now,
    sections: template.sections || [],
    styles: template.styles || {},
    variables: template.variables || []
  } as Template;
  
  const existingIndex = templates.findIndex(t => t.id === templateToSave.id);
  
  if (existingIndex >= 0) {
    templates[existingIndex] = templateToSave;
  } else {
    templates.push(templateToSave);
  }
  
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  return templateToSave;
}

export async function deleteTemplate(id: string): Promise<void> {
  if (id === 'default') {
    throw new Error('Não é possível excluir o template padrão');
  }
  
  const templates = await getTemplates();
  const filtered = templates.filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
}

export async function duplicateTemplate(id: string, newName: string): Promise<Template> {
  const template = await getTemplate(id);
  if (!template) {
    throw new Error('Template não encontrado');
  }
  
  const newTemplate = {
    ...template,
    id: `tpl-${Date.now()}`,
    name: newName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return saveTemplate(newTemplate);
}
