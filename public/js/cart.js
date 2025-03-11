document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const productId = button.dataset.productId;
      const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('Producto añadido al carrito');
      } else {
        alert('Error al añadir el producto al carrito');
      }
    });
  });

  document.querySelectorAll('.remove-from-cart').forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const productId = button.dataset.productId;
      const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Producto eliminado del carrito');
      } else {
        alert('Error al eliminar el producto del carrito');
      }
    });
  });

  document.querySelector('.clear-cart').addEventListener('click', async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/carts/${cartId}/clear`, {
      method: 'POST',
    });
    if (response.ok) {
      alert('Carrito vaciado');
    } else {
      alert('Error al vaciar el carrito');
    }
  });

  document.querySelectorAll('.update-cart').forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const productId = button.dataset.productId;
      const quantity = button.previousElementSibling.value;
      const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      if (response.ok) {
        alert('Cantidad actualizada');
      } else {
        alert('Error al actualizar la cantidad del producto');
      }
    });
  });
});