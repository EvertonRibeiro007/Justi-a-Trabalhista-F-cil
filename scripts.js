// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('multi-step-form');
  const formSteps = document.querySelectorAll('.form-step');
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');
  const horasExtrasCheckbox = document.getElementById('horas-extras');
  const extraHoursField = document.querySelector('.extra-hours-field');
  const reviewSection = document.querySelector('.review');
  const resultadoAnalisado = document.getElementById('resultado-analisado');
  const contactLawfirmsBtn = document.getElementById('contact-lawfirms-btn');
  const modal = document.getElementById('lawfirms-modal');
  const closeButton = document.querySelector('.close-button');
  const lawfirmList = document.querySelector('.lawfirm-list');
  const container = document.querySelector('.container'); // Seleciona o contêiner principal

  let currentStep = 0;

  // Lista de advocacias parceiras (exemplo)
  const lawfirms = [
    {
      name: 'Advocacia Silva & Associados',
      description: 'Especialistas em direito trabalhista com mais de 20 anos de experiência.',
      email: 'contato@silvaassociados.com.br'
    },
    {
      name: 'Consultoria Jurídica Oliveira',
      description: 'Atuação destacada em casos de conformidade e compliance trabalhista.',
      email: 'oliveira@consultjuridica.com.br'
    },
    {
      name: 'Escritório Legal Gomes',
      description: 'Foco em defesa dos direitos dos trabalhadores e negociação de contratos.',
      email: 'gomes@escritoriodlegal.com.br'
    }
    // Adicione mais advocacias conforme necessário
  ];

  // Mapeamento de palavras-chave para URLs
  const keywordLinks = {
    'Art. 58 da CLT': 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm#:~:text=JORNADA%20DE%20TRABALHO-,Art.,seja%20fixado%20expressamente%20outro%20limite.',
    'Art. 7º, XIII, da Constituição Federal': 'https://www.jusbrasil.com.br/topicos/10726563/inciso-xiii-do-artigo-7-da-constituicao-federal-de-1988',
    'Art. 59 da CLT': 'https://www.jusbrasil.com.br/topicos/10759850/artigo-59-do-decreto-lei-n-5452-de-01-de-maio-de-1943',
    'Art. 7º, IV, da Constituição Federal': 'https://www.jusbrasil.com.br/topicos/10726905/inciso-iv-do-artigo-7-da-constituicao-federal-de-1988',
    'Art. 67 da CLT': 'https://www.jusbrasil.com.br/topicos/10758983/artigo-67-do-decreto-lei-n-5452-de-01-de-maio-de-1943',
    'Art. 29 da CLT': 'https://www.jusbrasil.com.br/topicos/10762468/artigo-29-do-decreto-lei-n-5452-de-01-de-maio-de-1943',
    'Art. 3º da CLT': 'https://www.jusbrasil.com.br/topicos/10634289/artigo-3-do-decreto-lei-n-5452-de-01-de-maio-de-1943',
    'A legislação trabalhista exige o fornecimento de alguns benefícios obrigatórios': 'https://rhpravoce.com.br/case/beneficios-obrigatorios-atracao/',
    'NR-6 da NR de Segurança e Saúde no Trabalho': 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-6-nr-6#:~:text=A%20Norma%20Regulamentadora%20n%C2%BA%206,setores%20ou%20atividades%20econ%C3%B4micas%20espec%C3%ADficas.',
    'Art. 154 da CLT': 'https://www.planalto.gov.br/ccivil_03/leis/l6514.htm#:~:text=154%20%2D%20A%20observ%C3%A2ncia%2C%20em%20todos,os%20respectivos%20estabelecimentos%2C%20bem%20como',
    // Adicione mais mapeamentos conforme necessário
  };

  // Mostrar a primeira etapa
  formSteps[currentStep].classList.add('active');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Validação simples
      const currentInputs = formSteps[currentStep].querySelectorAll('input, select');
      let valid = true;
      currentInputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value) {
          input.style.border = '2px solid red';
          valid = false;
        } else {
          input.style.border = 'none';
        }
      });

      if (!valid) return;

      if (currentStep < formSteps.length - 1) {
        formSteps[currentStep].classList.remove('active');
        currentStep++;
        formSteps[currentStep].classList.add('active');

        // Adicionar classe para ocultar os painéis nas etapas de Revisão e Resultados
        if (currentStep === formSteps.length - 2 || currentStep === formSteps.length - 1) {
          container.classList.add('hide-panels');
          // Preencher o resumo se for a penúltima etapa
          if (currentStep === formSteps.length - 2) {
            preencherRevisao();
          }
        } else {
          container.classList.remove('hide-panels');
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        formSteps[currentStep].classList.remove('active');
        currentStep--;
        formSteps[currentStep].classList.add('active');

        // Remover classe para mostrar os painéis ao voltar
        if (currentStep === formSteps.length - 3 || currentStep < formSteps.length - 2) {
          container.classList.remove('hide-panels');
        }
      }
    });
  });

  // Mostrar ou esconder o campo de horas extras
  horasExtrasCheckbox.addEventListener('change', () => {
    if (horasExtrasCheckbox.checked) {
      extraHoursField.style.display = 'flex';
    } else {
      extraHoursField.style.display = 'none';
    }
  });

  // Função auxiliar para escapar caracteres especiais em expressões regulares
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Função para substituir palavras-chave por links
  function linkify(text) {
    for (const [keyword, url] of Object.entries(keywordLinks)) {
      const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'g');
      text = text.replace(regex, `<a href="${url}" target="_blank" rel="noopener noreferrer">$1</a>`);
    }
    return text;
  }

  // Função para preencher a seção de revisão
  function preencherRevisao() {
    const nome = document.getElementById('nome-completo').value;
    const cargo = document.getElementById('cargo').value;
    const tipoContrato = document.getElementById('tipo-contrato').value;
    const horasSemana = parseInt(document.getElementById('horas-semana').value);
    const cargaDiaria = parseInt(document.getElementById('carga-diaria').value);
    const descansoSemanal = document.getElementById('descanso-semanal').value;
    const horasExtras = horasExtrasCheckbox.checked ? 'Sim' : 'Não';
    const quantidadeExtras = horasExtrasCheckbox.checked ? parseInt(document.getElementById('quantidade-extras').value) : 0;
    const beneficios = Array.from(document.querySelectorAll('input[name="beneficios"]:checked')).map(el => el.value).join(', ') || 'Nenhum';
    const frequenciaPagamento = document.getElementById('frequencia-pagamento').value;
    const salarioRecebido = parseFloat(document.getElementById('salario-recebido').value);
    const assinaturaCT = document.getElementById('assinatura-ct').checked ? 'Sim' : 'Não';
    const condicoes = Array.from(document.querySelectorAll('input[name="condicoes"]:checked')).map(el => el.value).join(', ') || 'Nenhuma';

    reviewSection.innerHTML = `
      <p><strong>Nome Completo:</strong> ${nome}</p>
      <p><strong>Cargo:</strong> ${cargo}</p>
      <p><strong>Tipo de Contrato de Trabalho:</strong> ${tipoContrato}</p>
      <p><strong>Horas Trabalhadas por Semana:</strong> ${horasSemana}</p>
      <p><strong>Carga Horária Diária:</strong> ${cargaDiaria}</p>
      <p><strong>Descanso Semanal:</strong> ${descansoSemanal === '1' ? '1 dia' : (descansoSemanal === '2' ? '2 dias' : 'Não')}</p>
      <p><strong>Horas Extras Trabalhadas:</strong> ${horasExtras}</p>
      ${horasExtrasCheckbox.checked ? `<p><strong>Quantas horas extras por semana:</strong> ${quantidadeExtras}</p>` : ''}
      <p><strong>Benefícios Recebidos:</strong> ${beneficios}</p>
      <p><strong>Frequência de Pagamento:</strong> ${frequenciaPagamento}</p>
      <p><strong>Salário Recebido:</strong> R$ ${salarioRecebido.toFixed(2)}</p>
      <p><strong>Assinatura de Carteira de Trabalho:</strong> ${assinaturaCT}</p>
      <p><strong>Condições no Local de Trabalho:</strong> ${condicoes}</p>
    `;
  }

  // Função de análise conforme as leis trabalhistas brasileiras
  function analisarFormulario(dados) {
    const resultados = [];

    // Jornada de Trabalho
    if (dados.horasSemana > 44) {
      resultados.push({
        tipo: 'non-compliant',
        titulo: 'Jornada de Trabalho',
        descricao: linkify(`A jornada de trabalho semanal de ${dados.horasSemana} horas excede o limite legal de 44 horas semanais estabelecido pelo Art. 58 da CLT.`)
      });
    } else if (dados.horasSemana >= 35 && dados.horasSemana <= 44) {
      resultados.push({
        tipo: 'compliant',
        titulo: 'Jornada de Trabalho',
        descricao: linkify(`A jornada de trabalho semanal de ${dados.horasSemana} horas está dentro do limite legal estabelecido pelo Art. 58 da CLT.`)
      });
    } else { // dados.horasSemana < 35
      resultados.push({
        tipo: 'non-compliant',
        titulo: 'Jornada de Trabalho',
        descricao: linkify(`A jornada de trabalho semanal de ${dados.horasSemana} horas está abaixo do mínimo legal de 35 horas semanais estabelecido pelo Art. 7º, XIII, da Constituição Federal.`)
      });
    }

    // Horas Extras
    if (dados.horasExtras === 'Sim') {
      const horasDiarias = dados.horasDiarias;
      const horasSemana = dados.horasSemana;
      const quantidadeExtras = dados.quantidadeExtras;

      // Validação para garantir que horasDiarias não seja zero ou negativa
      if (horasDiarias <= 0) {
        resultados.push({
          tipo: 'non-compliant',
          titulo: 'Horas Extras',
          descricao: linkify(`A carga horária diária (${horasDiarias} horas) é inválida. Por favor, insira um valor positivo.`)
        });
      } else {
        // Calcula o número de dias trabalhados por semana
        // Usamos Math.ceil para garantir que todos os dias sejam contados
        const diasTrabalhados = Math.ceil(horasSemana / horasDiarias);

        // Validação para garantir que diasTrabalhados seja um número válido
        if (!Number.isFinite(diasTrabalhados) || diasTrabalhados <= 0 || diasTrabalhados > 7) {
          resultados.push({
            tipo: 'non-compliant',
            titulo: 'Horas Extras',
            descricao: linkify(`O cálculo de dias trabalhados (${diasTrabalhados}) é inválido. Verifique as horas semanais e diárias inseridas.`)
          });
        } else {
          // Considerando que as horas extras são permitidas até 2 horas por dia
          const maxExtrasPorSemana = 2 * diasTrabalhados;

          // Limite de horas extras por semana baseado no número de dias trabalhados
          const limiteHorasExtras = maxExtrasPorSemana;

          if (quantidadeExtras > limiteHorasExtras) {
            resultados.push({
              tipo: 'non-compliant',
              titulo: 'Horas Extras',
              descricao: linkify(`A quantidade de horas extras (${quantidadeExtras} horas por semana) excede o limite permitido de ${limiteHorasExtras} horas semanais conforme o Art. 59 da CLT, que estabelece até 2 horas extras diárias.`)
            });
          } else if (quantidadeExtras > 0) {
            resultados.push({
              tipo: 'compliant',
              titulo: 'Horas Extras',
              descricao: linkify(`As horas extras trabalhadas (${quantidadeExtras} horas por semana) estão de acordo com o Art. 59 da CLT, desde que remuneradas com adicional mínimo de 50% e não excedam o limite de ${limiteHorasExtras} horas semanais.`)
            });
          } else {
            // Caso de horas extras marcadas como "Sim" mas sem horas extras
            resultados.push({
              tipo: 'non-compliant',
              titulo: 'Horas Extras',
              descricao: linkify(`Foi marcado que há horas extras, mas nenhuma hora extra foi registrada. Por favor, insira a quantidade correta de horas extras.`)
            });
          }
        }
      }
    }

    // Salário
    const salarioMinimo = 1412; // Atualizar conforme o salário mínimo vigente
    if (dados.salarioRecebido < salarioMinimo) {
      resultados.push({
        tipo: 'non-compliant',
        titulo: 'Salário',
        descricao: linkify(`O salário recebido de R$ ${dados.salarioRecebido.toFixed(2)} está abaixo do salário mínimo vigente (R$ ${salarioMinimo.toFixed(2)}) conforme Art. 7º, IV, da Constituição Federal.`)
      });
    } else {
      resultados.push({
        tipo: 'compliant',
        titulo: 'Salário',
        descricao: linkify(`O salário recebido de R$ ${dados.salarioRecebido.toFixed(2)} está de acordo com o salário mínimo vigente conforme Art. 7º, IV, da Constituição Federal.`)
      });
    }

    // Descanso Semanal
    if (dados.descansoSemanal === '0') {
      resultados.push({
        tipo: 'non-compliant',
        titulo: 'Descanso Semanal',
        descricao: linkify(`Não há descanso semanal garantido conforme o Art. 67 da CLT, que prevê pelo menos 24 horas consecutivas de descanso.`)
      });
    } else {
      const diasDescanso = dados.descansoSemanal === '1' ? '1 dia' : '2 dias';
      resultados.push({
        tipo: 'compliant',
        titulo: 'Descanso Semanal',
        descricao: linkify(`Descanso semanal de ${diasDescanso} está conforme o Art. 67 da CLT.`)
      });
    }

    // Assinatura da Carteira de Trabalho
    if (dados.tipoContrato !== 'Autônomo') {
      if (dados.assinaturaCT === 'Não') {
        resultados.push({
          tipo: 'non-compliant',
          titulo: 'Carteira de Trabalho',
          descricao: linkify(`A Carteira de Trabalho não está assinada, o que é obrigatório para contratos de trabalho não-autônomos conforme Art. 29 da CLT.`)
        });
      } else {
        resultados.push({
          tipo: 'compliant',
          titulo: 'Carteira de Trabalho',
          descricao: linkify(`A Carteira de Trabalho está devidamente assinada conforme exigido pela legislação.`)
        });
      }
    } else {
      resultados.push({
        tipo: 'compliant',
        titulo: 'Carteira de Trabalho',
        descricao: linkify(`Como contrato de Autônomo, não é obrigatório o registro na Carteira de Trabalho conforme Art. 3º da CLT.`)
      });
    }

    // Benefícios
    const beneficiosObrigatorios = ['Vale-Transporte', 'Vale-Alimentação', '13º Salário', 'Férias'];
    beneficiosObrigatorios.forEach(beneficio => {
      if (!dados.beneficios.includes(beneficio)) {
        resultados.push({
          tipo: 'non-compliant',
          titulo: `Benefício - ${beneficio}`,
          descricao: linkify(`O benefício ${beneficio} não está sendo fornecido, o que é obrigatório conforme a legislação trabalhista.`)
        });
      } else {
        resultados.push({
          tipo: 'compliant',
          titulo: `Benefício - ${beneficio}`,
          descricao: linkify(`O benefício ${beneficio} está sendo fornecido conforme exigido pela legislação trabalhista.`)
        });
      }
    });

    // Condições de Trabalho
    if (dados.condicoes.length === 0) {
      resultados.push({
        tipo: 'non-compliant',
        titulo: 'Condições de Trabalho',
        descricao: linkify(`Nenhuma condição de trabalho foi informada. É obrigatório fornecer informações sobre as condições de trabalho conforme Art. 154 da CLT.`)
      });
    } else {
      // Verifica se o ambiente possui riscos de acidentes
      const ambienteRiscos = dados.condicoes.includes('Ambiente com Riscos de Acidentes');
      const epIsFornecidos = dados.condicoes.includes('EPIs Fornecidos');

      if (ambienteRiscos) {
        if (epIsFornecidos) {
          resultados.push({
            tipo: 'compliant',
            titulo: 'Condições de Trabalho - EPIs',
            descricao: linkify(`Os Equipamentos de Proteção Individual (EPIs) estão sendo fornecidos em um ambiente com riscos de acidentes, conforme exigido pela NR-6 da NR de Segurança e Saúde no Trabalho.`)
          });
        } else {
          resultados.push({
            tipo: 'non-compliant',
            titulo: 'Condições de Trabalho - EPIs',
            descricao: linkify(`Não há fornecimento de Equipamentos de Proteção Individual (EPIs) em um ambiente com riscos de acidentes, o que é obrigatório conforme a NR-6 da NR de Segurança e Saúde no Trabalho e Art. 154 da CLT.`)
          });
        }
      } else {
        // Se o ambiente não possui riscos de acidentes, mas EPIs são fornecidos, verificar se é necessário
        if (epIsFornecidos) {
          resultados.push({
            tipo: 'compliant',
            titulo: 'Condições de Trabalho - EPIs',
            descricao: linkify(`Os Equipamentos de Proteção Individual (EPIs) estão sendo fornecidos mesmo em um ambiente sem riscos de acidentes, o que demonstra preocupação com a saúde e segurança dos trabalhadores.`)
          });
        } else {
          // Ambiente sem riscos e sem EPIs fornecidos
          resultados.push({
            tipo: 'compliant',
            titulo: 'Condições de Trabalho',
            descricao: linkify(`As condições de trabalho estão adequadas, sem presença de riscos de acidentes que demandariam o fornecimento de EPIs, conforme Art. 154 da CLT.`)
          });
        }
      }

      // Outras condições de trabalho podem ser avaliadas aqui
      // Por exemplo, ambiente ergonômico, limpeza, etc.
      // Adicione mais verificações conforme necessário
    }

    return resultados;
  }

  // Manipular a submissão do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Coletar os dados do formulário
    const dados = {
      nome: document.getElementById('nome-completo').value,
      cargo: document.getElementById('cargo').value,
      tipoContrato: document.getElementById('tipo-contrato').value,
      horasSemana: parseInt(document.getElementById('horas-semana').value),
      horasDiarias: parseInt(document.getElementById('carga-diaria').value),
      descansoSemanal: document.getElementById('descanso-semanal').value,
      horasExtras: horasExtrasCheckbox.checked ? 'Sim' : 'Não',
      quantidadeExtras: horasExtrasCheckbox.checked ? parseInt(document.getElementById('quantidade-extras').value) : 0,
      beneficios: Array.from(document.querySelectorAll('input[name="beneficios"]:checked')).map(el => el.value),
      frequenciaPagamento: document.getElementById('frequencia-pagamento').value,
      salarioRecebido: parseFloat(document.getElementById('salario-recebido').value),
      assinaturaCT: document.getElementById('assinatura-ct').checked ? 'Sim' : 'Não',
      condicoes: Array.from(document.querySelectorAll('input[name="condicoes"]:checked')).map(el => el.value)
    };

    // Analisar os dados
    const resultados = analisarFormulario(dados);

    // Preencher a seção de resultados
    resultadoAnalisado.innerHTML = resultados.map(res => `
      <div class="${res.tipo}">
        <h3>${res.titulo}: <span class="${res.tipo}">${res.tipo === 'compliant' ? 'Dentro da Lei' : 'Fora da Lei'}</span></h3>
        <p class="justificativa">${res.descricao}</p>
      </div>
      <br>
    `).join('');

    // Exibir a seção de resultados
    formSteps[currentStep].classList.remove('active');
    currentStep++;
    formSteps[currentStep].classList.add('active');

    // Adicionar classe para ocultar os painéis na etapa de Resultados
    container.classList.add('hide-panels');
  });

  // Resetar o formulário e voltar para a primeira etapa
  // Caso ainda queira manter o botão de reset, você pode adicionar de volta
  /*
  resetBtn.addEventListener('click', () => {
    form.reset();
    resultadoAnalisado.innerHTML = '';
    currentStep = 0;
    formSteps.forEach(step => step.classList.remove('active'));
    formSteps[currentStep].classList.add('active');
    extraHoursField.style.display = 'none';
    container.classList.remove('hide-panels');
  });
  */

  // Abrir o modal ao clicar no botão de contatar advocacias
  contactLawfirmsBtn.addEventListener('click', () => {
    abrirModal();
  });

  // Fechar o modal ao clicar no 'X'
  closeButton.addEventListener('click', () => {
    fecharModal();
  });

  // Fechar o modal ao clicar fora do conteúdo do modal
  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      fecharModal();
    }
  });

  // Função para abrir o modal e preencher a lista de advocacias
  function abrirModal() {
    preencherLawfirmList();
    modal.style.display = 'block';
  }

  // Função para fechar o modal
  function fecharModal() {
    modal.style.display = 'none';
  }

  // Função para preencher a lista de advocacias no modal
  function preencherLawfirmList() {
    lawfirmList.innerHTML = ''; // Limpa a lista atual

    lawfirms.forEach(lawfirm => {
      const lawfirmDiv = document.createElement('div');
      lawfirmDiv.classList.add('lawfirm');

      lawfirmDiv.innerHTML = `
        <h3>${lawfirm.name}</h3>
        <p>${lawfirm.description}</p>
        <button class="send-form-btn" data-email="${lawfirm.email}">Enviar Formulário</button>
      `;

      lawfirmList.appendChild(lawfirmDiv);
    });

    // Adicionar event listeners aos botões de envio
    const sendFormBtns = document.querySelectorAll('.send-form-btn');
    sendFormBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const email = btn.getAttribute('data-email');
        enviarFormularioPorEmail(email);
      });
    });
  }

  // Função para enviar o formulário por email (simulação)
  function enviarFormularioPorEmail(email) {
    // Coletar os dados do formulário novamente
    const dados = {
      nome: document.getElementById('nome-completo').value,
      cargo: document.getElementById('cargo').value,
      tipoContrato: document.getElementById('tipo-contrato').value,
      horasSemana: parseInt(document.getElementById('horas-semana').value),
      horasDiarias: parseInt(document.getElementById('carga-diaria').value),
      descansoSemanal: document.getElementById('descanso-semanal').value,
      horasExtras: horasExtrasCheckbox.checked ? 'Sim' : 'Não',
      quantidadeExtras: horasExtrasCheckbox.checked ? parseInt(document.getElementById('quantidade-extras').value) : 0,
      beneficios: Array.from(document.querySelectorAll('input[name="beneficios"]:checked')).map(el => el.value),
      frequenciaPagamento: document.getElementById('frequencia-pagamento').value,
      salarioRecebido: parseFloat(document.getElementById('salario-recebido').value),
      assinaturaCT: document.getElementById('assinatura-ct').checked ? 'Sim' : 'Não',
      condicoes: Array.from(document.querySelectorAll('input[name="condicoes"]:checked')).map(el => el.value)
    };

    // Formatar os dados para o email
    const assunto = encodeURIComponent('Novo Formulário de Análise Trabalhista');
    const corpo = encodeURIComponent(JSON.stringify(dados, null, 2));

    // Criar o link mailto
    const mailtoLink = `mailto:${email}?subject=${assunto}&body=${corpo}`;

    // Abrir o cliente de email padrão com os dados preenchidos
    window.location.href = mailtoLink;

    // Opcional: fechar o modal após enviar
    fecharModal();
  }

  // Adicionar redirecionamento para home.html ao clicar no ícone de home
  const homeIcon = document.querySelector('.home-icon');
  
  if (homeIcon) {
    homeIcon.addEventListener('click', () => {
      console.log('Ícone de home clicado - redirecionando para home.html');
      window.location.href = 'home.html'; // Redireciona para a página home
    });
  }
});
