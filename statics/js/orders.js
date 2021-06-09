const $orderForm = document.getElementById('order-form');
const $addItemForm = document.getElementById('order-add-product-form');
const $newProductSelect = document.getElementById('order-new-product');
const $newItemQuantityInput = document.getElementById(
  'order-new-product-quantity',
);
const $orderProductList = document.getElementById('order-product-list');

function removeItemFromOrder(id) {
  const $item = $orderProductList.querySelector(`li[data-id="${id}"]`);
  $item?.remove($item);

  const $itemInput = $orderForm.querySelector(`input[data-id="${id}"]`);
  $itemInput?.remove();
}

function buildItemInput(id, name, quantity) {
  const $itemInput = document.createElement('input');
  $itemInput.type = 'hidden';
  $itemInput.name = 'items[]';
  $itemInput.value = JSON.stringify({
    product: id,
    productName: name,
    quantity: quantity,
  });
  $itemInput.dataset.id = id;
  $orderForm.appendChild($itemInput);
}

function buildProductListItem(id, name, quantity) {
  const $newProductListItem = document.createElement('li');
  $newProductListItem.classList.add('list-group-item', 'd-flex');
  $newProductListItem.dataset.id = id;
  $newProductListItem.innerHTML = `
      <span class="flex-grow-1 m-auto">${name}</span>
      <span class="mx-4 m-auto">${quantity}</span>
      <button class="btn btn-link" type="button" onclick="removeItemFromOrder('${id}')">Remover</button>
    `;
  $orderProductList.appendChild($newProductListItem);
}

function resetAddProductForm() {
  $newProductSelect.selectedIndex = 0;
  $newItemQuantityInput.value = '';
  $newItemQuantityInput.disabled = 'disabled';
}

function newProductSelectChange() {
  const $selectedOption =
    $newProductSelect.options[$newProductSelect.selectedIndex];
  $newItemQuantityInput.disabled = $selectedOption.value ? false : 'disabled';
}

function addProductToOrder(id, name, quantity) {
  removeItemFromOrder(id);

  buildProductListItem(id, name, quantity);
  buildItemInput(id, name, quantity);

  $newProductSelect.focus();
}

function orderAddItemFormSubmit(ev) {
  ev.preventDefault();

  const $selectedOption =
    $newProductSelect.options[$newProductSelect.selectedIndex];
  addProductToOrder(
    $selectedOption.value,
    $selectedOption.text,
    +$newItemQuantityInput.value,
  );

  resetAddProductForm();
}

function buildInitialProductsListItems() {
  var jsonElement = document.getElementById('initialItems');
  var products = jsonElement.value ? JSON.parse(jsonElement.value) : [];
  products.forEach((p) => addProductToOrder(p?.product, p?.productName, p?.quantity));
}

$newProductSelect.addEventListener('change', newProductSelectChange);
$addItemForm.addEventListener('submit', orderAddItemFormSubmit);

buildInitialProductsListItems();
