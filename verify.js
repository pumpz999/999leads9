#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

class ComprehensiveVerification {
  constructor() {
    this.report = {
      nodeVersion: null,
      npmVersion: null,
      environmentCheck: {},
      dependenciesStatus: false,
      buildStatus: false,
      issues: []
    };
  }

  checkNodeEnvironment() {
    try {
      this.report.nodeVersion = execSync('node --version').toString().trim();
      this.report.npmVersion = execSync('npm --version').toString().trim();

      console.log(`🟢 Node.js Version: ${this.report.nodeVersion}`);
      console.log(`🟢 NPM Version: ${this.report.npmVersion}`);

      if (!this.report.nodeVersion.startsWith('v18')) {
        this.report.issues.push('Node.js version should be 18.x');
      }
    } catch (error) {
      this.report.issues.push('Node.js or NPM not properly installed');
    }
  }

  checkEnvironmentVariables() {
    const requiredVars = [
      'VITE_APP_NAME',
      'VITE_XLOVECAM_AFFILIATE_ID',
      'VITE_XLOVECAM_SECRET_KEY'
    ];

    requiredVars.forEach(varName => {
      const value = process.env[varName];
      this.report.environmentCheck[varName] = value ? 'Set' : 'Missing';
      
      if (!value) {
        this.report.issues.push(`Environment variable ${varName} is not set`);
      }
    });

    console.log('🔍 Environment Variables:');
    console.log(JSON.stringify(this.report.environmentCheck, null, 2));
  }

  checkDependencies() {
    try {
      execSync('npm list --depth=0', { stdio: 'ignore' });
      this.report.dependenciesStatus = true;
      console.log('🟢 Dependencies are installed');
    } catch (error) {
      this.report.issues.push('Dependencies are not properly installed');
      console.log('🔴 Attempting to install dependencies...');
      
      try {
        execSync('npm ci', { stdio: 'inherit' });
        this.report.dependenciesStatus = true;
        console.log('🟢 Dependencies successfully installed');
      } catch (installError) {
        this.report.issues.push('Failed to install dependencies');
        console.error('🔴 Dependency installation failed');
      }
    }
  }

  runBuildTest() {
    try {
      execSync('npm run build', { stdio: 'inherit' });
      this.report.buildStatus = true;
      console.log('🟢 Build process successful');
    } catch (error) {
      this.report.issues.push('Build process failed');
      console.error('🔴 Build process encountered errors');
    }
  }

  generateReport() {
    console.log('\n===== XxxCams.org Verification Report =====');
    
    if (this.report.issues.length === 0) {
      console.log('🎉 All systems are go! No issues detected.');
    } else {
      console.log('🚨 Issues Detected:');
      this.report.issues.forEach(issue => console.log(`- ${issue}`));
    }

    return this.report.issues.length === 0;
  }

  runFullVerification() {
    this.checkNodeEnvironment();
    this.checkEnvironmentVariables();
    this.checkDependencies();
    this.runBuildTest();
    return this.generateReport();
  }
}

const verification = new ComprehensiveVerification();
const isSuccessful = verification.runFullVerification();

process.exit(isSuccessful ? 0 : 1);
