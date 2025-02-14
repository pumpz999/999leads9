const fs = require('fs');
const path = require('path');

const PLATFORM_PREVIEW = {
  name: "XxxCams.org",
  version: "1.0.0",
  preview: {
    landingPage: {
      title: "Live Cam Models",
      description: "Explore top live cam models from around the world",
      features: [
        "Real-time model streaming",
        "Advanced filtering",
        "Secure authentication"
      ]
    },
    modelGrid: {
      layout: "4x3 responsive grid",
      cardDetails: [
        "Profile picture",
        "Nickname",
        "Country",
        "Online status"
      ]
    },
    adminPanel: {
      sections: [
        "API Configuration",
        "Model Management",
        "Performance Analytics"
      ]
    }
  },
  screenshots: [
    {
      name: "Landing Page",
      description: "Main page with model grid",
      mockupPath: "/screenshots/landing-page.png"
    },
    {
      name: "Model Details",
      description: "Detailed model profile view",
      mockupPath: "/screenshots/model-details.png"
    },
    {
      name: "Admin Dashboard",
      description: "Administrative control panel",
      mockupPath: "/screenshots/admin-dashboard.png"
    }
  ]
};

// Generate markdown preview
const generateMarkdownPreview = () => {
  return `
# XxxCams.org Platform Preview

## Platform Overview
- **Name**: XxxCams.org
- **Version**: 1.0.0

## Landing Page Features
${PLATFORM_PREVIEW.preview.landingPage.features.map(f => `- ${f}`).join('\n')}

## Model Grid Layout
- **Layout**: ${PLATFORM_PREVIEW.preview.modelGrid.layout}
- **Card Details**:
${PLATFORM_PREVIEW.preview.modelGrid.cardDetails.map(d => `  - ${d}`).join('\n')}

## Admin Panel Sections
${PLATFORM_PREVIEW.preview.adminPanel.sections.map(s => `- ${s}`).join('\n')}

## Screenshots
${PLATFORM_PREVIEW.screenshots.map(screenshot => 
  `### ${screenshot.name}
  - **Description**: ${screenshot.description}
  - **Preview**: [View Screenshot](${screenshot.mockupPath})`
).join('\n\n')}
  `;
};

// Write preview to file
fs.writeFileSync(
  path.join(__dirname, 'PLATFORM_PREVIEW.md'), 
  generateMarkdownPreview()
);

console.log("Platform preview generated successfully!");
