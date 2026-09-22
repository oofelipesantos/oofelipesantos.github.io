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

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  if (!formData.get('h-captcha-response')) {
    await Swal.fire({
      title: 'Captcha obrigatório',
      text: 'Confirme que você não é um robô antes de enviar.',
      icon: 'warning',
      ...dialogTheme()
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
      ...dialogTheme()
    });
  } catch (error) {
    await Swal.fire({
      title: 'Não foi possível enviar',
      text: 'Tente novamente ou use o LinkedIn como canal alternativo.',
      icon: 'error',
      ...dialogTheme()
    });
  } finally {
    contactSubmit.disabled = false;
    contactSubmit.innerHTML = originalContent;
  }
});
