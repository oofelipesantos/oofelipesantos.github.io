const contactForm = document.getElementById('cform');
const contactSubmit = document.getElementById('submitBtn');

function dialogTheme() {
  const styles = getComputedStyle(document.documentElement);
  return {
    background: styles.getPropertyValue('--surface').trim(),
    color: styles.getPropertyValue('--ink').trim(),
    confirmButtonColor: styles.getPropertyValue('--accent').trim()
  };
}

async function showMessage(options) {
  if (typeof Swal !== 'undefined') {
    return Swal.fire({ ...options, ...dialogTheme() });
  }
  window.alert(options.text || options.title);
}

function fillCampaignFields() {
  const campaign = window.portfolioCampaign || {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'landing_page'].forEach((key) => {
    const field = document.getElementById(key);
    if (field) field.value = campaign[key] || '';
  });
}

fillCampaignFields();

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  if (!formData.get('h-captcha-response')) {
    await showMessage({
      title: 'Captcha obrigatório',
      text: 'Confirme que você não é um robô antes de enviar.',
      icon: 'warning'
    });
    return;
  }

  const service = String(formData.get('servico') || 'Projeto de software');
  formData.set('subject', 'Novo projeto pelo portfólio — ' + service);
  const originalContent = contactSubmit.innerHTML;
  contactSubmit.disabled = true;
  contactSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();

    if (!result.success) throw new Error('Falha no envio');

    window.portfolioTrack?.('generate_lead', {
      method: 'form',
      service
    });

    contactForm.reset();
    fillCampaignFields();
    if (typeof hcaptcha !== 'undefined') hcaptcha.reset();
    await showMessage({
      title: 'Contexto enviado',
      text: 'Obrigado. Vou analisar as informações e retornar pelo e-mail informado.',
      icon: 'success'
    });
  } catch (error) {
    await showMessage({
      title: 'Não foi possível enviar',
      text: 'Tente novamente em alguns minutos ou use o LinkedIn como canal alternativo.',
      icon: 'error'
    });
  } finally {
    contactSubmit.disabled = false;
    contactSubmit.innerHTML = originalContent;
  }
});
