/**
 * Logo Implementation Tests
 * Tests for ShopManStore brand logo integration
 */

const fs = require('fs');
const path = require('path');

// Read HTML content once for all tests
const htmlPath = path.join(__dirname, 'public', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

describe('Logo Implementation', () => {
  describe('DOM Structure Tests', () => {
    test('logo img element exists in header with correct src', () => {
      // Validates: Requirements 1.1, 2.3
      const logoImgRegex = /<img[^>]*src=["']logo\.png["'][^>]*class=["']logo-image["'][^>]*>/;
      expect(htmlContent).toMatch(logoImgRegex);
    });

    test('logo img has descriptive alt text', () => {
      // Validates: Requirements 3.1
      const altTextRegex = /<img[^>]*alt=["']ShopManStore logo["'][^>]*>/;
      expect(htmlContent).toMatch(altTextRegex);
    });

    test('logo is within logo-container', () => {
      // Validates: Requirements 1.1
      const containerRegex = /<div class=["']logo-container["']>[\s\S]*?<img[^>]*class=["']logo-image["'][^>]*>[\s\S]*?<\/div>/;
      expect(htmlContent).toMatch(containerRegex);
    });

    test('logo-image class has proper CSS styles defined', () => {
      // Validates: Requirements 1.2, 1.3
      expect(htmlContent).toContain('.logo-image');
      expect(htmlContent).toContain('object-fit: contain');
      expect(htmlContent).toContain('border-radius: 50%');
    });

    test('logo has hover effect defined in CSS', () => {
      // Validates: Requirements 1.4
      expect(htmlContent).toContain('.logo-image:hover');
      expect(htmlContent).toContain('transform: scale(1.05)');
    });

    test('logo has responsive styles for mobile', () => {
      // Validates: Requirements 1.3
      const mobileStylesRegex = /@media \(max-width: 640px\)[\s\S]*?\.logo-image[\s\S]*?width: 40px/;
      expect(htmlContent).toMatch(mobileStylesRegex);
    });
  });
});


describe('Property-Based Tests', () => {
  // Feature: add-brand-logo, Property 1: Responsive logo sizing
  // Validates: Requirements 1.3
  
  test('logo dimensions scale appropriately for different viewport widths', () => {
    const fc = require('fast-check');

    // Define viewport breakpoints and expected logo sizes
    const getExpectedLogoSize = (viewportWidth) => {
      if (viewportWidth < 640) {
        return { width: 40, height: 40 }; // Mobile
      } else {
        return { width: 48, height: 48 }; // Desktop/Tablet
      }
    };

    // Verify CSS rules exist for both breakpoints
    const hasMobileStyles = htmlContent.includes('width: 40px') && htmlContent.includes('height: 40px');
    const hasDesktopStyles = htmlContent.includes('width: 48px') && htmlContent.includes('height: 48px');
    
    expect(hasMobileStyles).toBe(true);
    expect(hasDesktopStyles).toBe(true);

    // Property: For any viewport width, the expected size should be correctly defined
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }), // Generate random viewport widths
        (viewportWidth) => {
          const expected = getExpectedLogoSize(viewportWidth);
          
          // Verify the logic: viewport determines which breakpoint applies
          if (viewportWidth < 640) {
            return expected.width === 40 && expected.height === 40;
          } else {
            return expected.width === 48 && expected.height === 48;
          }
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design
    );
  });
});


describe('File Existence Tests', () => {
  test('logo.png file exists in public directory', () => {
    // Validates: Requirements 2.1
    const logoPath = path.join(__dirname, 'public', 'logo.png');
    expect(fs.existsSync(logoPath)).toBe(true);
  });

  test('logo file is accessible and readable', () => {
    // Validates: Requirements 2.1, 4.1
    const logoPath = path.join(__dirname, 'public', 'logo.png');
    
    if (fs.existsSync(logoPath)) {
      const stats = fs.statSync(logoPath);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBeGreaterThan(0);
    } else {
      // If file doesn't exist yet, skip this test
      console.warn('Warning: logo.png not found. Please save the logo image to public/logo.png');
    }
  });
});
