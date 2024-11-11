// home.js

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const profileBtn = document.getElementById('profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeProfileBtn = profileModal.querySelector('.close-button');
    const fillFormBtn = document.getElementById('fill-form-btn');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
  
    // Função para abrir o menu lateral
    menuBtn.addEventListener('click', () => {
      sideMenu.classList.toggle('open');
    });
  
    // Função para fechar o menu lateral
    closeMenuBtn.addEventListener('click', () => {
      sideMenu.classList.remove('open');
    });
  
    // Fechar o menu ao clicar em um item do menu (opcional)
    sideMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        sideMenu.classList.remove('open');
      });
    });
  
    // Função para abrir o modal de perfil
    profileBtn.addEventListener('click', () => {
      profileModal.style.display = 'block';
    });
  
    // Função para fechar o modal de perfil
    closeProfileBtn.addEventListener('click', () => {
      profileModal.style.display = 'none';
    });
  
    // Fechar o modal de perfil ao clicar fora do conteúdo
    window.addEventListener('click', (event) => {
      if (event.target == profileModal) {
        profileModal.style.display = 'none';
      }
    });
  
    // Redirecionar para o formulário ao clicar no botão
    fillFormBtn.addEventListener('click', () => {
      window.location.href = 'form.html'; // Substitua pelo caminho correto do seu formulário
    });
  
    // Função para lidar com o clique em "Ler Mais"
    readMoreBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const articleCard = btn.parentElement;
        const articleTitle = articleCard.querySelector('h3').innerText;
        const articleContent = obterConteudoArtigo(articleTitle);
        exibirArtigoModal(articleTitle, articleContent);
      });
    });
  
    // Função para obter o conteúdo completo do artigo (simulação)
    function obterConteudoArtigo(titulo) {
      const artigos = {
        'Direitos Trabalhistas Básicos': `
          <p>Os direitos trabalhistas no Brasil são garantidos pela Consolidação das Leis do Trabalho (CLT) e pela Constituição Federal. Entre os principais direitos estão:</p>
          <ul>
            <li>Jornada de trabalho de 44 horas semanais.</li>
            <li>Salário mínimo garantido.</li>
            <li>Descanso semanal remunerado.</li>
            <li>Férias anuais remuneradas.</li>
            <li>FGTS (Fundo de Garantia do Tempo de Serviço).</li>
            <li>Licença maternidade e paternidade.</li>
          </ul>
        `,
        'Jornada de Trabalho': `
          <p>A jornada de trabalho no Brasil é regulamentada pela CLT. A jornada padrão é de 44 horas semanais, distribuídas em até 8 horas diárias. Horas extras são permitidas, desde que não excedam o limite legal e sejam devidamente remuneradas.</p>
        `,
        'Salário Mínimo': `
          <p>O salário mínimo é o menor valor que um empregador pode pagar a um trabalhador por seus serviços. Ele é ajustado anualmente pelo governo para refletir a inflação e outras variáveis econômicas.</p>
        `
        // Adicione mais artigos conforme necessário
      };
  
      return artigos[titulo] || '<p>Conteúdo não disponível.</p>';
    }
  
    // Função para exibir o modal do artigo
    function exibirArtigoModal(titulo, conteudo) {
      // Criar o modal dinamicamente
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-button">&times;</span>
          <h2>${titulo}</h2>
          ${conteudo}
        </div>
      `;
      document.body.appendChild(modal);
  
      // Exibir o modal
      modal.style.display = 'block';
  
      // Adicionar event listener para fechar o modal
      const closeBtn = modal.querySelector('.close-button');
      closeBtn.addEventListener('click', () => {
        modal.remove();
      });
  
      // Fechar o modal ao clicar fora do conteúdo
      window.addEventListener('click', (event) => {
        if (event.target == modal) {
          modal.remove();
        }
      });
    }
  });
  