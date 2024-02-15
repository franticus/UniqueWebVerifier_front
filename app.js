// Получаем элементы
const dropZone = document.getElementById('drop_zone');
const dropZoneWindow = document.querySelector('.drop_zone_window');
const fileInput = document.getElementById('fileInput');
const resultList = document.getElementById('resultList');

// Обработчик перетаскивания файла на dropZone
function handleDragOver(event) {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

// Обработчик выбора файла
function handleFileSelect(event) {
  event.stopPropagation();
  event.preventDefault();

  const files = event.dataTransfer
    ? event.dataTransfer.files
    : event.target.files;
  if (files.length > 0) {
    sendFileToServer(files[0]);
  }
}

// Отправка файла на сервер
function sendFileToServer(file) {
  const formData = new FormData();
  formData.append('siteZip', file);

  fetch('http://localhost:3001/upload', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json()) // Предполагаем, что ответ в формате JSON
    .then(data => {
      console.log('data:', data);
      updateResultList(data); // Обновляем список на основе полученных данных
    })
    .catch(error => {
      console.error('Ошибка:', error);
    });
}

// Обновление списка результатов на странице
function updateResultList(data) {
  resultList.innerHTML = ''; // Очищаем текущий список

  // Перебор данных для создания элементов списка с показателями в span
  data.forEach((item, index) => {
    const listItem = document.createElement('li');

    if (index > 0) {
      const nameSpan = document.createElement('span');
      nameSpan.textContent = `${item.name}`;
      listItem.appendChild(nameSpan);

      const uniqueSpan = document.createElement('span');
      uniqueSpan.textContent = ` | Уникальность: ${item.uniquePercentage} %`;
      listItem.appendChild(uniqueSpan);
    } else {
      listItem.style.padding = '20px';
      listItem.style.border = 'none';
      listItem.style.pointerEvents = 'none';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = `${item.name}`;
      nameSpan.style.fontWeight = '600';
      listItem.appendChild(nameSpan);
    }

    // Добавляем элемент списка в resultList
    resultList.appendChild(listItem);
  });
}

// Назначение обработчиков событий
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
dropZoneWindow.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', handleFileSelect);
