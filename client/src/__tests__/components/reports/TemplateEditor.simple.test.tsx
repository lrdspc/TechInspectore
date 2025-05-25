import React from 'react';
import { render, screen } from '@testing-library/react';
import { TemplateEditor } from '@/components/reports/TemplateEditor';

describe('TemplateEditor - Simple Test', () => {
  it('renders without crashing', () => {
    const mockSave = jest.fn();
    const mockCancel = jest.fn();
    
    render(
      <TemplateEditor 
        onSave={mockSave} 
        onCancel={mockCancel} 
      />
    );
    
    expect(screen.getByText('Salvar Modelo')).toBeInTheDocument();
  });
});
