// **Feature: shopmanstore-mejoras, Property 11: Image order persistence**
const fc = require('fast-check');

describe('Image Reordering Tests', () => {
  
  // Simulate reordering function
  function reorderImages(images, fromIndex, toIndex) {
    const result = [...images];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  }

  // Simulate save/load cycle
  function saveAndLoadImages(images) {
    const serialized = JSON.stringify(images);
    return JSON.parse(serialized);
  }

  test('Property 11: Image order persistence', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 5, maxLength: 20 }).map(s => `img_${s}`),
          { minLength: 2, maxLength: 5 }
        ),
        fc.integer({ min: 0 }),
        fc.integer({ min: 0 }),
        (images, fromSeed, toSeed) => {
          const N = images.length;
          const fromIndex = fromSeed % N;
          const toIndex = toSeed % N;
          
          // Reorder images
          const reordered = reorderImages(images, fromIndex, toIndex);
          
          // Save and reload
          const persisted = saveAndLoadImages(reordered);
          
          // Order must be preserved after save/load
          expect(persisted).toEqual(reordered);
          expect(persisted.length).toBe(reordered.length);
          
          // Each element must be in correct position
          reordered.forEach((img, index) => {
            expect(persisted[index]).toBe(img);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Moving first image to last position', () => {
    const images = ['img1', 'img2', 'img3', 'img4'];
    const reordered = reorderImages(images, 0, 3);
    
    expect(reordered).toEqual(['img2', 'img3', 'img4', 'img1']);
    
    const persisted = saveAndLoadImages(reordered);
    expect(persisted).toEqual(reordered);
  });

  test('Moving last image to first position', () => {
    const images = ['img1', 'img2', 'img3', 'img4'];
    const reordered = reorderImages(images, 3, 0);
    
    expect(reordered).toEqual(['img4', 'img1', 'img2', 'img3']);
    
    const persisted = saveAndLoadImages(reordered);
    expect(persisted).toEqual(reordered);
  });

  test('Moving image one position left', () => {
    const images = ['img1', 'img2', 'img3', 'img4'];
    const reordered = reorderImages(images, 2, 1);
    
    expect(reordered).toEqual(['img1', 'img3', 'img2', 'img4']);
    
    const persisted = saveAndLoadImages(reordered);
    expect(persisted).toEqual(reordered);
  });

  test('Moving image one position right', () => {
    const images = ['img1', 'img2', 'img3', 'img4'];
    const reordered = reorderImages(images, 1, 2);
    
    expect(reordered).toEqual(['img1', 'img3', 'img2', 'img4']);
    
    const persisted = saveAndLoadImages(reordered);
    expect(persisted).toEqual(reordered);
  });

  test('Moving image to same position (no-op)', () => {
    const images = ['img1', 'img2', 'img3'];
    const reordered = reorderImages(images, 1, 1);
    
    expect(reordered).toEqual(['img1', 'img2', 'img3']);
  });

  test('Multiple reorderings preserve final order', () => {
    let images = ['img1', 'img2', 'img3', 'img4', 'img5'];
    
    // Perform multiple reorderings
    images = reorderImages(images, 0, 2); // ['img2', 'img3', 'img1', 'img4', 'img5']
    images = reorderImages(images, 4, 1); // ['img2', 'img5', 'img3', 'img1', 'img4']
    images = reorderImages(images, 2, 0); // ['img3', 'img2', 'img5', 'img1', 'img4']
    
    const persisted = saveAndLoadImages(images);
    expect(persisted).toEqual(images);
  });

  test('Reordering preserves all images', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 2, maxLength: 5 }),
        fc.integer({ min: 0 }),
        fc.integer({ min: 0 }),
        (images, fromSeed, toSeed) => {
          const N = images.length;
          const fromIndex = fromSeed % N;
          const toIndex = toSeed % N;
          
          const reordered = reorderImages(images, fromIndex, toIndex);
          
          // Must have same length
          expect(reordered.length).toBe(images.length);
          
          // Must contain all original images
          const originalSet = new Set(images);
          const reorderedSet = new Set(reordered);
          expect(reorderedSet.size).toBe(originalSet.size);
          
          images.forEach(img => {
            expect(reordered).toContain(img);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Reordering with two images', () => {
    const images = ['img1', 'img2'];
    
    const reordered1 = reorderImages(images, 0, 1);
    expect(reordered1).toEqual(['img2', 'img1']);
    
    const reordered2 = reorderImages(images, 1, 0);
    expect(reordered2).toEqual(['img2', 'img1']);
  });

  test('Complex reordering scenario', () => {
    const images = ['A', 'B', 'C', 'D', 'E'];
    
    // Move C to first position
    let result = reorderImages(images, 2, 0);
    expect(result).toEqual(['C', 'A', 'B', 'D', 'E']);
    
    // Move E to second position
    result = reorderImages(result, 4, 1);
    expect(result).toEqual(['C', 'E', 'A', 'B', 'D']);
    
    // Persist and verify
    const persisted = saveAndLoadImages(result);
    expect(persisted).toEqual(['C', 'E', 'A', 'B', 'D']);
  });

  test('Reordering maintains image data integrity', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 20, maxLength: 50 }).map(s => `data:image/jpeg;base64,${s}`),
          { minLength: 2, maxLength: 5 }
        ),
        fc.integer({ min: 0 }),
        fc.integer({ min: 0 }),
        (images, fromSeed, toSeed) => {
          const N = images.length;
          const fromIndex = fromSeed % N;
          const toIndex = toSeed % N;
          
          const reordered = reorderImages(images, fromIndex, toIndex);
          const persisted = saveAndLoadImages(reordered);
          
          // Each image data must be intact
          persisted.forEach(img => {
            expect(img).toMatch(/^data:image\/jpeg;base64,/);
            expect(images).toContain(img);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
