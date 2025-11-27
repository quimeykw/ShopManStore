describe('Integration Tests', () => {
  
  // Simulate complete product flow
  class ProductSystem {
    constructor() {
      this.products = [];
      this.nextId = 1;
    }
    
    // Admin creates product with multiple images
    createProduct(name, images) {
      if (!Array.isArray(images) || images.length === 0) {
        throw new Error('At least one image required');
      }
      
      if (images.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }
      
      const product = {
        id: this.nextId++,
        name,
        images: [...images], // Store as array
        createdAt: new Date()
      };
      
      this.products.push(product);
      return product;
    }
    
    // Get product (simulates API call)
    getProduct(id) {
      const product = this.products.find(p => p.id === id);
      if (!product) return null;
      
      // Simulate serialization/deserialization
      const serialized = JSON.stringify(product.images);
      const deserialized = JSON.parse(serialized);
      
      return {
        ...product,
        images: deserialized
      };
    }
    
    // Update product images
    updateProductImages(id, newImages) {
      const product = this.products.find(p => p.id === id);
      if (!product) return false;
      
      if (newImages.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }
      
      product.images = [...newImages];
      return true;
    }
  }
  
  // Simulate gallery navigation
  class GalleryNavigator {
    constructor(images) {
      this.images = images;
      this.currentIndex = 0;
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
    
    getPosition() {
      return { current: this.currentIndex + 1, total: this.images.length };
    }
  }
  
  // Simulate responsive viewport
  function getLayoutForViewport(width) {
    return {
      columns: width < 640 ? 1 : width < 1024 ? 2 : width < 1280 ? 3 : 4,
      isMobile: width < 640,
      isTablet: width >= 640 && width < 1024,
      isDesktop: width >= 1024
    };
  }

  test('Integration: Admin creates product with multiple images', () => {
    const system = new ProductSystem();
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
    
    // Admin creates product
    const product = system.createProduct('Test Product', images);
    
    expect(product.id).toBe(1);
    expect(product.name).toBe('Test Product');
    expect(product.images).toEqual(images);
    
    // Retrieve product (simulates page reload)
    const retrieved = system.getProduct(product.id);
    
    expect(retrieved.images).toEqual(images);
    expect(retrieved.images.length).toBe(3);
  });

  test('Integration: Client navigates gallery and opens zoom', () => {
    const system = new ProductSystem();
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'];
    
    // Admin creates product
    const product = system.createProduct('Gallery Product', images);
    
    // Client views product
    const retrieved = system.getProduct(product.id);
    const gallery = new GalleryNavigator(retrieved.images);
    
    // Initial state
    expect(gallery.getCurrentImage()).toBe('img1.jpg');
    expect(gallery.getPosition()).toEqual({ current: 1, total: 4 });
    
    // Navigate
    gallery.next();
    expect(gallery.getCurrentImage()).toBe('img2.jpg');
    expect(gallery.getPosition()).toEqual({ current: 2, total: 4 });
    
    // Open zoom (same navigation logic)
    const zoomGallery = new GalleryNavigator(retrieved.images);
    zoomGallery.next();
    zoomGallery.next();
    expect(zoomGallery.getCurrentImage()).toBe('img3.jpg');
  });

  test('Integration: Responsive layout adapts to different viewports', () => {
    const system = new ProductSystem();
    
    // Create multiple products
    for (let i = 0; i < 10; i++) {
      system.createProduct(`Product ${i}`, [`img${i}.jpg`]);
    }
    
    // Test different viewports
    const mobile = getLayoutForViewport(375);
    expect(mobile.columns).toBe(1);
    expect(mobile.isMobile).toBe(true);
    
    const tablet = getLayoutForViewport(768);
    expect(tablet.columns).toBe(2);
    expect(tablet.isTablet).toBe(true);
    
    const desktop = getLayoutForViewport(1920);
    expect(desktop.columns).toBe(4);
    expect(desktop.isDesktop).toBe(true);
  });

  test('Integration: Migration of existing products', () => {
    const system = new ProductSystem();
    
    // Simulate old product with single image
    const oldProduct = {
      id: 1,
      name: 'Old Product',
      image: 'single.jpg' // Old format
    };
    
    // Migration: convert to array
    const migrated = {
      ...oldProduct,
      images: [oldProduct.image]
    };
    
    system.products.push(migrated);
    
    // Retrieve and verify
    const retrieved = system.getProduct(1);
    expect(Array.isArray(retrieved.images)).toBe(true);
    expect(retrieved.images).toEqual(['single.jpg']);
  });

  test('Integration: Complete admin workflow', () => {
    const system = new ProductSystem();
    
    // 1. Create product
    const images = ['img1.jpg', 'img2.jpg'];
    const product = system.createProduct('Admin Product', images);
    
    // 2. Retrieve for editing
    const forEdit = system.getProduct(product.id);
    expect(forEdit.images).toEqual(images);
    
    // 3. Add more images
    const updatedImages = [...forEdit.images, 'img3.jpg', 'img4.jpg'];
    system.updateProductImages(product.id, updatedImages);
    
    // 4. Verify update
    const afterUpdate = system.getProduct(product.id);
    expect(afterUpdate.images.length).toBe(4);
    expect(afterUpdate.images).toEqual(updatedImages);
    
    // 5. Reorder images
    const reordered = [updatedImages[3], updatedImages[0], updatedImages[1], updatedImages[2]];
    system.updateProductImages(product.id, reordered);
    
    // 6. Verify reorder persisted
    const final = system.getProduct(product.id);
    expect(final.images).toEqual(reordered);
  });

  test('Integration: Error handling throughout system', () => {
    const system = new ProductSystem();
    
    // Try to create with no images
    expect(() => {
      system.createProduct('No Images', []);
    }).toThrow('At least one image required');
    
    // Try to create with too many images
    expect(() => {
      system.createProduct('Too Many', ['1', '2', '3', '4', '5', '6']);
    }).toThrow('Maximum 5 images allowed');
    
    // Try to get non-existent product
    const notFound = system.getProduct(999);
    expect(notFound).toBeNull();
    
    // Try to update non-existent product
    const updateResult = system.updateProductImages(999, ['img.jpg']);
    expect(updateResult).toBe(false);
  });

  test('Integration: Gallery with single image', () => {
    const system = new ProductSystem();
    const product = system.createProduct('Single Image', ['only.jpg']);
    
    const retrieved = system.getProduct(product.id);
    const gallery = new GalleryNavigator(retrieved.images);
    
    expect(gallery.getCurrentImage()).toBe('only.jpg');
    expect(gallery.getPosition()).toEqual({ current: 1, total: 1 });
    
    // Navigation should wrap
    gallery.next();
    expect(gallery.getCurrentImage()).toBe('only.jpg');
  });

  test('Integration: Multiple products with different image counts', () => {
    const system = new ProductSystem();
    
    const products = [
      system.createProduct('Product 1', ['img1.jpg']),
      system.createProduct('Product 2', ['img1.jpg', 'img2.jpg']),
      system.createProduct('Product 3', ['img1.jpg', 'img2.jpg', 'img3.jpg']),
      system.createProduct('Product 4', ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg'])
    ];
    
    products.forEach((product, index) => {
      const retrieved = system.getProduct(product.id);
      expect(retrieved.images.length).toBe(index + 1);
    });
  });

  test('Integration: Responsive behavior with touch targets', () => {
    const viewports = [
      { width: 320, name: 'Small Mobile' },
      { width: 375, name: 'Mobile' },
      { width: 768, name: 'Tablet' },
      { width: 1024, name: 'Desktop' },
      { width: 1920, name: 'Large Desktop' }
    ];
    
    viewports.forEach(viewport => {
      const layout = getLayoutForViewport(viewport.width);
      
      // Verify columns are appropriate
      expect(layout.columns).toBeGreaterThan(0);
      expect(layout.columns).toBeLessThanOrEqual(4);
      
      // Verify only one layout type is true
      const layoutTypes = [layout.isMobile, layout.isTablet, layout.isDesktop];
      const trueCount = layoutTypes.filter(Boolean).length;
      expect(trueCount).toBe(1);
    });
  });

  test('Integration: Complete user journey', () => {
    const system = new ProductSystem();
    
    // Admin creates product
    const product = system.createProduct('User Journey Product', [
      'front.jpg',
      'back.jpg',
      'side.jpg'
    ]);
    
    // User browses products
    const browsed = system.getProduct(product.id);
    expect(browsed).not.toBeNull();
    
    // User views gallery
    const gallery = new GalleryNavigator(browsed.images);
    expect(gallery.getCurrentImage()).toBe('front.jpg');
    
    // User navigates through images
    gallery.next();
    expect(gallery.getCurrentImage()).toBe('back.jpg');
    
    gallery.next();
    expect(gallery.getCurrentImage()).toBe('side.jpg');
    
    // User opens zoom
    const zoomGallery = new GalleryNavigator(browsed.images);
    zoomGallery.next();
    zoomGallery.next();
    expect(zoomGallery.getCurrentImage()).toBe('side.jpg');
    
    // User navigates back
    zoomGallery.prev();
    expect(zoomGallery.getCurrentImage()).toBe('back.jpg');
  });
});
