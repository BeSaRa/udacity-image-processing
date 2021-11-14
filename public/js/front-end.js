'use strict';
(() => {
  const uploader = document.getElementById('uploader');
  const uploaderImages = document.getElementById('uploader-images');
  const uploadBtn = document.getElementById('upload-button');
  const API_URL = 'http://localhost:3000/api/images/upload';

  let filesInUploader = [];
  let uploaderThumbnails = [];
  const allowedExtentions = ['png', 'jpg', 'gif'];
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
    renderUploaderImages();
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
   * @returns {HTMLDivElement}
   */
  const createImageItem = (url, index) => {
    const maindiv = document.createElement('div');
    maindiv.classList.add('uploader-image');
    maindiv.appendChild(createRemoveBtn(index));
    maindiv.appendChild(createImage(url));
    return maindiv;
  };
  /**
   * @description render the images that came from uploader field
   */
  const renderUploaderImages = () => {
    uploaderImages.innerHTML = '';
    uploaderThumbnails.forEach((url, index) => {
      uploaderImages.appendChild(createImageItem(url, index));
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
   * @param response
   * @returns {{ok}|*}
   */
  const fetchErrorHandler = async (response) => {
    if (!response.ok) throw Error(await response.text());
    return response;
  };
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
    renderUploaderImages();
  });
  // listen to click on the upload button to call the backend API
  uploadBtn.addEventListener('click', () => {
    if (!filesInUploader.length) {
      alert('Please choose images beofer click upload');
      disableUploadBtn();
    }

    fetch(API_URL, {
      method: 'POST',
      body: filesInUploader.reduce((formData, file) => {
        formData.append('files', file);
        return formData;
      }, new FormData()),
    })
      .then(fetchErrorHandler)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        alert(error);
      });
  });
})();
