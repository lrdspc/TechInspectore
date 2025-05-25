import { useState, useEffect, useCallback } from 'react';
import { Template } from '@/lib/template-types';
import { getTemplates, getTemplate, saveTemplate, deleteTemplate, duplicateTemplate } from '@/services/templateService';

export function useTemplate(templateId?: string) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar todos os templates
  const loadTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getTemplates();
      setTemplates(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Failed to load templates:', err);
      setError(err instanceof Error ? err : new Error('Failed to load templates'));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar um template específico
  const loadTemplate = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const data = await getTemplate(id);
      if (data) {
        setCurrentTemplate(data);
      } else {
        setCurrentTemplate(null);
      }
      setError(null);
      return data ?? null;
    } catch (err) {
      console.error(`Failed to load template ${id}:`, err);
      setError(err instanceof Error ? err : new Error(`Failed to load template ${id}`));
      setCurrentTemplate(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar um template
  const save = useCallback(async (template: Partial<Template>) => {
    try {
      setIsLoading(true);
      const savedTemplate = await saveTemplate(template);
      await loadTemplates();
      
      if (templateId === savedTemplate.id) {
        setCurrentTemplate(savedTemplate);
      }
      
      setError(null);
      return savedTemplate;
    } catch (err) {
      console.error('Failed to save template:', err);
      setError(err instanceof Error ? err : new Error('Failed to save template'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [templateId, loadTemplates]);

  // Duplicar um template
  const duplicate = useCallback(async (id: string, newName: string) => {
    try {
      setIsLoading(true);
      const newTemplate = await duplicateTemplate(id, newName);
      await loadTemplates();
      setError(null);
      return newTemplate;
    } catch (err) {
      console.error('Failed to duplicate template:', err);
      setError(err instanceof Error ? err : new Error('Failed to duplicate template'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadTemplates]);

  // Excluir um template
  const remove = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await deleteTemplate(id);
      await loadTemplates();
      
      if (templateId === id) {
        setCurrentTemplate(null);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to delete template:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete template'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [templateId, loadTemplates]);

  // Efeito para carregar os templates quando o hook for montado
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Efeito para carregar o template atual quando o ID mudar
  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    } else {
      setCurrentTemplate(null);
    }
  }, [templateId, loadTemplate]);

  return {
    templates,
    template: currentTemplate,
    isLoading,
    error,
    loadTemplates,
    loadTemplate,
    saveTemplate: save,
    duplicateTemplate: duplicate,
    deleteTemplate: remove,
  };
}

export function useTemplateList() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getTemplates();
      setTemplates(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Failed to load templates:', err);
      setError(err instanceof Error ? err : new Error('Failed to load templates'));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return {
    templates,
    isLoading,
    error,
    refresh: loadTemplates,
  };
}
