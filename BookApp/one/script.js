// Навигация между страницами
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const pageId = this.getAttribute('data-page');
    
    // Скрыть все страницы
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Показать выбранную страницу
    document.getElementById(pageId).classList.add('active');
    
    // Обновить активную ссылку в навигации
    document.querySelectorAll('nav a').forEach(navLink => {
      navLink.classList.remove('nav-active');
    });
    this.classList.add('nav-active');
  });
});

// Корзина
let cart = [];
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const emptyCartElement = document.getElementById('empty-cart');

// Функция обновления корзины
function updateCart() {
  // Очистить контейнер
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.appendChild(emptyCartElement);
    emptyCartElement.style.display = 'block';
  } else {
    emptyCartElement.style.display = 'none';
    
    // Добавить товары в корзину
    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-details">
          <h3>${item.title}</h3>
          <p>${item.author}</p>
          <span class="price">${item.price} BYN</span>
        </div>
        <div class="cart-item-actions">
          <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
          <button class="remove-btn" data-index="${index}">Удалить</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
  }
  
  // Обновить общую сумму
  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  cartTotalElement.textContent = `${total.toFixed(2)} BYN`;
  
  // Обновить счетчик товаров
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = totalItems;
}

// Добавление товара в корзину
document.querySelectorAll('.buy-btn').forEach(button => {
  button.addEventListener('click', function() {
    const bookTitle = this.getAttribute('data-book');
    const bookAuthor = this.getAttribute('data-author');
    const bookPrice = this.getAttribute('data-price');
    const bookImage = this.closest('.book-card').querySelector('img').src;
    
    // Проверить, есть ли книга уже в корзине
    const existingItemIndex = cart.findIndex(item => item.title === bookTitle);
    
    if (existingItemIndex !== -1) {
      // Увеличить количество
      cart[existingItemIndex].quantity += 1;
    } else {
      // Добавить новый товар
      cart.push({
        title: bookTitle,
        author: bookAuthor,
        price: bookPrice,
        image: bookImage,
        quantity: 1
      });
    }
    
    updateCart();
    
    // Показать уведомление
    alert(`Книга "${bookTitle}" добавлена в корзину!`);
  });
});

// Обработчики событий для корзины
document.addEventListener('click', function(e) {
  // Увеличение/уменьшение количества
  if (e.target.classList.contains('quantity-btn')) {
    const index = parseInt(e.target.getAttribute('data-index'));
    const action = e.target.getAttribute('data-action');
    
    if (action === 'increase') {
      cart[index].quantity += 1;
    } else if (action === 'decrease' && cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    }
    
    updateCart();
  }
  
  // Удаление товара
  if (e.target.classList.contains('remove-btn')) {
    const index = parseInt(e.target.getAttribute('data-index'));
    cart.splice(index, 1);
    updateCart();
  }
});

// Форма обратной связи
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
  this.reset();
});

// Поиск
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

searchButton.addEventListener('click', function() {
  performSearch();
});

searchInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    performSearch();
  }
});

function performSearch() {
  const query = searchInput.value.toLowerCase();
  if (query.trim() === '') return;
  
  // Здесь можно реализовать поиск по каталогу
  alert(`Поиск: ${query}`);
  // В реальном приложении здесь будет запрос к серверу или фильтрация товаров
}

// Слайдер "Хиты недели"
const hitsSlider = document.getElementById('hits-slider');
const hitsSlides = document.querySelectorAll('#hits-slider .slide');
const prevHitsBtn = document.getElementById('prev-hits-slide');
const nextHitsBtn = document.getElementById('next-hits-slide');
const hitsDotsContainer = document.getElementById('hits-slider-dots');

let currentHitsSlide = 0;
const totalHitsSlides = hitsSlides.length;

// Создание точек для навигации
hitsSlides.forEach((_, index) => {
  const dot = document.createElement('div');
  dot.classList.add('slider-dot');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToHitsSlide(index));
  hitsDotsContainer.appendChild(dot);
});

// Функция перехода к конкретному слайду
function goToHitsSlide(slideIndex) {
  currentHitsSlide = slideIndex;
  hitsSlider.style.transform = `translateX(-${currentHitsSlide * 100}%)`;
  
  // Обновление активной точки
  document.querySelectorAll('#hits-slider-dots .slider-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentHitsSlide);
  });
}

// Следующий слайд
function nextHitsSlide() {
  currentHitsSlide = (currentHitsSlide + 1) % totalHitsSlides;
  goToHitsSlide(currentHitsSlide);
}

// Предыдущий слайд
function prevHitsSlide() {
  currentHitsSlide = (currentHitsSlide - 1 + totalHitsSlides) % totalHitsSlides;
  goToHitsSlide(currentHitsSlide);
}

// Обработчики событий для кнопок
prevHitsBtn.addEventListener('click', prevHitsSlide);
nextHitsBtn.addEventListener('click', nextHitsSlide);

// Автоматическое перелистывание
let hitsSlideInterval = setInterval(nextHitsSlide, 4000);

// Остановка автоматического перелистывания при наведении
hitsSlider.addEventListener('mouseenter', () => {
  clearInterval(hitsSlideInterval);
});

// Возобновление автоматического перелистывания при уходе курсора
hitsSlider.addEventListener('mouseleave', () => {
  hitsSlideInterval = setInterval(nextHitsSlide, 4000);
});

// Авторизация/Регистрация
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

authTabs.forEach(tab => {
  tab.addEventListener('click', function() {
    const tabId = this.getAttribute('data-tab');
    
    // Обновить активную вкладку
    authTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    
    // Показать соответствующую форму
    authForms.forEach(form => {
      form.classList.remove('active');
      if (form.id === `${tabId}-form`) {
        form.classList.add('active');
      }
    });
  });
});

// Обработка формы входа
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  alert(`Добро пожаловать, ${email}!`);
  this.reset();
});

// Обработка формы регистрации
document.getElementById('register-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  if (password !== confirmPassword) {
    alert('Пароли не совпадают!');
    return;
  }
  
  alert(`Регистрация успешна! Добро пожаловать, ${name}!`);
  this.reset();
  
  // Переключиться на вкладку входа
  authTabs.forEach(t => t.classList.remove('active'));
  document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
  
  authForms.forEach(form => form.classList.remove('active'));
  document.getElementById('login-form').classList.add('active');
});

// Инициализация корзины
updateCart();