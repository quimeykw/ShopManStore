// **Feature: shopmanstore-mejoras, Property 12: Migration converts single image to array**
const fc = require('fast-check');

describe('Image Migration Tests', () => {
  
  // Helper function to simulate migration
  function migrateImageToArray(imageString) {
    if (!imageString) return [];
    if (typeof imageString === 'string' && imageString.startsWith('[')) {
      // Already an array
      return JSON.parse(imageString);
    }
    // Convert single image to array
    return [imageString];
  }

  // Helper to serialize as database would
  function serializeImages(images) {
    return JSON.stringify(images);
  }

  // Helper to deserialize as application would
  function deserializeImages(imagesString) {
    try {
      return JSON.parse(imagesString || '[]');
    } catch (e) {
      return [];
    }
  }

  test('Property 12: Migration converts single image to array', () => {
    fc.assert(
      fc.property(
        // Generate random base64-like image strings
        fc.string({ minLength: 10, maxLength: 100 }),
        (imageString) => {
          // Simulate a product with a single image
          const originalImage = `data:image/jpeg;base64,${imageString}`;
          
          // Migrate to array format
          const migratedArray = migrateImageToArray(originalImage);
          
          // Verify it's an array with one element
          expect(Array.isArray(migratedArray)).toBe(true);
          expect(migratedArray.length).toBe(1);
          expect(migratedArray[0]).toBe(originalImage);
          
          // Verify round-trip through serialization
          const serialized = serializeImages(migratedArray);
          const deserialized = deserializeImages(serialized);
          
          expect(deserialized).toEqual(migratedArray);
          expect(deserialized[0]).toBe(originalImage);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Migration preserves image data integrity', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 10, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
        (imageStrings) => {
          const images = imageStrings.map(s => `data:image/jpeg;base64,${s}`);
          
          // Serialize and deserialize
          const serialized = serializeImages(images);
          const deserialized = deserializeImages(serialized);
          
          // Should preserve all images
          expect(deserialized).toEqual(images);
          expect(deserialized.length).toBe(images.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Migration handles empty or null images', () => {
    expect(migrateImageToArray(null)).toEqual([]);
    expect(migrateImageToArray(undefined)).toEqual([]);
    expect(migrateImageToArray('')).toEqual([]);
  });

  test('Migration handles already-migrated products', () => {
    const alreadyMigrated = JSON.stringify(['image1.jpg', 'image2.jpg']);
    const result = migrateImageToArray(alreadyMigrated);
    
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(['image1.jpg', 'image2.jpg']);
  });

  test('Serialization round-trip maintains order', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
        (images) => {
          const serialized = serializeImages(images);
          const deserialized = deserializeImages(serialized);
          
          // Order must be preserved
          expect(deserialized).toEqual(images);
          
          // Each element must match
          images.forEach((img, index) => {
            expect(deserialized[index]).toBe(img);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
