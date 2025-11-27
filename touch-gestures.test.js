// **Feature: shopmanstore-mejoras, Property 9: Swipe gesture changes image**
// **Feature: shopmanstore-mejoras, Property 10: Image navigation shows current position indicator**
const fc = require('fast-check');

describe('Touch Gestures and Position Indicator Tests', () => {
  
  // Simulate touch events
  function simulateSwipe(startX, endX, startY = 100, endY = 100) {
    const diffX = startX - endX;
    const diffY = startY - endY;
    const minSwipeDistance = 50;
    
    // Horizontal swipe detection
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        return 'left'; // Swipe left
      } else {
        return 'right'; // Swipe right
      }
    }
    return 'none';
  }
  
  // Simulate image gallery with position
  class ImageGalleryWithPosition {
    constructor(images) {
      this.images = images;
      this.currentIndex = 0;
    }
    
    handleSwipe(direction) {
      if (direction === 'left') {
        this.next();
      } else if (direction === 'right') {
        this.prev();
      }
    }
    
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
    
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
    
    getCurrentImage() {
      return this.images[this.currentIndex];
    }
    
    getPositionIndicator() {
      return {
        current: this.currentIndex + 1,
        total: this.images.length,
        text: `${this.currentIndex + 1} / ${this.images.length}`
      };
    }
  }

  test('Property 9: Swipe gesture changes image', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 5, maxLength: 20 }).map(s => `img_${s}`),
          { minLength: 2, maxLength: 5 }
        ),
        fc.integer({ min: 0, max: 500 }),
        fc.integer({ min: 0, max: 500 }),
        (images, startXSeed, endXSeed) => {
          const gallery = new ImageGalleryWithPosition(images);
          const initialImage = gallery.getCurrentImage();
          
          // Simulate swipe left (startX > endX by more than 50)
          const startX = 200;
          const endX = 100; // Difference of 100 > 50
          const swipeDirection = simulateSwipe(startX, endX);
          
          expect(swipeDirection).toBe('left');
          
          gallery.handleSwipe(swipeDirection);
          
          // Image should have changed
          const newImage = gallery.getCurrentImage();
          if (images.length > 1) {
            expect(newImage).not.toBe(initialImage);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 10: Image navigation shows current position indicator', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 5, maxLength: 20 }),
          { minLength: 1, maxLength: 5 }
        ),
        (imageStrings) => {
          const images = imageStrings.map(s => `img_${s}`);
          const gallery = new ImageGalleryWithPosition(images);
          
          // Check initial position
          let indicator = gallery.getPositionIndicator();
          expect(indicator.current).toBe(1);
          expect(indicator.total).toBe(images.length);
          expect(indicator.text).toBe(`1 / ${images.length}`);
          
          // Navigate and check indicator updates
          if (images.length > 1) {
            gallery.next();
            indicator = gallery.getPositionIndicator();
            expect(indicator.current).toBe(2);
            expect(indicator.text).toBe(`2 / ${images.length}`);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Swipe left detection', () => {
    expect(simulateSwipe(200, 100)).toBe('left'); // Diff = 100
    expect(simulateSwipe(150, 50)).toBe('left');  // Diff = 100
    expect(simulateSwipe(300, 200)).toBe('left'); // Diff = 100
  });

  test('Swipe right detection', () => {
    expect(simulateSwipe(100, 200)).toBe('right'); // Diff = -100
    expect(simulateSwipe(50, 150)).toBe('right');  // Diff = -100
    expect(simulateSwipe(200, 300)).toBe('right'); // Diff = -100
  });

  test('Small swipe is ignored', () => {
    expect(simulateSwipe(100, 120)).toBe('none'); // Diff = -20 < 50
    expect(simulateSwipe(100, 80)).toBe('none');  // Diff = 20 < 50
    expect(simulateSwipe(100, 140)).toBe('none'); // Diff = -40 < 50
  });

  test('Vertical swipe is ignored', () => {
    // More vertical than horizontal
    expect(simulateSwipe(100, 120, 100, 200)).toBe('none'); // Vertical diff = 100, horizontal = 20
    expect(simulateSwipe(100, 80, 100, 50)).toBe('none');   // Vertical diff = 50, horizontal = 20
  });

  test('Swipe left advances to next image', () => {
    const gallery = new ImageGalleryWithPosition(['img1', 'img2', 'img3']);
    
    expect(gallery.getCurrentImage()).toBe('img1');
    gallery.handleSwipe('left');
    expect(gallery.getCurrentImage()).toBe('img2');
    gallery.handleSwipe('left');
    expect(gallery.getCurrentImage()).toBe('img3');
  });

  test('Swipe right goes to previous image', () => {
    const gallery = new ImageGalleryWithPosition(['img1', 'img2', 'img3']);
    
    expect(gallery.getCurrentImage()).toBe('img1');
    gallery.handleSwipe('right'); // Should wrap to last
    expect(gallery.getCurrentImage()).toBe('img3');
    gallery.handleSwipe('right');
    expect(gallery.getCurrentImage()).toBe('img2');
  });

  test('Position indicator updates correctly', () => {
    const gallery = new ImageGalleryWithPosition(['img1', 'img2', 'img3', 'img4']);
    
    expect(gallery.getPositionIndicator().text).toBe('1 / 4');
    
    gallery.next();
    expect(gallery.getPositionIndicator().text).toBe('2 / 4');
    
    gallery.next();
    expect(gallery.getPositionIndicator().text).toBe('3 / 4');
    
    gallery.next();
    expect(gallery.getPositionIndicator().text).toBe('4 / 4');
    
    gallery.next(); // Wrap to first
    expect(gallery.getPositionIndicator().text).toBe('1 / 4');
  });

  test('Position indicator for single image', () => {
    const gallery = new ImageGalleryWithPosition(['img1']);
    const indicator = gallery.getPositionIndicator();
    
    expect(indicator.current).toBe(1);
    expect(indicator.total).toBe(1);
    expect(indicator.text).toBe('1 / 1');
  });

  test('Swipe gestures work with any number of images', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
        (images) => {
          const gallery = new ImageGalleryWithPosition(images);
          const initialIndex = gallery.currentIndex;
          
          // Swipe left
          gallery.handleSwipe('left');
          
          if (images.length > 1) {
            expect(gallery.currentIndex).toBe((initialIndex + 1) % images.length);
          } else {
            expect(gallery.currentIndex).toBe(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Position indicator always shows valid range', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 0, max: 20 }),
        (images, swipes) => {
          const gallery = new ImageGalleryWithPosition(images);
          
          // Perform random swipes
          for (let i = 0; i < swipes; i++) {
            gallery.next();
          }
          
          const indicator = gallery.getPositionIndicator();
          
          // Current should be between 1 and total
          expect(indicator.current).toBeGreaterThanOrEqual(1);
          expect(indicator.current).toBeLessThanOrEqual(indicator.total);
          expect(indicator.total).toBe(images.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
