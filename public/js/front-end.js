'use strict';
(() => {
  const uploader = document.getElementById('uploader');
  const uploaderImages = document.getElementById('uploader-images');
  const uploadBtn = document.getElementById('upload-button');
  const thumbnailsFolderImages = document.getElementById(
    'thumbnails-folder-images'
  );
  const UPLOAD_API_URL = 'http://localhost:3000/api/images/upload';
  const THUMBNAILS_API_URL = 'http://localhost:3000/api/images/thumbnails';

  let filesInUploader = [];
  let uploaderThumbnails = [];
  const allowedExtentions = ['png', 'jpg', 'gif'];

  /**
   * @description load list of images from thumbnail folder
   * @returns {Promise<String[]>}
   */
  const loadThumbnailImages = () => {
    return fetch(THUMBNAILS_API_URL)
      .then(fetchErrorHandler)
      .then((res) => res.json());
  };
  /**
   * @description checkl if the file in the allawed extensions
   * @param file
   * @returns {boolean}
   */
  const isValidExtention = (file) => {
    return allowedExtentions.includes(file.name.split('.').pop().toLowerCase());
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
   * @description cretae remove button
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
    const maindiv = document.createElement('div');
    maindiv.classList.add('uploader-image');
    !ignoreRemoveBtn && maindiv.appendChild(createRemoveBtn(index));
    maindiv.appendChild(createImage(url));
    return maindiv;
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
   * @description disable upload button if there is no files choosed to upload
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
  /**
   * @description to load the  images insid the thumb folder
   */
  const loadThumbnailList = () => {
    loadThumbnailImages()
      .then((images) => images.map((image) => 'assets/thumb/' + image))
      .then((urls) => renderUploaderImages(thumbnailsFolderImages, urls, true));
  };
  // load thumbnails list and display it
  loadThumbnailList();
  // listen to change event and preapre the file to be displayed
  uploader.addEventListener('change', (event) => {
    const { files } = event.target;
    Array.from(files, (file) => {
      if (isValidExtention(file)) {
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
      alert('Please choose images beofer click upload');
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
})();
