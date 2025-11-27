# Implementation Plan

- [ ] 1. Update backend validation and limits
  - [x] 1.1 Update image count limit from 5 to 10 in server.js


    - Modify MAX_IMAGES constant in POST /api/products endpoint
    - Modify MAX_IMAGES constant in PUT /api/products/:id endpoint
    - Update error messages to reflect new limit
    - _Requirements: 1.1, 1.2_
  
  - [x] 1.2 Update image size validation to 1.5MB per image



    - Modify MAX_SIZE_PER_IMAGE constant to 1.5MB (in Base64)
    - Update validation loop for image size checking
    - Update error messages to reflect new size limit
    - _Requirements: 2.4_
  
  - [ ] 1.3 Write property test for image count constraint
    - **Property 1: Image count constraint**
    - **Validates: Requirements 1.1, 1.2, 5.3**
  
  - [ ] 1.4 Write property test for image size validation
    - **Property 2: Compressed image size constraint**
    - **Validates: Requirements 2.4**

- [ ] 2. Implement ImageCompressor class
  - [x] 2.1 Create ImageCompressor class with compression logic


    - Implement constructor with configurable options (maxWidth, maxHeight, quality, maxSizeKB)
    - Implement compress(file) method using Canvas API
    - Implement _resizeImage() helper to maintain aspect ratio
    - Implement _optimizeQuality() to adjust quality for size target
    - Add error handling for unsupported formats
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 2.2 Add file-to-base64 conversion with compression


    - Update fileToBase64() to use ImageCompressor
    - Return metadata object with base64, sizeKB, width, height, compressed flag
    - Handle compression errors gracefully
    - _Requirements: 2.1_
  
  - [x] 2.3 Implement compressMultiple() with progress callback

    - Process images sequentially with progress updates
    - Call onProgress callback after each image
    - Collect results and errors
    - Return array of compressed images with metadata
    - _Requirements: 3.1, 3.2_
  
  - [ ] 2.4 Write property test for compression quality threshold
    - **Property 3: Compression quality threshold**
    - **Validates: Requirements 2.2**
  
  - [ ] 2.5 Write property test for aspect ratio preservation
    - **Property 4: Aspect ratio preservation during resize**
    - **Validates: Requirements 2.3**
  
  - [ ] 2.6 Write property test for compression universality
    - **Property 15: Compression application universality**
    - **Validates: Requirements 2.1**

- [ ] 3. Implement ProgressIndicator component
  - [x] 3.1 Create ProgressIndicator class


    - Implement show(total) to display progress bar
    - Implement update(current, total, message) to update progress
    - Implement hide() to remove progress bar
    - Implement showError(message) for error states
    - Add HTML template for progress bar UI
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 3.2 Integrate progress indicator with image upload flow



    - Show progress when processing multiple images
    - Update progress after each image compression
    - Hide progress when complete
    - Show errors for failed images
    - Display summary of successful/failed images
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ] 3.3 Write property test for progress indicator accuracy
    - **Property 9: Progress indicator accuracy**
    - **Validates: Requirements 3.1, 3.2, 3.4**

- [ ] 4. Implement ImageUploadManager class
  - [x] 4.1 Create ImageUploadManager class structure


    - Implement constructor with container and options
    - Initialize images array and compressor instance
    - Set up maxImages limit (10)
    - _Requirements: 1.1_
  
  - [x] 4.2 Implement addImages() method

    - Validate total image count doesn't exceed 10
    - Use ImageCompressor to compress new images
    - Show progress indicator during processing
    - Add compressed images to images array
    - Handle errors for individual images
    - Update preview after adding
    - _Requirements: 1.1, 1.2, 2.1, 3.1, 5.2, 5.3_
  
  - [x] 4.3 Implement removeImage() method

    - Remove image at specified index
    - Update images array
    - Re-render preview
    - _Requirements: 8.1_
  
  - [x] 4.4 Implement replaceImage() method

    - Compress new image
    - Replace image at specified index
    - Maintain same position in array
    - Update preview immediately
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 4.5 Implement reorderImages() method

    - Move image from fromIndex to toIndex
    - Update images array
    - Re-render preview with new order
    - _Requirements: 4.3, 4.4_
  
  - [x] 4.6 Implement helper methods

    - getImages() to return array of base64 strings
    - getTotalSize() to calculate total size in KB
    - _formatSize() to format size as KB or MB
    - _Requirements: 7.1, 7.4, 7.5_
  
  - [x] 4.7 Implement render() method for preview grid

    - Generate HTML for image preview grid
    - Show thumbnails with position numbers
    - Display size for each image
    - Add remove button for each image
    - Add replace button for each image
    - Show total size at bottom
    - Show warning if total > 10MB
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 8.1_
  
  - [ ] 4.8 Write property test for image array integrity on addition
    - **Property 6: Image array integrity on addition**
    - **Validates: Requirements 5.1, 5.2, 5.3**
  
  - [ ] 4.9 Write property test for image replacement isolation
    - **Property 8: Image replacement isolation**
    - **Validates: Requirements 8.1, 8.3, 8.4, 8.5**
  
  - [ ] 4.10 Write property test for total size calculation
    - **Property 10: Total size calculation**
    - **Validates: Requirements 7.1, 7.2, 7.5**
  
  - [ ] 4.11 Write property test for size format consistency
    - **Property 11: Size format consistency**
    - **Validates: Requirements 7.4**

- [ ] 5. Implement DragDropHandler class
  - [x] 5.1 Create DragDropHandler class


    - Implement constructor with manager reference
    - Initialize draggedIndex state
    - _Requirements: 4.1_
  
  - [x] 5.2 Implement drag event handlers

    - Implement handleDragStart() to store dragged index and add visual feedback
    - Implement handleDragOver() to show drop target indicator
    - Implement handleDrop() to reorder images
    - Implement handleDragEnd() to clean up state
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [x] 5.3 Implement attachToElement() method

    - Attach drag event listeners to preview elements
    - Set draggable attribute
    - Add drag handle visual indicator
    - _Requirements: 4.1_
  
  - [x] 5.4 Add CSS for drag-and-drop feedback

    - Style for dragging state
    - Style for drop zone highlight
    - Style for drag handle
    - Transition animations
    - _Requirements: 4.2_
  
  - [ ] 5.5 Write property test for reorder operation correctness
    - **Property 7: Reorder operation correctness**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [ ] 6. Update product modal UI and integration
  - [x] 6.1 Update product modal HTML

    - Add container for ImageUploadManager
    - Add container for ProgressIndicator
    - Update file input to accept multiple files
    - Add drag-and-drop zone styling
    - _Requirements: 1.1, 3.1_
  
  - [x] 6.2 Integrate ImageUploadManager in product modal


    - Initialize ImageUploadManager when modal opens
    - Load existing images when editing product
    - Handle file input change event with addImages()
    - Update currentImages from manager.getImages()
    - _Requirements: 1.1, 5.1_
  
  - [x] 6.3 Update previewImages() function


    - Replace current implementation with ImageUploadManager
    - Remove old preview logic
    - Use manager.render() for preview display
    - _Requirements: 1.1, 7.1, 7.2_
  
  - [x] 6.4 Update saveProduct() function


    - Get images from ImageUploadManager
    - Validate image count (should be handled by manager)
    - Send images array to API
    - _Requirements: 1.1, 1.3_
  
  - [x] 6.5 Update openProductModal() for editing

    - Load existing product images into ImageUploadManager
    - Display existing images in preview
    - Allow adding more images up to limit
    - _Requirements: 5.1, 5.2_
  
  - [ ] 6.6 Write property test for serialization round-trip
    - **Property 5: Serialization round-trip**
    - **Validates: Requirements 1.4, 4.5, 5.5**

- [ ] 7. Implement lazy loading for catalog images
  - [x] 7.1 Add Intersection Observer for lazy loading

    - Create IntersectionObserver instance
    - Configure threshold and rootMargin
    - Observe all product images in catalog
    - Load image when entering viewport
    - _Requirements: 6.1, 6.2_
  
  - [x] 7.2 Update renderProducts() for lazy loading

    - Add loading="lazy" attribute to images
    - Use data-src for actual image source
    - Set placeholder src initially
    - Update ImageGallery to support lazy loading
    - _Requirements: 6.1, 6.2_
  
  - [x] 7.3 Implement preload strategy for gallery navigation


    - Preload only first image when gallery opens
    - Preload next image when user navigates
    - Cancel preload if user navigates away
    - _Requirements: 6.3, 6.4_
  
  - [ ] 7.4 Write property test for lazy loading behavior
    - **Property 12: Lazy loading behavior**
    - **Validates: Requirements 6.1, 6.2**
  
  - [ ] 7.5 Write property test for gallery preload strategy
    - **Property 13: Gallery preload strategy**
    - **Validates: Requirements 6.3, 6.4**

- [ ] 8. Update product display and gallery
  - [x] 8.1 Update getProductImages() helper

    - Ensure proper handling of images array
    - Maintain backward compatibility with single image field
    - Handle JSON parsing errors gracefully
    - _Requirements: 1.4_
  
  - [x] 8.2 Update ImageGallery component

    - Ensure first image is always primary
    - Update thumbnail display for up to 10 images
    - Adjust grid layout for more thumbnails
    - _Requirements: 1.5_
  
  - [x] 8.3 Update admin product list display

    - Show image count badge for products with multiple images
    - Update thumbnail to show first image
    - _Requirements: 1.5_
  
  - [ ] 8.4 Write property test for first image as primary
    - **Property 14: First image as primary**
    - **Validates: Requirements 1.5**

- [ ] 9. Testing and validation
  - [x] 9.1 Manual testing of full upload flow

    - Test uploading 10 images to new product
    - Test uploading images exceeding 10 limit
    - Test compression with various image sizes
    - Test progress indicator display
    - Verify all images saved correctly
    - _Requirements: 1.1, 1.2, 2.1, 3.1_
  
  - [x] 9.2 Manual testing of edit flow

    - Test loading product with existing images
    - Test adding more images to existing product
    - Test removing images
    - Test replacing specific images
    - Test reordering with drag-and-drop
    - Verify changes persist correctly
    - _Requirements: 5.1, 5.2, 8.1, 4.1_
  
  - [x] 9.3 Manual testing of display and performance

    - Test catalog display with multiple products
    - Verify lazy loading works
    - Test gallery navigation and preloading
    - Check image quality after compression
    - Verify size display accuracy
    - _Requirements: 6.1, 7.1, 2.2_
  
  - [x] 9.4 Cross-browser testing

    - Test in Chrome, Firefox, Safari, Edge
    - Verify drag-and-drop works in all browsers
    - Verify compression works consistently
    - Check for any UI issues
    - _Requirements: 4.1, 2.1_

- [x] 10. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Documentation and cleanup
  - [x] 11.1 Update code comments

    - Add JSDoc comments to new classes
    - Document compression parameters
    - Document drag-and-drop implementation
    - _Requirements: All_
  
  - [x] 11.2 Update README or documentation


    - Document new 10-image limit
    - Document compression behavior
    - Document drag-and-drop feature
    - Add troubleshooting section
    - _Requirements: All_
  
  - [x] 11.3 Code cleanup


    - Remove old unused code
    - Consolidate duplicate logic
    - Optimize performance bottlenecks
    - _Requirements: All_
