describe('Error Handling Tests', () => {
  
  // Simulate getProductImages function
  function getProductImages(product) {
    try {
      if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images;
      }
      
      if (typeof product.images === 'string') {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      
      if (product.image) {
        return [product.image];
      }
      
      return ['/placeholder.jpg'];
    } catch (e) {
      return product.image ? [product.image] : ['/placeholder.jpg'];
    }
  }
  
  // Simulate image size validation
  function validateImageSize(file) {
    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    return file.size <= MAX_SIZE_BYTES;
  }
  
  function validateImageCount(images) {
    const MAX_IMAGES = 5;
    return images.length <= MAX_IMAGES;
  }
  
  // Simulate touch detection
  function isTouchDevice() {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }

  test('Parsing corrupted images returns placeholder', () => {
    const corruptedProducts = [
      { images: 'not valid json' },
      { images: '{broken json' },
      { images: null },
      { images: undefined },
      { images: '' }
    ];
    
    corruptedProducts.forEach(product => {
      const images = getProductImages(product);
      expect(images).toEqual(['/placeholder.jpg']);
    });
  });

  test('Valid array images are returned as-is', () => {
    const product = {
      images: ['img1.jpg', 'img2.jpg', 'img3.jpg']
    };
    
    const images = getProductImages(product);
    expect(images).toEqual(['img1.jpg', 'img2.jpg', 'img3.jpg']);
  });

  test('JSON string images are parsed correctly', () => {
    const product = {
      images: JSON.stringify(['img1.jpg', 'img2.jpg'])
    };
    
    const images = getProductImages(product);
    expect(images).toEqual(['img1.jpg', 'img2.jpg']);
  });

  test('Fallback to single image field', () => {
    const product = {
      image: 'single.jpg'
    };
    
    const images = getProductImages(product);
    expect(images).toEqual(['single.jpg']);
  });

  test('Empty images array returns placeholder', () => {
    const product = {
      images: []
    };
    
    const images = getProductImages(product);
    expect(images).toEqual(['/placeholder.jpg']);
  });

  test('Product with no images returns placeholder', () => {
    const product = {};
    
    const images = getProductImages(product);
    expect(images).toEqual(['/placeholder.jpg']);
  });

  test('Corrupted JSON with fallback image', () => {
    const product = {
      images: 'invalid json',
      image: 'fallback.jpg'
    };
    
    const images = getProductImages(product);
    expect(images).toEqual(['fallback.jpg']);
  });

  test('Image size validation - valid sizes', () => {
    const validFiles = [
      { size: 1024 * 1024 },      // 1MB
      { size: 2 * 1024 * 1024 },  // 2MB
      { size: 500 * 1024 }        // 500KB
    ];
    
    validFiles.forEach(file => {
      expect(validateImageSize(file)).toBe(true);
    });
  });

  test('Image size validation - invalid sizes', () => {
    const invalidFiles = [
      { size: 3 * 1024 * 1024 },    // 3MB
      { size: 10 * 1024 * 1024 },   // 10MB
      { size: 2.1 * 1024 * 1024 }   // 2.1MB
    ];
    
    invalidFiles.forEach(file => {
      expect(validateImageSize(file)).toBe(false);
    });
  });

  test('Image count validation - valid counts', () => {
    expect(validateImageCount(['img1'])).toBe(true);
    expect(validateImageCount(['img1', 'img2'])).toBe(true);
    expect(validateImageCount(['img1', 'img2', 'img3', 'img4', 'img5'])).toBe(true);
  });

  test('Image count validation - invalid counts', () => {
    const tooMany = ['img1', 'img2', 'img3', 'img4', 'img5', 'img6'];
    expect(validateImageCount(tooMany)).toBe(false);
  });

  test('Touch detection returns boolean', () => {
    const result = isTouchDevice();
    expect(typeof result).toBe('boolean');
  });

  test('Handles mixed valid and invalid image data', () => {
    const products = [
      { images: ['valid.jpg'] },
      { images: 'invalid' },
      { image: 'fallback.jpg' },
      {}
    ];
    
    products.forEach(product => {
      const images = getProductImages(product);
      expect(Array.isArray(images)).toBe(true);
      expect(images.length).toBeGreaterThan(0);
    });
  });

  test('Preserves image order when parsing', () => {
    const product = {
      images: JSON.stringify(['first.jpg', 'second.jpg', 'third.jpg'])
    };
    
    const images = getProductImages(product);
    expect(images[0]).toBe('first.jpg');
    expect(images[1]).toBe('second.jpg');
    expect(images[2]).toBe('third.jpg');
  });

  test('Handles empty string images gracefully', () => {
    const product = {
      images: '',
      image: 'backup.jpg'
    };
    
    const images = getProductImages(product);
    expect(images).toEqual(['backup.jpg']);
  });

  test('Handles null and undefined gracefully', () => {
    expect(getProductImages({ images: null })).toEqual(['/placeholder.jpg']);
    expect(getProductImages({ images: undefined })).toEqual(['/placeholder.jpg']);
    expect(getProductImages({})).toEqual(['/placeholder.jpg']);
  });
});
