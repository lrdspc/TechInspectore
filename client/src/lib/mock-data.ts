// Utility functions to generate random test data for forms

export function generateRandomClient() {
  const companies = [
    'Construtora Alpha Ltda',
    'Edifício Residencial Sunset',
    'Condomínio Vila Verde',
    'Empresa Beta Construções',
    'Residencial Parque das Águas',
    'Condomínio Jardim Europa',
    'Construtora Gamma S.A.',
    'Edifício Torres Gemeas'
  ];

  const contacts = [
    'João Silva',
    'Maria Santos',
    'Carlos Oliveira',
    'Ana Costa',
    'Roberto Lima',
    'Patricia Ferreira',
    'Eduardo Mendes',
    'Luciana Rocha'
  ];

  const phoneNumbers = [
    '(11) 99888-7766',
    '(21) 98765-4321',
    '(31) 97654-3210',
    '(47) 96543-2109',
    '(85) 95432-1098',
    '(62) 94321-0987',
    '(81) 93210-9876',
    '(51) 92109-8765'
  ];

  const emails = [
    'contato@empresa.com.br',
    'administracao@construtora.com',
    'sindico@condominio.com.br',
    'obras@edificio.com',
    'gerencia@empreendimento.com.br',
    'comercial@construtora.net',
    'atendimento@residencial.com',
    'projetos@construtora.com.br'
  ];

  const documents = [
    '12.345.678/0001-90',
    '98.765.432/0001-10',
    '11.222.333/0001-44',
    '55.666.777/0001-88',
    '33.444.555/0001-22',
    '77.888.999/0001-66',
    '22.333.444/0001-11',
    '66.777.888/0001-55'
  ];

  return {
    name: companies[Math.floor(Math.random() * companies.length)],
    type: Math.random() > 0.5 ? 'corporate' : 'individual',
    document: documents[Math.floor(Math.random() * documents.length)],
    contactName: contacts[Math.floor(Math.random() * contacts.length)],
    contactPhone: phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)],
    email: emails[Math.floor(Math.random() * emails.length)]
  };
}

export function generateRandomProject() {
  const projects = [
    'Residencial Parque das Flores',
    'Edifício Comercial Centro',
    'Condomínio Villa Real',
    'Torre Empresarial Norte',
    'Residencial Jardim Sul',
    'Shopping Center Plaza',
    'Edifício Residencial Aurora',
    'Complexo Industrial Leste'
  ];

  const addresses = [
    'Rua das Palmeiras, 123',
    'Avenida Central, 456',
    'Rua do Comércio, 789',
    'Alameda dos Anjos, 321',
    'Rua Santa Clara, 654',
    'Avenida Paulista, 987',
    'Rua dos Girassóis, 147',
    'Avenida Beira Mar, 258'
  ];

  const cities = [
    'São Paulo',
    'Rio de Janeiro',
    'Belo Horizonte',
    'Brasília',
    'Salvador',
    'Fortaleza',
    'Curitiba',
    'Recife'
  ];

  const states = [
    'SP',
    'RJ',
    'MG',
    'DF',
    'BA',
    'CE',
    'PR',
    'PE'
  ];

  const ceps = [
    '01234-567',
    '20123-456',
    '30234-567',
    '70345-678',
    '40456-789',
    '60567-890',
    '80678-901',
    '50789-012'
  ];

  const cityIndex = Math.floor(Math.random() * cities.length);

  return {
    name: projects[Math.floor(Math.random() * projects.length)],
    address: addresses[Math.floor(Math.random() * addresses.length)],
    number: String(Math.floor(Math.random() * 9999) + 1),
    complement: Math.random() > 0.7 ? `Bloco ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}` : '',
    neighborhood: ['Centro', 'Jardins', 'Vila Nova', 'Bela Vista'][Math.floor(Math.random() * 4)],
    city: cities[cityIndex],
    state: states[cityIndex],
    cep: ceps[cityIndex]
  };
}

export function generateRandomInspectionData() {
  const roofModels = [
    'Brasilit Maxiplac',
    'Brasilit Superplac',
    'Brasilit Euatex Maxiplac',
    'Brasilit Eternit Colonial',
    'Brasilit Kalhetão',
    'Brasilit Ondulada',
    'Brasilit Perfil Trapezoidal',
    'Brasilit Megaplac'
  ];

  const installationTypes = [
    'Nova instalação',
    'Reforma',
    'Manutenção',
    'Substituição parcial',
    'Ampliação'
  ];

  const conditions = [
    'Excelente',
    'Bom',
    'Regular',
    'Ruim',
    'Crítico'
  ];

  const problems = [
    'Infiltração localizada',
    'Trincas superficiais', 
    'Deslocamento de telhas',
    'Oxidação de fixadores',
    'Acúmulo de detritos',
    'Desgaste natural',
    'Danos por granizo',
    'Instalação inadequada'
  ];

  const recommendations = [
    'Substituição imediata das peças danificadas',
    'Manutenção preventiva a cada 6 meses',
    'Aplicação de selante nas juntas',
    'Limpeza profissional do telhado',
    'Reforço na estrutura de apoio',
    'Substituição dos fixadores oxidados',
    'Instalação de calhas adicionais',
    'Revisão geral da cobertura'
  ];

  const conclusions = ['approved', 'rejected'];

  // Generate random past date for installation (1-5 years ago)
  const installationDate = new Date();
  installationDate.setFullYear(installationDate.getFullYear() - Math.floor(Math.random() * 5) - 1);
  installationDate.setMonth(Math.floor(Math.random() * 12));
  installationDate.setDate(Math.floor(Math.random() * 28) + 1);

  // Generate random future date for scheduled inspection (1-30 days from now)
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30) + 1);

  return {
    roofModel: roofModels[Math.floor(Math.random() * roofModels.length)],
    quantity: Math.floor(Math.random() * 500) + 50,
    area: Math.floor(Math.random() * 1000) + 100,
    installationDate: installationDate,
    installationType: installationTypes[Math.floor(Math.random() * installationTypes.length)],
    scheduledDate: scheduledDate,
    generalCondition: conditions[Math.floor(Math.random() * conditions.length)],
    identifiedProblems: [
      problems[Math.floor(Math.random() * problems.length)],
      problems[Math.floor(Math.random() * problems.length)]
    ].filter((item, index, arr) => arr.indexOf(item) === index), // Remove duplicates
    technicalAnalysis: [
      {
        name: 'Estado das telhas',
        description: 'Verificação visual do estado geral das peças',
        status: Math.random() > 0.3 ? 'ok' : 'attention',
        notes: 'Algumas peças apresentam sinais de desgaste natural'
      },
      {
        name: 'Fixadores e estrutura',
        description: 'Análise dos pontos de fixação e estrutura de apoio',
        status: Math.random() > 0.5 ? 'ok' : 'critical',
        notes: 'Estrutura em bom estado, alguns fixadores necessitam substituição'
      },
      {
        name: 'Estanqueidade',
        description: 'Teste de estanqueidade e impermeabilização',
        status: Math.random() > 0.4 ? 'ok' : 'attention',
        notes: 'Sistema de drenagem funcionando adequadamente'
      }
    ],
    conclusion: conclusions[Math.floor(Math.random() * conclusions.length)],
    recommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
    observations: 'Vistoria realizada conforme procedimentos técnicos da Brasilit. Recomenda-se acompanhamento periódico.',
    temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    weatherConditions: ['Ensolarado', 'Parcialmente nublado', 'Nublado'][Math.floor(Math.random() * 3)]
  };
}

export function generateCompleteFormData() {
  const client = generateRandomClient();
  const project = generateRandomProject();
  const inspection = generateRandomInspectionData();

  // Use existing client and project IDs from the system
  const clientId = Math.floor(Math.random() * 3) + 1; // IDs 1, 2, or 3
  const projectId = Math.floor(Math.random() * 3) + 1; // IDs 1, 2, or 3

  return {
    // Required IDs for validation
    clientId: clientId,
    projectId: projectId,

    // Client data
    clientName: client.name,
    clientType: client.type,
    clientDocument: client.document,
    clientContactName: client.contactName,
    clientContactPhone: client.contactPhone,
    clientEmail: client.email,

    // Project data
    projectName: project.name,
    address: project.address,
    number: project.number,
    complement: project.complement,
    neighborhood: project.neighborhood,
    city: project.city,
    state: project.state,
    cep: project.cep,

    // Inspection data
    ...inspection
  };
}