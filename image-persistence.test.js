// **Feature: shopmanstore-mejoras, Property 4: Image array persistence round-trip**
// **Feature: shopmanstore-mejoras, Property 13: Image array deserialization**
const fc = require('fast-check');

describe('Image Array Persistence Tests', () => {
  
  // Simulate database serialization
  function serializeImages(images) {
    return JSON.stringify(images);
  }

  // Simulate database deserialization
  function deserializeImages(imagesString) {
    try {
      const parsed = JSON.parse(imagesString || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Deserialization error:', e);
      return [];
    }
  }

  // Simulate product save/load cycle
  function saveAndLoadProduct(product) {
    // Serialize images for database
    const serialized = serializeImages(product.images);
    
    // Simulate database storage and retrieval
    const retrieved = {
      ...product,
      images: deserializeImages(serialized)
    };
    
    return retrieved;
  }

  test('Property 4: Image array persistence round-trip', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer({ min: 1, max: 10000 }),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          images: fc.array(
            fc.string({ minLength: 20, maxLength: 100 }).map(s => `data:image/jpeg;base64,${s}`),
            { minLength: 1, maxLength: 5 }
          )
        }),
        (product) => {
          const retrieved = saveAndLoadProduct(product);
          
          // Verify same number of images
          expect(retrieved.images.length).toBe(product.images.length);
          
          // Verify all images are preserved
          expect(retrieved.images).toEqual(product.images);
          
          // Verify order is preserved
          product.images.forEach((img, index) => {
            expect(retrieved.images[index]).toBe(img);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 13: Image array deserialization', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 10, maxLength: 50 }),
          { minLength: 0, maxLength: 5 }
        ),
        (imageStrings) => {
          const images = imageStrings.map(s => `data:image/png;base64,${s}`);
          const serialized = serializeImages(images);
          const deserialized = deserializeImages(serialized);
          
          // Must be a valid JavaScript array
          expect(Array.isArray(deserialized)).toBe(true);
          
          // Must have same length
          expect(deserialized.length).toBe(images.length);
          
          // Must have same content
          expect(deserialized).toEqual(images);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Deserialization handles corrupted data gracefully', () => {
    // Invalid JSON
    expect(deserializeImages('not valid json')).toEqual([]);
    expect(deserializeImages('{')).toEqual([]);
    expect(deserializeImages(null)).toEqual([]);
    expect(deserializeImages(undefined)).toEqual([]);
    expect(deserializeImages('')).toEqual([]);
  });

  test('Deserialization handles non-array JSON', () => {
    // Valid JSON but not an array
    expect(deserializeImages('"string"')).toEqual([]);
    expect(deserializeImages('123')).toEqual([]);
    expect(deserializeImages('{"key": "value"}')).toEqual([]);
    expect(deserializeImages('true')).toEqual([]);
  });

  test('Empty array round-trip', () => {
    const product = { id: 1, name: 'Test', images: [] };
    const retrieved = saveAndLoadProduct(product);
    
    expect(retrieved.images).toEqual([]);
    expect(Array.isArray(retrieved.images)).toBe(true);
  });

  test('Single image round-trip', () => {
    const product = { 
      id: 1, 
      name: 'Test', 
      images: ['data:image/jpeg;base64,abc123'] 
    };
    const retrieved = saveAndLoadProduct(product);
    
    expect(retrieved.images.length).toBe(1);
    expect(retrieved.images[0]).toBe('data:image/jpeg;base64,abc123');
  });

  test('Maximum images (5) round-trip', () => {
    const product = { 
      id: 1, 
      name: 'Test', 
      images: [
        'data:image/jpeg;base64,img1',
        'data:image/jpeg;base64,img2',
        'data:image/jpeg;base64,img3',
        'data:image/jpeg;base64,img4',
        'data:image/jpeg;base64,img5'
      ] 
    };
    const retrieved = saveAndLoadProduct(product);
    
    expect(retrieved.images.length).toBe(5);
    expect(retrieved.images).toEqual(product.images);
  });

  test('Special characters in images are preserved', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 10, maxLength: 50 }),
          { minLength: 1, maxLength: 3 }
        ),
        (strings) => {
          // Include special characters that might break JSON
          const images = strings.map(s => `data:image/jpeg;base64,${s}+/=`);
          const serialized = serializeImages(images);
          const deserialized = deserializeImages(serialized);
          
          expect(deserialized).toEqual(images);
        }
      ),
      { numRuns: 100 }
    );
  });
});
