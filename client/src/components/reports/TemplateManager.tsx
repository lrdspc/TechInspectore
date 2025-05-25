import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TemplateEditor } from './TemplateEditor';
import { getTemplates, saveTemplate, deleteTemplate, duplicateTemplate } from '@/services/templateService';
import { Template } from '@/lib/template-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Copy, Plus } from 'lucide-react';

export function TemplateManager({ onSelect }: { onSelect: (template: Template) => void }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const loadedTemplates = await getTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleSave = async (template: Partial<Template>) => {
    await saveTemplate(template);
    await loadTemplates();
    setIsEditorOpen(false);
    setEditingTemplate(null);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      try {
        await deleteTemplate(id);
        await loadTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Não foi possível excluir o template: ' + (error as Error).message);
      }
    }
  };

  const handleDuplicate = async (template: Template, e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = prompt('Digite um nome para a cópia do template:', `${template.name} (Cópia)`);
    if (newName) {
      try {
        await duplicateTemplate(template.id, newName);
        await loadTemplates();
      } catch (error) {
        console.error('Error duplicating template:', error);
        alert('Não foi possível duplicar o template');
      }
    }
  };

  if (isLoading) {
    return <div>Carregando templates...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Modelos de Documento</h2>
        <Button 
          onClick={() => {
            setEditingTemplate(null);
            setIsEditorOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Modelo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelect(template)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTemplate(template);
                      setIsEditorOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => handleDuplicate(template, e)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {template.id !== 'default' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => handleDelete(template.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {template.sections.length} seções • 
                Atualizado em {new Date(template.updatedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Editar Modelo' : 'Novo Modelo de Documento'}
            </DialogTitle>
          </DialogHeader>
          <TemplateEditor 
            initialTemplate={editingTemplate}
            onSave={handleSave}
            onCancel={() => setIsEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
