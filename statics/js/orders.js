const $orderForm = document.getElementById('order-form');
const $addProductForm = document.getElementById('order-add-product-form');
const $newProductSelect = document.getElementById('order-new-product');
const $newProductQuantityInput = document.getElementById(
  'order-new-product-quantity',
);
const $orderProductList = document.getElementById('order-product-list');

function removeProductFromOrder(id) {
  const $item = $orderProductList.querySelector(`li[data-id="${id}"]`);
  if ($item) {
    $orderProductList.removeChild($item);
  }

  const $productInput = $orderForm.querySelector(`input[value="${id}"]`);
  if ($productInput) {
    $productInput?.remove();
  }

  const $productQuantityInput = $orderForm.querySelector(
    `input[data-id="${id}"]`,
  );
  if ($productQuantityInput) {
    $productQuantityInput?.remove();
  }
}

function buildProductInput(id, quantity) {
  const $productInput = document.createElement('input');
  $productInput.type = 'hidden';
  $productInput.name = 'products[]';
  $productInput.value = id;
  $orderForm.appendChild($productInput);

  const $productQuantityInput = document.createElement('input');
  $productQuantityInput.type = 'hidden';
  $productQuantityInput.name = 'productsQuantities[]';
  $productQuantityInput.dataset.id = id;
  $productQuantityInput.value = quantity;
  $orderForm.appendChild($productQuantityInput);
}

function buildProductListItem(id, name, quantity) {
  const $newProductListItem = document.createElement('li');
  $newProductListItem.classList.add('list-group-item', 'd-flex');
  $newProductListItem.dataset.id = id;
  $newProductListItem.innerHTML = `
      <span class="flex-grow-1 m-auto">${name}</span>
      <span class="mx-4 m-auto">${quantity}</span>
      <button class="btn btn-link" type="button" onclick="removeProductFromOrder('${id}')">Remover</button>
    `;
  $orderProductList.appendChild($newProductListItem);
}

function resetAddProductForm() {
  $newProductSelect.selectedIndex = 0;
  $newProductQuantityInput.value = '';
  $newProductQuantityInput.disabled = 'disabled';
}

function newProductSelectChange() {
  const $selectedOption =
    $newProductSelect.options[$newProductSelect.selectedIndex];
  $newProductQuantityInput.disabled = $selectedOption.value
    ? false
    : 'disabled';
}

function addProductToOrder(id, name, quantity) {
  removeProductFromOrder(id);

  buildProductListItem(id, name, quantity);
  buildProductInput(id, quantity);

  $newProductSelect.focus();
}

function orderAddProductFormSubmit(ev) {
  ev.preventDefault();

  const $selectedOption =
    $newProductSelect.options[$newProductSelect.selectedIndex];
  addProductToOrder(
    $selectedOption.value,
    $selectedOption.text,
    +$newProductQuantityInput.value,
  );

  resetAddProductForm();
}

function buildInitialProductsListItems() {
  var jsonElement = document.getElementById('initialProducts');
  var products = JSON.parse(jsonElement.textContent);
  console.log(products);
  products.forEach((p) => addProductToOrder(...p));
}

$newProductSelect.addEventListener('change', newProductSelectChange);
$addProductForm.addEventListener('submit', orderAddProductFormSubmit);

buildInitialProductsListItems();
