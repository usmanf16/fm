const fileInput = document.getElementById('fileInput');
const toggleButton = document.getElementById('toggleButton');
const fileContainer = document.getElementById('fileContainer');
let isGridView = false;

// Add event listener for file input change
fileInput.addEventListener('change', handleFiles);

// Add event listener for toggle button click
toggleButton.addEventListener('click', toggleView);

// Add a click event listener to close the dropdown when clicking outside of it
document.addEventListener('click', (event) => {
  const optionsMenus = document.querySelectorAll('.options-menu');
  optionsMenus.forEach((menu) => {
    if (!menu.contains(event.target)) {
      menu.style.display = 'none';
    }
  });
});

function handleFiles() {
  const files = fileInput.files;

  // Clear the file container
  fileContainer.innerHTML = '';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const item = document.createElement(isGridView ? 'div' : 'div');
    item.classList.add('item', 'list'); // Add 'list' class for list view

    // Create a checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox');
    const checkboxLabel = document.createElement('label');
    checkboxLabel.classList.add('checkbox-label');
    checkboxLabel.appendChild(checkbox);
    item.appendChild(checkboxLabel);

    // Create a div to hold the thumbnail
    const thumbnailDiv = document.createElement('div');
    thumbnailDiv.classList.add('thumbnail');

    // Display thumbnail based on file type
    const thumbnail = document.createElement('img');
    thumbnail.src = getThumbnailSrc(file);
    thumbnail.alt = 'File';
    thumbnailDiv.appendChild(thumbnail);
    item.appendChild(thumbnailDiv);

    // Create a div for file name
    const fileNameDiv = document.createElement('div');
    fileNameDiv.classList.add('file-name');
    fileNameDiv.textContent = `Name: ${file.name}`;
    item.appendChild(fileNameDiv);

    // Create a div for file size
    const fileSizeDiv = document.createElement('div');
    fileSizeDiv.classList.add('file-size');
    fileSizeDiv.textContent = `Size: ${(file.size / 1024).toFixed(2)} KB`;
    item.appendChild(fileSizeDiv);

    // Create options button (three dots)
    const optionsButton = document.createElement('div');
    optionsButton.classList.add('options');
    optionsButton.textContent = 'Options';

    const optionsMenu = document.createElement('div');
    optionsMenu.classList.add('options-menu');

    const openOption = document.createElement('div');
    openOption.textContent = 'Open';
    openOption.addEventListener('click', () => openFile(file));
    optionsMenu.appendChild(openOption);

    const removeOption = document.createElement('div');
    removeOption.textContent = 'Remove';
    removeOption.addEventListener('click', () => removeFile(item, file));
    optionsMenu.appendChild(removeOption);

    const renameOption = document.createElement('div');
    renameOption.textContent = 'Rename';
    renameOption.addEventListener('click', () => renameFile(item, file));
    optionsMenu.appendChild(renameOption);

    optionsButton.addEventListener('click', (e) => {
      e.stopPropagation();
      optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
    });

    item.appendChild(optionsButton);
    item.appendChild(optionsMenu);

    // Add click event listener to the checkbox
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      if (checkbox.checked) {
        checkboxLabel.classList.add('checked');
      } else {
        checkboxLabel.classList.remove('checked');
      }
    });

    // Add the item to the file container
    fileContainer.appendChild(item);
  }
}

function toggleView() {
  isGridView = !isGridView;
  fileContainer.className = isGridView ? 'grid' : 'list';
}

function getThumbnailSrc(file) {
  const fileExtension = file.name.split('.').pop().toLowerCase();

  if (fileExtension === 'pdf') {
    return 'pdf-icon.png'; // Replace with your PDF icon image
  } else if (['doc', 'docx'].includes(fileExtension)) {
    return 'doc-icon.png'; // Replace with your document icon image
  } else if (fileExtension === 'jpg') {
    return 'jpg-icon.png'; // Replace with your JPG icon image
  } else if (fileExtension === 'png') {
    return 'png-icon.png'; // Replace with your PNG icon image
  } else if (file.type.startsWith('image/')) {
    // Handle image files by returning a data URL for thumbnail display
    const thumbnail = document.createElement('canvas');
    const ctx = thumbnail.getContext('2d');
    thumbnail.width = 100;
    thumbnail.height = 100;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 100, 100);
    };

    return thumbnail.toDataURL('image/png');
  } else {
    return 'default-icon.png'; // Replace with a default icon for other file types
  }
}

function removeFile(item, file) {
  item.remove();
  const newFiles = Array.from(fileInput.files).filter((f) => f !== file);
  fileInput.files = newFiles;
}

function openFile(file) {
  const url = URL.createObjectURL(file);
  window.open(url, '_blank');
}

function renameFile(item, file) {
  const newName = prompt('Enter a new name for the file:', file.name);
  if (newName !== null && newName.trim() !== '') {
    // Update the displayed name
    const fileNameDiv = item.querySelector('.file-name');
    fileNameDiv.textContent = `Name: ${newName}`;

    // Update the file name in the FileList
    const newFiles = Array.from(fileInput.files).map((f) => {
      if (f === file) {
        // Create a new File object with the updated name
        return new File([file], newName, { type: file.type });
      } else {
        return f;
      }
    });

    // Update the file input's files
    fileInput.files = newFiles;









  }
}

// Get references to the search input and button
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Add event listener for the search button click
searchButton.addEventListener('click', performSearch);

// Function to perform the search
function performSearch() {
  const searchTerm = searchInput.value.toLowerCase();

  // Get all items in the file container
  const items = document.querySelectorAll('.item');

  // Iterate through items and hide/show based on search term
  items.forEach((item) => {
    const fileName = item.querySelector('.file-name').textContent.toLowerCase();
    if (fileName.includes(searchTerm)) {
      item.style.display = 'block'; // Show item
    } else {
      item.style.display = 'none'; // Hide item
    }
  });
}


