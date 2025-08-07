// Modern Worksheet Template System
export const modernWorksheetTemplate = {
  version: '2.0',
  
  // Color Schemes
  colors: {
    primary: ['#3B82F6', '#1E40AF', '#2563EB'], // Blues
    secondary: ['#F3F4F6', '#E5E7EB', '#D1D5DB'], // Grays
    accent: ['#10B981', '#F59E0B', '#EF4444'], // Green, Yellow, Red
    background: '#FFFFFF',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      accent: '#3B82F6'
    }
  },

  // Typography
  typography: {
    fonts: {
      heading: '"Inter", "Segoe UI", sans-serif',
      body: '"Inter", "Segoe UI", sans-serif',
      accent: '"Poppins", sans-serif'
    },
    sizes: {
      title: '24px',
      heading: '18px',
      subheading: '16px',
      body: '14px',
      caption: '12px'
    },
    weights: {
      bold: 700,
      semibold: 600,
      medium: 500,
      regular: 400
    }
  },

  // Layout Structure
  layout: {
    page: {
      width: '8.5in',
      height: '11in',
      margins: '0.75in',
      padding: '20px'
    },
    
    header: {
      height: '80px',
      background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
      color: '#FFFFFF',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px'
    },

    content: {
      grid: {
        columns: 2,
        gap: '20px',
        itemPadding: '16px'
      },
      
      sections: {
        background: '#F8FAFC',
        border: '2px solid #E2E8F0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px'
      }
    },

    footer: {
      height: '40px',
      borderTop: '2px solid #E2E8F0',
      paddingTop: '12px',
      textAlign: 'center',
      fontSize: '12px',
      color: '#6B7280'
    }
  },

  // Component Styles
  components: {
    infoBox: {
      background: '#F0F9FF',
      border: '2px solid #0EA5E9',
      borderRadius: '8px',
      padding: '16px',
      margin: '12px 0'
    },

    keyPoint: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: '8px 0',
      borderLeft: '4px solid #3B82F6',
      paddingLeft: '12px',
      marginBottom: '8px'
    },

    activityBox: {
      background: '#FEFCE8',
      border: '2px dashed #EAB308',
      borderRadius: '8px',
      padding: '20px',
      minHeight: '120px',
      textAlign: 'center'
    },

    imageContainer: {
      width: '100%',
      height: '150px',
      background: '#F1F5F9',
      border: '2px solid #CBD5E1',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '12px'
    }
  },

  // Interactive Elements
  interactions: {
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.2s ease'
    },

    focus: {
      outline: '2px solid #3B82F6',
      outlineOffset: '2px'
    },

    active: {
      transform: 'translateY(0px)',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
    }
  },

  // Responsive Breakpoints
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    print: '@media print'
  },

  // Animation Settings
  animations: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms'
    },
    
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)'
    }
  }
};

// Template Utilities
export const templateUtils = {
  // Generate CSS from template
  generateCSS: (template = modernWorksheetTemplate) => {
    return `
      .worksheet-container {
        width: ${template.layout.page.width};
        height: ${template.layout.page.height};
        margin: ${template.layout.page.margins};
        padding: ${template.layout.page.padding};
        background: ${template.colors.background};
        font-family: ${template.typography.fonts.body};
        color: ${template.colors.text.primary};
      }

      .worksheet-header {
        height: ${template.layout.header.height};
        background: ${template.layout.header.background};
        color: ${template.layout.header.color};
        border-radius: ${template.layout.header.borderRadius};
        padding: ${template.layout.header.padding};
        margin-bottom: ${template.layout.header.marginBottom};
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .worksheet-title {
        font-size: ${template.typography.sizes.title};
        font-weight: ${template.typography.weights.bold};
        font-family: ${template.typography.fonts.heading};
      }

      .content-grid {
        display: grid;
        grid-template-columns: repeat(${template.layout.content.grid.columns}, 1fr);
        gap: ${template.layout.content.grid.gap};
        margin-bottom: 24px;
      }

      .content-section {
        background: ${template.layout.content.sections.background};
        border: ${template.layout.content.sections.border};
        border-radius: ${template.layout.content.sections.borderRadius};
        padding: ${template.layout.content.sections.padding};
      }

      .info-box {
        background: ${template.components.infoBox.background};
        border: ${template.components.infoBox.border};
        border-radius: ${template.components.infoBox.borderRadius};
        padding: ${template.components.infoBox.padding};
        margin: ${template.components.infoBox.margin};
      }

      .key-point {
        display: ${template.components.keyPoint.display};
        align-items: ${template.components.keyPoint.alignItems};
        padding: ${template.components.keyPoint.padding};
        border-left: ${template.components.keyPoint.borderLeft};
        padding-left: ${template.components.keyPoint.paddingLeft};
        margin-bottom: ${template.components.keyPoint.marginBottom};
      }

      .activity-box {
        background: ${template.components.activityBox.background};
        border: ${template.components.activityBox.border};
        border-radius: ${template.components.activityBox.borderRadius};
        padding: ${template.components.activityBox.padding};
        min-height: ${template.components.activityBox.minHeight};
        text-align: ${template.components.activityBox.textAlign};
      }

      .image-container {
        width: ${template.components.imageContainer.width};
        height: ${template.components.imageContainer.height};
        background: ${template.components.imageContainer.background};
        border: ${template.components.imageContainer.border};
        border-radius: ${template.components.imageContainer.borderRadius};
        display: ${template.components.imageContainer.display};
        align-items: ${template.components.imageContainer.alignItems};
        justify-content: ${template.components.imageContainer.justifyContent};
        margin-bottom: ${template.components.imageContainer.marginBottom};
      }

      .worksheet-footer {
        height: ${template.layout.footer.height};
        border-top: ${template.layout.footer.borderTop};
        padding-top: ${template.layout.footer.paddingTop};
        text-align: ${template.layout.footer.textAlign};
        font-size: ${template.layout.footer.fontSize};
        color: ${template.layout.footer.color};
      }

      /* Hover Effects */
      .interactive:hover {
        transform: ${template.interactions.hover.transform};
        box-shadow: ${template.interactions.hover.boxShadow};
        transition: ${template.interactions.hover.transition};
      }

      /* Print Styles */
      @media print {
        .worksheet-container {
          margin: 0;
          box-shadow: none;
        }
        
        .no-print {
          display: none;
        }
      }
    `;
  },

  // Apply template to worksheet data
  applyTemplate: (worksheetData, templateConfig = modernWorksheetTemplate) => {
    return {
      ...worksheetData,
      styling: {
        template: templateConfig,
        css: templateUtils.generateCSS(templateConfig),
        components: templateConfig.components
      }
    };
  },

  // Generate template variants
  createVariant: (baseTemplate, overrides) => {
    return {
      ...baseTemplate,
      ...overrides,
      colors: { ...baseTemplate.colors, ...overrides.colors },
      typography: { ...baseTemplate.typography, ...overrides.typography },
      layout: { ...baseTemplate.layout, ...overrides.layout }
    };
  }
};

export default modernWorksheetTemplate;
