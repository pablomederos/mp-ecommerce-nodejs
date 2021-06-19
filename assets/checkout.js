// Agrega credenciales de SDK
const mp = new MercadoPago('APP_USR-7eb0138a-189f-4bec-87d1-c0504ead5626', {
    locale: 'es-AR'
});

// Inicializa el checkout
mp.checkout({
  preference: {
      id: preferenceid
  },
  render: {
        container: '.cho-container', // Indica dónde se mostrará el botón de pago
        label: 'Pagar la compra', // Cambia el texto del botón de pago (opcional)
  }
});