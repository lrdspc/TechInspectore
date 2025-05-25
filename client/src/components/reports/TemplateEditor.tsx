import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Template, TemplateSection, TemplateVariable } from '@/lib/template-types';
import { Trash2, Plus, GripVertical, X, Check } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface SortableSectionProps {
  id: string;
  children: React.ReactNode;
  onRemove: () => void;
}

function SortableSection({ id, children, onRemove }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="relative group border rounded-md p-4 mb-2 bg-background"
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

interface TemplateEditorProps {
  initialTemplate?: Template | null;
  onSave: (template: Partial<Template>) => void;
  onCancel: () => void;
}

export function TemplateEditor({ initialTemplate, onSave, onCancel }: TemplateEditorProps) {
  const [template, setTemplate] = useState<Partial<Template>>(
    initialTemplate || {
      name: 'Novo Modelo',
      sections: [],
      styles: {},
      variables: [],
    }
  );
  const [activeSection, setActiveSection] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('sections');
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addSection = useCallback(() => {
    const newSection: TemplateSection = {
      id: `section-${Date.now()}`,
      title: 'Nova Seção',
      content: 'Conteúdo da seção...',
      order: template.sections?.length || 0,
    };
    
    setTemplate(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));
    setActiveSection(template.sections?.length || 0);
  }, [template.sections]);

  const updateSection = useCallback((index: number, updates: Partial<TemplateSection>) => {
    setTemplate(prev => {
      const newSections = [...(prev.sections || [])];
      newSections[index] = { ...newSections[index], ...updates };
      return { ...prev, sections: newSections };
    });
  }, []);

  const removeSection = useCallback((index: number) => {
    setTemplate(prev => {
      const newSections = [...(prev.sections || [])];
      newSections.splice(index, 1);
      
      // Update order
      return {
        ...prev,
        sections: newSections.map((section, idx) => ({
          ...section,
          order: idx,
        })),
      };
    });
    
    if (activeSection >= index && activeSection > 0) {
      setActiveSection(prev => prev - 1);
    }
  }, [activeSection]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setTemplate((prev) => {
        const oldIndex = prev.sections?.findIndex(s => s.id === active.id) || 0;
        const newIndex = prev.sections?.findIndex(s => s.id === over.id) || 0;
        
        const newSections = [...(prev.sections || [])];
        const [moved] = newSections.splice(oldIndex, 1);
        newSections.splice(newIndex, 0, moved);
        
        // Update order
        return {
          ...prev,
          sections: newSections.map((section, idx) => ({
            ...section,
            order: idx,
          })),
        };
      });
    }
  };

  const addVariable = useCallback(() => {
    const newVariable: TemplateVariable = {
      key: `var_${Date.now()}`,
      label: 'Nova Variável',
      type: 'text',
      required: false,
      section: template.sections?.[activeSection]?.id,
    };
    
    setTemplate(prev => ({
      ...prev,
      variables: [...(prev.variables || []), newVariable],
    }));
  }, [activeSection, template.sections]);

  const updateVariable = useCallback((index: number, updates: Partial<TemplateVariable>) => {
    setTemplate(prev => {
      const newVariables = [...(prev.variables || [])];
      newVariables[index] = { ...newVariables[index], ...updates };
      return { ...prev, variables: newVariables };
    });
  }, []);

  const removeVariable = useCallback((index: number) => {
    setTemplate(prev => {
      const newVariables = [...(prev.variables || [])];
      newVariables.splice(index, 1);
      return { ...prev, variables: newVariables };
    });
  }, []);

  const validateForm = (): boolean => {
    // Validação do nome do template
    if (!template.name?.trim()) {
      alert('Por favor, informe um nome para o template');
      return false;
    }

    // Validação das seções
    if (!template.sections?.length) {
      alert('Adicione pelo menos uma seção ao template');
      return false;
    }

    // Validação dos títulos e conteúdos das seções
    for (let i = 0; i < template.sections.length; i++) {
      const section = template.sections[i];
      if (!section.title.trim()) {
        alert(`A seção ${i + 1} precisa de um título`);
        setActiveSection(i);
        setActiveTab('sections');
        return false;
      }
      if (!section.content.trim()) {
        alert(`A seção "${section.title}" está vazia`);
        setActiveSection(i);
        setActiveTab('sections');
        return false;
      }
    }

    // Validação das variáveis obrigatórias
    const variables = template.variables || [];
    for (let i = 0; i < variables.length; i++) {
      const variable = variables[i];
      if (variable.required && !variable.key) {
        alert(`A variável ${i + 1} precisa de uma chave`);
        setActiveTab('variables');
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      await onSave(template);
    } catch (error) {
      console.error('Erro ao salvar o template:', error);
      alert('Ocorreu um erro ao salvar o template. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentSection = template.sections?.[activeSection];
  const sectionVariables = template.variables?.filter(
    v => !v.section || v.section === currentSection?.id
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="template-name">Nome do Modelo</Label>
        <Input
          id="template-name"
          value={template.name || ''}
          onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="sections">Seções</TabsTrigger>
          <TabsTrigger value="variables" disabled={!currentSection}>
            Variáveis
          </TabsTrigger>
          <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4">
          {template.sections && template.sections.length > 0 ? (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={template.sections.map(s => s.id)} 
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {template.sections.map((section, index) => (
                    <SortableSection 
                      key={section.id} 
                      id={section.id}
                      onRemove={() => removeSection(index)}
                    >
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`section-title-${index}`}>Título</Label>
                          <Input
                            id={`section-title-${index}`}
                            value={section.title}
                            onChange={(e) => updateSection(index, { title: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`section-content-${index}`}>Conteúdo</Label>
                          <Textarea
                            id={`section-content-${index}`}
                            value={section.content}
                            onChange={(e) => updateSection(index, { content: e.target.value })}
                            className="mt-1 min-h-[100px]"
                            placeholder="Digite o conteúdo da seção..."
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Use {'{{variavel}}'} para inserir variáveis
                        </div>
                      </div>
                    </SortableSection>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Nenhuma seção adicionada</p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={addSection}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Seção
          </Button>
        </TabsContent>

        <TabsContent value="variables" className="space-y-4">
          {currentSection ? (
            <>
              <div className="space-y-4">
                {sectionVariables.map((variable, index) => (
                  <div key={variable.key} className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div>
                          <Label>Chave</Label>
                          <Input
                            value={variable.key}
                            onChange={(e) => updateVariable(index, { key: e.target.value })}
                            className="font-mono text-sm"
                          />
                        </div>
                        <div>
                          <Label>Rótulo</Label>
                          <Input
                            value={variable.label}
                            onChange={(e) => updateVariable(index, { label: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Tipo</Label>
                            <select
                              value={variable.type}
                              onChange={(e) => updateVariable(index, { type: e.target.value as any })}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="text">Texto</option>
                              <option value="number">Número</option>
                              <option value="date">Data</option>
                              <option value="select">Seleção</option>
                              <option value="boolean">Verdadeiro/Falso</option>
                            </select>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mt-6">
                              <input
                                type="checkbox"
                                id={`required-${index}`}
                                checked={variable.required}
                                onChange={(e) => updateVariable(index, { required: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <Label htmlFor={`required-${index}`} className="text-sm font-medium">
                                Obrigatório
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => removeVariable(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={addVariable}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Variável
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Selecione uma seção primeiro</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview">
          <div className="border rounded-md p-6 bg-white">
            <h2 className="text-xl font-bold mb-4">Pré-visualização</h2>
            {template.sections?.map((section, index) => (
              <div key={section.id} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded">
                  {section.content}
                </div>
              </div>
            ))}
            {template.sections?.length === 0 && (
              <p className="text-muted-foreground">Nenhuma seção para visualizar</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Modelo'}
        </Button>
      </div>
    </div>
  );
}
