import { ImageProcessing } from '../../utilities/imageProcessing';

describe('Test ImageProcessing Utility', () => {
  it('should be truthy cause image.png exists in full folder', async () => {
    expect(await ImageProcessing.existsInFull('image.png')).toBeTruthy();
  });

  it('should be Falsy cause 1212.png not exists in full folder', async () => {
    expect(await ImageProcessing.existsInFull('15448.png')).toBeFalsy();
  });
});
