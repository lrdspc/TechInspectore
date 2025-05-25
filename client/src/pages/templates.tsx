import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TemplateManager } from '@/components/reports/TemplateManager';
import { TemplateEditor } from '@/components/reports/TemplateEditor';
import { Template } from '@/lib/template-types';

export default function TemplatesPage() {
  const [location, setLocation] = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
  };

  const handleCloseDialog = () => {
    setSelectedTemplate(null);
    setIsCreating(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Modelos de Documentos</h1>
          <p className="text-muted-foreground">Gerencie seus modelos de relatórios de vistoria</p>
        </div>
        <Button onClick={handleCreateNew}>
          Criar Novo Modelo
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meus Modelos</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateManager onSelect={handleTemplateSelect} />
          </CardContent>
        </Card>
      </div>

      {/* Dialog para visualização/edição de template */}
      <Dialog open={!!selectedTemplate || isCreating} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Criar Novo Modelo' : 'Editar Modelo'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {(selectedTemplate || isCreating) && (
              <TemplateEditor 
                initialTemplate={selectedTemplate || undefined}
                onSave={async (template: Partial<Template>) => {
                  handleCloseDialog();
                  // A lista de templates será atualizada automaticamente pelo TemplateManager
                }}
                onCancel={handleCloseDialog}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
