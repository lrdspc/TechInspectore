import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TemplateEditor } from '@/components/reports/TemplateEditor';
import { Template } from '@/lib/template-types';

describe('TemplateEditor', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSave: mockOnSave,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o editor vazio', () => {
    render(<TemplateEditor {...defaultProps} />);
    
    expect(screen.getByLabelText('Nome do Modelo')).toBeInTheDocument();
    expect(screen.getByText('Nenhuma seção adicionada')).toBeInTheDocument();
  });

  it('deve permitir adicionar uma nova seção', () => {
    render(<TemplateEditor {...defaultProps} />);
    
    const addButton = screen.getByText('Adicionar Seção');
    fireEvent.click(addButton);
    
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Conteúdo')).toBeInTheDocument();
  });

  it('deve validar o formulário antes de salvar', async () => {
    // Mock do window.alert
    const alertCalls: string[] = [];
    const originalAlert = window.alert;
    window.alert = (message: string) => {
      alertCalls.push(message);
      console.log('Alert chamado com:', message);
    };
    
    try {
      // Renderiza o componente
      render(<TemplateEditor {...defaultProps} />);
      
      // Tenta salvar sem preencher nada
      const saveButton = screen.getByText('Salvar Modelo');
      fireEvent.click(saveButton);
      
      // Verifica se o alerta de nome vazio foi chamado
      await waitFor(() => {
        expect(alertCalls).toContain('Por favor, informe um nome para o template');
      }, { timeout: 2000 });
      
      // Limpa as chamadas para o próximo teste
      alertCalls.length = 0;
      
      // Preenche o nome mas não adiciona seções
      const nameInput = screen.getByLabelText('Nome do Modelo');
      fireEvent.change(nameInput, { target: { value: 'Meu Template' } });
      
      // Tenta salvar novamente
      fireEvent.click(saveButton);
      
      // Verifica se o alerta de seção ausente foi chamado
      await waitFor(() => {
        expect(alertCalls).toContain('Adicione pelo menos uma seção ao template');
      }, { timeout: 2000 });
      
    } finally {
      // Restaura o alerta original
      window.alert = originalAlert;
      console.log('Chamadas de alerta registradas:', alertCalls);
    }
  });

  it('deve chamar onSave com os dados corretos', async () => {
    render(<TemplateEditor {...defaultProps} />);
    
    // Preenche o formulário
    const nameInput = screen.getByLabelText('Nome do Modelo');
    fireEvent.change(nameInput, { target: { value: 'Meu Template' } });
    
    // Adiciona uma seção
    const addButton = screen.getByText('Adicionar Seção');
    fireEvent.click(addButton);
    
    // Preenche a seção
    const titleInput = screen.getByLabelText('Título');
    const contentInput = screen.getByLabelText('Conteúdo');
    
    fireEvent.change(titleInput, { target: { value: 'Introdução' } });
    fireEvent.change(contentInput, { target: { value: 'Conteúdo da introdução' } });
    
    // Salva
    const saveButton = screen.getByText('Salvar Modelo');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
      const savedTemplate = mockOnSave.mock.calls[0][0];
      expect(savedTemplate.name).toBe('Meu Template');
      expect(savedTemplate.sections).toHaveLength(1);
      expect(savedTemplate.sections[0].title).toBe('Introdução');
    });
  });

  it('deve carregar um template existente para edição', () => {
    const template: Template = {
      id: 'template-1',
      name: 'Template Existente',
      sections: [
        {
          id: 'sec-1',
          title: 'Seção 1',
          content: 'Conteúdo da seção 1',
          order: 0
        }
      ],
      variables: [],
      styles: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    render(<TemplateEditor initialTemplate={template} onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    expect(screen.getByDisplayValue('Template Existente')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Seção 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Conteúdo da seção 1')).toBeInTheDocument();
  });
});
