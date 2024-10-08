// connection check
// console.log("js");
// ! Düzzenleme modu değişkenleri
let editMode = false; // Düzenleme modunu belirleyecek değişken
let editItem; // Düzenleme elemanının belirleyecek değişken
let editItemId; // Düzenleme elemanının id si

// ! Accessing elements from HTML

const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");

// fonction
// fonksiyon gönderildiğinde çalışacak fonksiyon
const addItem = (e) => {
  // sayfa yenilenmesini iptal et
  e.preventDefault();
  const value = input.value;
  if (value !== "" && !editMode) {
    // silme işlemleri için benzersiz değere ihtiyacımız var bunun için id oluşturduk
    const id = new Date().getTime().toString();
    console.log(id);
    createElement(id, value);
    setToDefault();
    addToLocalStorage(id, value);
    showAlert("Eleman Eklendi", "success");
  } else if (value !== "" && editMode) {
    editItem.innerHTML = value;
    updateLocalStorage(editItemId, value);
    showAlert("Eleman Güncellendi", "success");
    setToDefault();
  }
};
// uyarı veren fonksiyon
const showAlert = (text, action) => {
  // Alert kısımının içeriğini belirler
  alert.textContent = `${text}`;
  // Alert kısımına class ekle
  alert.classList.add(`alert-${action}`);
  // alert kısmının içeriğini güncelle ve ekelenen classı kaldır
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};
// elamanları silen fonksiyon
const deleteItem = (e) => {
  // silmek istenen elemana eriş
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  // bu elemanı kaldır
  itemList.removeChild(element);
  // local den kaldır
  removeFromLocalStorage(id);
  showAlert("Eleman Silindi ", "danger");
  // eğerki hiç eleman yoksa clear list butonunu kaldır
  if (!itemList.children.length) {
    clearButton.style.display = "none";
  }
};
// elemanları güncelleyen fonksiyon
const editItems = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editItem = e.target.parentElement.parentElement.previousElementSibling;
  input.value = editItem.innerText;
  editMode = true;
  editItemId = element.dataset.id;
  addButton.textContent = "Düzenle";
};
// varsayılan değerlere döndüren fonksiyon
const setToDefault = () => {
  input.value = "";
  editMode = false;
  editItemId = "";
  addButton.textContent = "Ekle";
};

// sayfa yüklendiğinde elemanları render edecek fonksiyon
const renderItems = () => {
  let items = getFromLocalStorage();
  console.log(items);
  if (items.length > 0) {
    console.log("render başladı");
    items.forEach((item) => createElement(item.id, item.value));
  }
};

// eleman oluşturan fonksiyon
const createElement = (id, value) => {
  console.log(id, value);
  const newDiv = document.createElement("div");
  // bu div e attribute ekle
  newDiv.setAttribute("data-id", id); // setAttribute ile bir elemana   attribute ekleyebiliriz.Bu özellik bizden eklenecek özelliğin adını ve bu özelliğin değerini ister

  // Bu div e class ekle
  newDiv.classList.add("items-list-item");
  // bu div e class ekle
  newDiv.classList.add("items-list-item");
  // bu divin html içeriğini ekle
  newDiv.innerHTML = `
            <p class="item-name">${value}</p>
            <div class="btn-container">
              <button class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
  
  
  `;
  //delete butonuna eriş
  const deleteBtn = newDiv.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);

  //edit butonuna eriş
  const editBtn = newDiv.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItems);

  itemList.appendChild(newDiv);
  showAlert("Eleman eklendi", "success");
};
// sıfırlama yapan fonksiyon
const clearItems = () => {
  const items = document.querySelectorAll(".items-list-item");
  if (items.length > 0) {
    items.forEach((item) => {
      itemList.removeChild(item);
    });
    clearButton.style.display = "none";
    showAlert("Liste Boş ", "danger");
    // localStorage ı temizle
    localStorage.removeItem("items");
  }
};
// localstrage a kayıt yapan fonksiyon
const addToLocalStorage = (id, value) => {
  const item = { id, value };
  let items = getFromLocalStorage();
  console.log(items);
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
};
// localstorage dan verileri alan fonkisiyon
const getFromLocalStorage = () => {
  return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
};
// localstorage dan verileri kaldıran fonksiyon
const removeFromLocalStorage = (id) => {
  let items = getFromLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
};
// localstorage ı güncelleyen fonksiyon
const updateLocalStorage = (id, newValue) => {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      // Spread Operatör :bu özellik bir elemanı güncellerken veri kaybını önlemek için kullanılır
      //yani Burada value kısımını güncelledik bunun dışında kalan items özelliklerini ise sabit tuttuk
      return {
        ...item,
        value: newValue,
      };
    }
    return item;
  });
  localStorage.setItem("items", JSON.stringify(items));
};

// ? event listener

form.addEventListener("submit", addItem);

// sayfanın yüklendiği anı yakala
window.addEventListener("DOMContentLoaded", renderItems);
// clear butona tıklanınca elemanları sıfırlama
clearButton.addEventListener("click", clearItems);
