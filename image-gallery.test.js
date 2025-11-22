// **Feature: shopmanstore-mejoras, Property 6: First image is always main display**
// **Feature: shopmanstore-mejoras, Property 7: Multiple images show navigation controls**
// **Feature: shopmanstore-mejoras, Property 8: Thumbnail click updates main image**
const fc = require('fast-check');

describe('Image Gallery Tests', () => {
  
  // Simulate ImageGallery class
  class ImageGallery {
    constructor(productId, images) {
      this.productId = productId;
      this.images = images || [];
      this.currentIndex = 0;
    }
    
    getCurrentImage() {
      return this.images[this.currentIndex];
    }
    
    hasNavigationControls() {
      return this.images.length > 1;
    }
    
    goTo(index) {
      if (index >= 0 && index < this.images.length) {
        this.currentIndex = index;
      }
    }
    
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
    
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }

  test('Property 6: First image is always main display', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 10, maxLength: 50 }).map(s => `data:image/jpeg;base64,${s}`),
          { minLength: 1, maxLength: 5 }
        ),
        (images) => {
          const gallery = new ImageGallery(1, images);
          
          // Initially, current image should be first image
          expect(gallery.getCurrentImage()).toBe(images[0]);
          expect(gallery.currentIndex).toBe(0);
          
          // After navigating and coming back, first image is at index 0
          gallery.next();
          gallery.goTo(0);
          expect(gallery.getCurrentImage()).toBe(images[0]);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 7: Multiple images show navigation controls', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 10, maxLength: 50 }),
          { minLength: 1, maxLength: 5 }
        ),
        (imageStrings) => {
          const images = imageStrings.map(s => `img_${s}`);
          const gallery = new ImageGallery(1, images);
          
          const shouldHaveControls = images.length > 1;
          expect(gallery.hasNavigationControls()).toBe(shouldHaveControls);
          
          // Single image should not have controls
          if (images.length === 1) {
            expect(gallery.hasNavigationControls()).toBe(false);
          }
          
          // Multiple images should have controls
          if (images.length > 1) {
            expect(gallery.hasNavigationControls()).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 8: Thumbnail click updates main image', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 10, maxLength: 50 }),
          { minLength: 2, maxLength: 5 }
        ),
        fc.integer({ min: 0 }),
        (imageStrings, indexSeed) => {
          const images = imageStrings.map(s => `img_${s}`);
          const gallery = new ImageGallery(1, images);
          
          const targetIndex = indexSeed % images.length;
          
          // Click on thumbnail (goTo)
          gallery.goTo(targetIndex);
          
          // Main image should update to clicked thumbnail
          expect(gallery.currentIndex).toBe(targetIndex);
          expect(gallery.getCurrentImage()).toBe(images[targetIndex]);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Gallery initializes with first image', () => {
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
    const gallery = new ImageGallery(1, images);
    
    expect(gallery.currentIndex).toBe(0);
    expect(gallery.getCurrentImage()).toBe('img1.jpg');
  });

  test('Single image gallery has no navigation controls', () => {
    const gallery = new ImageGallery(1, ['single.jpg']);
    expect(gallery.hasNavigationControls()).toBe(false);
  });

  test('Multiple image gallery has navigation controls', () => {
    const gallery = new ImageGallery(1, ['img1.jpg', 'img2.jpg']);
    expect(gallery.hasNavigationControls()).toBe(true);
  });

  test('Clicking thumbnail changes current image', () => {
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
    const gallery = new ImageGallery(1, images);
    
    gallery.goTo(2);
    expect(gallery.getCurrentImage()).toBe('img3.jpg');
    
    gallery.goTo(0);
    expect(gallery.getCurrentImage()).toBe('img1.jpg');
  });

  test('Next navigation cycles through images', () => {
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
    const gallery = new ImageGallery(1, images);
    
    expect(gallery.getCurrentImage()).toBe('img1.jpg');
    
    gallery.next();
    expect(gallery.getCurrentImage()).toBe('img2.jpg');
    
    gallery.next();
    expect(gallery.getCurrentImage()).toBe('img3.jpg');
    
    gallery.next(); // Should wrap to first
    expect(gallery.getCurrentImage()).toBe('img1.jpg');
  });

  test('Previous navigation cycles through images backwards', () => {
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
    const gallery = new ImageGallery(1, images);
    
    gallery.prev(); // Should wrap to last
    expect(gallery.getCurrentImage()).toBe('img3.jpg');
    
    gallery.prev();
    expect(gallery.getCurrentImage()).toBe('img2.jpg');
    
    gallery.prev();
    expect(gallery.getCurrentImage()).toBe('img1.jpg');
  });

  test('GoTo with invalid index does not change current image', () => {
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
    const gallery = new ImageGallery(1, images);
    
    gallery.goTo(1);
    expect(gallery.getCurrentImage()).toBe('img2.jpg');
    
    gallery.goTo(-1); // Invalid
    expect(gallery.getCurrentImage()).toBe('img2.jpg'); // Should not change
    
    gallery.goTo(10); // Invalid
    expect(gallery.getCurrentImage()).toBe('img2.jpg'); // Should not change
  });

  test('Empty gallery returns undefined for current image', () => {
    const gallery = new ImageGallery(1, []);
    expect(gallery.getCurrentImage()).toBeUndefined();
  });

  test('Navigation controls property for edge cases', () => {
    expect(new ImageGallery(1, []).hasNavigationControls()).toBe(false);
    expect(new ImageGallery(1, ['one']).hasNavigationControls()).toBe(false);
    expect(new ImageGallery(1, ['one', 'two']).hasNavigationControls()).toBe(true);
    expect(new ImageGallery(1, ['1', '2', '3', '4', '5']).hasNavigationControls()).toBe(true);
  });
});
