const contactForm = document.getElementById('cform');
const contactSubmit = document.getElementById('submitBtn');

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  if (!formData.get('h-captcha-response')) {
    await Swal.fire({
      title: 'Captcha obrigatório',
      text: 'Confirme que você não é um robô antes de enviar.',
      icon: 'warning',
      background: '#0e1420',
      color: '#e8f0ff',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }

  formData.set('subject', `Contato pelo portfólio — ${formData.get('servico')}`);
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

    contactForm.reset();
    if (typeof hcaptcha !== 'undefined') hcaptcha.reset();
    await Swal.fire({
      title: 'Mensagem enviada',
      text: 'Obrigado pelo contato. Retornarei assim que possível.',
      icon: 'success',
      background: '#0e1420',
      color: '#e8f0ff',
      confirmButtonColor: '#3b82f6'
    });
  } catch (error) {
    await Swal.fire({
      title: 'Não foi possível enviar',
      text: 'Tente novamente ou use o LinkedIn como canal alternativo.',
      icon: 'error',
      background: '#0e1420',
      color: '#e8f0ff',
      confirmButtonColor: '#3b82f6'
    });
  } finally {
    contactSubmit.disabled = false;
    contactSubmit.innerHTML = originalContent;
  }
});
