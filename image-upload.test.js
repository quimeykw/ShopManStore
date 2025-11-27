// **Feature: shopmanstore-mejoras, Property 3: Multiple image preview shows all selected images**
// **Feature: shopmanstore-mejoras, Property 5: Individual image deletion preserves others**
const fc = require('fast-check');

describe('Image Upload and Preview Tests', () => {
  
  // Simulate the preview system
  class ImagePreviewManager {
    constructor() {
      this.images = [];
    }
    
    addImages(newImages) {
      this.images = [...this.images, ...newImages];
      return this.images.length;
    }
    
    removeImage(index) {
      this.images.splice(index, 1);
    }
    
    getPreviewCount() {
      return this.images.length;
    }
    
    getImages() {
      return [...this.images];
    }
    
    clear() {
      this.images = [];
    }
  }

  test('Property 3: Multiple image preview shows all selected images', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 10, maxLength: 50 }).map(s => `data:image/jpeg;base64,${s}`),
          { minLength: 1, maxLength: 5 }
        ),
        (images) => {
          const manager = new ImagePreviewManager();
          const count = manager.addImages(images);
          
          // Preview count must equal number of images added
          expect(count).toBe(images.length);
          expect(manager.getPreviewCount()).toBe(images.length);
          
          // All images must be in preview
          const previewImages = manager.getImages();
          expect(previewImages.length).toBe(images.length);
          expect(previewImages).toEqual(images);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Individual image deletion preserves others', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 10, maxLength: 50 }).map(s => `data:image/jpeg;base64,${s}`),
          { minLength: 2, maxLength: 5 }
        ),
        fc.integer({ min: 0 }),
        (images, indexSeed) => {
          const manager = new ImagePreviewManager();
          manager.addImages(images);
          
          const N = images.length;
          const indexToRemove = indexSeed % N;
          
          // Remove image at index
          manager.removeImage(indexToRemove);
          
          // Should have N-1 images
          expect(manager.getPreviewCount()).toBe(N - 1);
          
          // Build expected array (all except removed)
          const expected = images.filter((_, i) => i !== indexToRemove);
          
          // Verify remaining images
          const remaining = manager.getImages();
          expect(remaining.length).toBe(N - 1);
          expect(remaining).toEqual(expected);
          
          // Verify relative order is preserved
          let expectedIndex = 0;
          for (let i = 0; i < N; i++) {
            if (i !== indexToRemove) {
              expect(remaining[expectedIndex]).toBe(images[i]);
              expectedIndex++;
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Adding zero images results in zero preview items', () => {
    const manager = new ImagePreviewManager();
    manager.addImages([]);
    expect(manager.getPreviewCount()).toBe(0);
  });

  test('Adding one image results in one preview item', () => {
    const manager = new ImagePreviewManager();
    manager.addImages(['data:image/jpeg;base64,test']);
    expect(manager.getPreviewCount()).toBe(1);
  });

  test('Adding maximum (5) images results in 5 preview items', () => {
    const manager = new ImagePreviewManager();
    const images = Array(5).fill(0).map((_, i) => `data:image/jpeg;base64,img${i}`);
    manager.addImages(images);
    expect(manager.getPreviewCount()).toBe(5);
  });

  test('Removing first image preserves order of remaining', () => {
    const manager = new ImagePreviewManager();
    const images = ['img1', 'img2', 'img3'];
    manager.addImages(images);
    manager.removeImage(0);
    
    expect(manager.getImages()).toEqual(['img2', 'img3']);
  });

  test('Removing last image preserves order of remaining', () => {
    const manager = new ImagePreviewManager();
    const images = ['img1', 'img2', 'img3'];
    manager.addImages(images);
    manager.removeImage(2);
    
    expect(manager.getImages()).toEqual(['img1', 'img2']);
  });

  test('Removing middle image preserves order of remaining', () => {
    const manager = new ImagePreviewManager();
    const images = ['img1', 'img2', 'img3', 'img4'];
    manager.addImages(images);
    manager.removeImage(1);
    
    expect(manager.getImages()).toEqual(['img1', 'img3', 'img4']);
  });

  test('Multiple deletions work correctly', () => {
    const manager = new ImagePreviewManager();
    const images = ['img1', 'img2', 'img3', 'img4', 'img5'];
    manager.addImages(images);
    
    manager.removeImage(1); // Remove img2
    expect(manager.getImages()).toEqual(['img1', 'img3', 'img4', 'img5']);
    
    manager.removeImage(2); // Remove img4
    expect(manager.getImages()).toEqual(['img1', 'img3', 'img5']);
    
    manager.removeImage(0); // Remove img1
    expect(manager.getImages()).toEqual(['img3', 'img5']);
  });

  test('Clear removes all images', () => {
    const manager = new ImagePreviewManager();
    manager.addImages(['img1', 'img2', 'img3']);
    manager.clear();
    
    expect(manager.getPreviewCount()).toBe(0);
    expect(manager.getImages()).toEqual([]);
  });

  test('Adding images incrementally', () => {
    const manager = new ImagePreviewManager();
    
    manager.addImages(['img1']);
    expect(manager.getPreviewCount()).toBe(1);
    
    manager.addImages(['img2', 'img3']);
    expect(manager.getPreviewCount()).toBe(3);
    expect(manager.getImages()).toEqual(['img1', 'img2', 'img3']);
  });
});
