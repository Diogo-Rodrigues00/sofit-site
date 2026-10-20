/* =========================================================
   CONFIGURAÇÃO DO SITE DA SÔ FIT
   Quase tudo que muda com frequência está aqui.
   Depois de editar, salve e recarregue a página.
   ========================================================= */
window.SOFIT = {

  // WhatsApp: 55 + DDD + número, só dígitos. Ex.: '5534999998888'
  whatsapp: '5534996584490',
  mensagemPadrao: 'Oi! Quero agendar uma aula experimental na Sô Fit.',

  // ID da planilha do Google com os avisos e campanhas.
  // É o trecho entre /d/ e /edit no link da planilha.
  // Enquanto estiver vazio, o site usa os dados de "exemplo" lá embaixo.
  planilhaId: '',

  // Horário de funcionamento (0 = domingo ... 6 = sábado).
  // [abre, fecha] em horas. 5.5 = 05:30. null = fechado.
  funcionamento: {
    0: [8, 12],
    1: [5, 22],
    2: [5, 22],
    3: [5, 22],
    4: [5, 22],
    5: [5, 22],
    6: [8, 14]
  },

  // Aulas coletivas por dia (a musculação entra sozinha, pelo funcionamento).
  aulas: {
    0: [],
    1: [{ hora: '18:30', nome: 'Spinning', obs: 'Agende pelo app Next Fit, 2h antes' }],
    2: [{ hora: '06:30', nome: 'Spinning', obs: 'Agende pelo app Next Fit, 2h antes' }],
    3: [
      { hora: '18:20', nome: 'Cardio', obs: 'Com o Prof. Diogo' },
      { hora: '18:30', nome: 'Spinning', obs: 'Agende pelo app Next Fit, 2h antes' }
    ],
    4: [{ hora: '06:30', nome: 'Spinning', obs: 'Agende pelo app Next Fit, 2h antes' }],
    5: [],
    6: []
  },

  // Dados usados quando não há planilha configurada (ou ela não carrega).
  // Servem para você ver como fica. Mesmo formato das colunas da planilha.
  exemplo: {
    avisos: [
      {
        ativo: 'sim', tipo: 'Aviso',
        titulo: 'Spinning com agendamento',
        texto: 'O agendamento da aula de spinning agora abre 2h antes da aula, pelo app Next Fit.',
        data: '', mostrar_ate: '', link: ''
      },
      {
        ativo: 'sim', tipo: 'Evento',
        titulo: '[EXEMPLO] Aulão Novembro Azul',
        texto: 'Treino especial aberto para alunos e convidados. Traga um amigo!',
        data: '[DATA]', mostrar_ate: '', link: ''
      }
    ],
    campanha: [
      {
        ativa: 'sim', nome: 'Novembro Azul',
        mensagem: 'Cuidar da saúde também é treino. Faça seus exames em dia.',
        cor: '#1E5BD8', link: ''
      }
    ]
  }
};
