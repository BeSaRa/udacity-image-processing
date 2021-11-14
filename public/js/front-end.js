'use strict';
(() => {
  const UPLOAD_API_URL = 'http://localhost:3000/api/images/upload';
  const THUMBNAILS_API_URL = 'http://localhost:3000/api/images/thumbnails';
  const FULL_API_URL = 'http://localhost:3000/api/images/full';
  const RESIZE_API_URL = 'http://localhost:3000/api/images';

  const uploader = document.getElementById('uploader');
  const uploaderImages = document.getElementById('uploader-images');
  const uploadBtn = document.getElementById('upload-button');
  const thumbnailsFolderImages = document.getElementById(
    'thumbnails-folder-images'
  );
  /**
   * @type {HTMLButtonElement}
   */
  const resizeButton = document.getElementById('resize-button');
  /**
   * @type {HTMLSelectElement}
   */
  const selectInput = document.getElementById('s-image');
  /**
   * @type {HTMLImageElement}
   */
  const selectedImage = document.getElementById('selected-image');
  /**
   * @type {HTMLInputElement}
   */
  const imageWidthInput = document.getElementById('image-width');
  /**
   * @type {HTMLInputElement}
   */
  const imageHeightInput = document.getElementById('image-height');
  /**
   * @type {HTMLInputElement}
   */
  const newImageWidthInput = document.getElementById('new-image-width');
  /**
   * @type {HTMLInputElement}
   */
  const newImageHeightInput = document.getElementById('new-image-height');

  let filesInUploader = [];
  let uploaderThumbnails = [];
  const allowedExtensions = ['png', 'jpg', 'gif'];
  /**
   * @description load list of images from full folder
   */
  const loadFullImages = () => {
    fetch(FULL_API_URL)
      .then(fetchErrorHandler)
      .then((res) => res.json())
      .then((images) => createOptionList(images));
  };
  /**
   * @description create an option element
   * @param option
   * @param index{number}
   * @returns {HTMLOptionElement}
   */
  const createOption = (option, index) => {
    let ele = document.createElement('option');
    ele.value = 'api/images/?filename=' + option;
    ele.innerText = option;
    // to select always first item
    if (index === 0) {
      ele.selected = true;
    }
    return ele;
  };
  /**
   * @description display options list to make the user select an image to process
   * @param options{string[]}
   */
  const createOptionList = (options) => {
    selectInput.innerHTML = '';
    options.forEach((option, index) =>
      selectInput.appendChild(createOption(option, index))
    );
    selectInput.dispatchEvent(new Event('change'));
  };
  /**
   * @description load list of images from thumbnail folder
   */
  const loadThumbnailImages = () => {
    fetch(THUMBNAILS_API_URL)
      .then(fetchErrorHandler)
      .then((res) => res.json())
      .then((images) => images.map((image) => 'assets/thumb/' + image))
      .then((urls) => renderUploaderImages(thumbnailsFolderImages, urls, true));
  };
  /**
   * @description check if the file in the allowed extensions
   * @param file
   * @returns {boolean}
   */
  const isValidExtension = (file) => {
    return allowedExtensions.includes(file.name.split('.').pop().toLowerCase());
  };
  /**
   * @description handle remove button callback
   * @param event
   */
  const onRemoveButtonClicked = (event) => {
    uploaderThumbnails.splice(parseInt(event.target.dataset.index), 1);
    filesInUploader.splice(parseInt(event.target.dataset.index), 1);
    renderUploaderImages(uploaderImages, uploaderThumbnails);
  };
  /**
   * @description create remove button
   * @param index
   * @returns {HTMLButtonElement}
   */
  const createRemoveBtn = (index) => {
    const btn = document.createElement('button');
    btn.classList.add('btn-close', 'position-absolute', 'top-0', 'end-0');
    btn.dataset.index = index;
    btn.ariaLabel = 'Close';
    btn.addEventListener('click', onRemoveButtonClicked);
    return btn;
  };
  /**
   * @description create image thumbnail
   * @param url
   * @returns {HTMLImageElement}
   */
  const createImage = (url) => {
    const image = document.createElement('img');
    image.alt = 'image';
    image.src = url;
    return image;
  };
  /**
   * @description create uploader image wrapper
   * @param url
   * @param index
   * @param ignoreRemoveBtn
   * @returns {HTMLDivElement}
   */
  const createImageItem = (url, index, ignoreRemoveBtn = false) => {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('uploader-image');
    !ignoreRemoveBtn && mainDiv.appendChild(createRemoveBtn(index));
    mainDiv.appendChild(createImage(url));
    return mainDiv;
  };
  /**
   * @description render the images that came from uploader field
   */
  const renderUploaderImages = (container, urls, ignoreRemoveBtn = false) => {
    container.innerHTML = '';
    urls.forEach((url, index) => {
      container.appendChild(createImageItem(url, index, ignoreRemoveBtn));
    });
    disableUploadBtn();
  };
  /**
   * @description disable upload button if there is no files chosen to upload
   */
  const disableUploadBtn = () => {
    uploadBtn.disabled = !filesInUploader.length;
  };
  /**
   * @description to throw error to make the catch work if there is error came from backend
   * @param response {Response}
   * @returns {Response}
   */
  const fetchErrorHandler = async (response) => {
    if (!response.ok) throw Error(await response.text());
    return response;
  };
  // load thumbnails list and display it
  loadThumbnailImages();
  // load full images list and display it
  loadFullImages();
  // listen to change event and prepare the file to be displayed
  uploader.addEventListener('change', (event) => {
    const { files } = event.target;
    Array.from(files, (file) => {
      if (isValidExtension(file)) {
        filesInUploader.push(file);
        uploaderThumbnails.push(URL.createObjectURL(file));
      }
    });
    uploader.value = '';
    renderUploaderImages(uploaderImages, uploaderThumbnails);
  });
  // listen to click on the upload button to call the backend API
  uploadBtn.addEventListener('click', () => {
    if (!filesInUploader.length) {
      alert('Please choose images before click upload');
      disableUploadBtn();
    }

    fetch(UPLOAD_API_URL, {
      method: 'POST',
      body: filesInUploader.reduce((formData, file) => {
        formData.append('files', file);
        return formData;
      }, new FormData()),
    })
      .then(fetchErrorHandler)
      .catch((error) => {
        alert(error);
      });
  });
  // listen to change on the selected image dropdown list
  selectInput.addEventListener('change', () => {
    selectedImage.alt = selectedImage.src = selectInput.value;
  });
  // listen to load event for the image to get size (width / height)
  selectedImage.addEventListener('load', () => {
    imageWidthInput.value = '' + selectedImage.naturalWidth;
    imageHeightInput.value = '' + selectedImage.naturalHeight;
    newImageWidthInput.value = '' + selectedImage.naturalWidth;
    newImageHeightInput.value = '' + selectedImage.naturalHeight;
  });
  // listen to keydown for the width to prevent user from type a width bigger than actual image width
  newImageWidthInput.addEventListener('keydown', () => {
    if (parseInt(imageWidthInput.value) < parseInt(newImageWidthInput.value)) {
      newImageWidthInput.value = imageWidthInput.value;
    }
    if (!newImageWidthInput.value.length) {
      newImageWidthInput.value = '0';
    }
  });
  // listen to keydown for the width to prevent user from type a height bigger than actual image height
  newImageHeightInput.addEventListener('keydown', () => {
    if (
      parseInt(imageHeightInput.value) < parseInt(newImageHeightInput.value)
    ) {
      newImageHeightInput.value = imageHeightInput.value;
    }
    if (!newImageHeightInput.value.length) {
      newImageHeightInput.value = '0';
    }
  });
  // listen to click on resize button
  resizeButton.addEventListener('click', () => {
    const query = new URLSearchParams({
      filename: selectInput.selectedOptions.item(0).innerText,
      width: newImageWidthInput.value,
      height: newImageHeightInput.value,
    });
    const url = RESIZE_API_URL + '?' + query;
    fetch(url)
      .then(fetchErrorHandler)
      .then(async () => {
        selectedImage.src = url;
        loadThumbnailImages();
      });
  });
})();
