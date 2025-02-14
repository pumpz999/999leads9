#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

class SystemDiagnostic {
  constructor() {
    this.diagnosticReport = {
      nodeVersion: null,
      npmVersion: null,
      environmentVariables: {},
      dependenciesInstalled: false,
      buildStatus: false,
      criticalIssues: []
    };
  }

  checkNodeVersion() {
    try {
      this.diagnosticReport.nodeVersion = execSync('node --version').toString().trim();
      if (!this.diagnosticReport.nodeVersion.startsWith('v18')) {
        this.diagnosticReport.criticalIssues.push('Node.js version should be 18.x');
      }
    } catch (error) {
      this.diagnosticReport.criticalIssues.push('Node.js not installed');
    }
  }

  checkNpmVersion() {
    try {
      this.diagnosticReport.npmVersion = execSync('npm --version').toString().trim();
    } catch (error) {
      this.diagnosticReport.criticalIssues.push('NPM not installed');
    }
  }

  checkEnvironmentVariables() {
    const requiredEnvVars = [
      'VITE_APP_NAME',
      'VITE_XLOVECAM_AFFILIATE_ID',
      'VITE_XLOVECAM_SECRET_KEY'
    ];

    requiredEnvVars.forEach(varName => {
      this.diagnosticReport.environmentVariables[varName] = 
        process.env[varName] ? 'Set' : 'Missing';
    });
  }

  checkDependenciesInstalled() {
    try {
      fs.accessSync('./node_modules', fs.constants.F_OK);
      this.diagnosticReport.dependenciesInstalled = true;
    } catch (error) {
      this.diagnosticReport.criticalIssues.push('Dependencies not installed');
    }
  }

  checkBuildStatus() {
    try {
      execSync('npm run build', { stdio: 'ignore' });
      this.diagnosticReport.buildStatus = true;
    } catch (error) {
      this.diagnosticReport.criticalIssues.push('Build failed');
      this.diagnosticReport.buildStatus = false;
    }
  }

  runFullDiagnostic() {
    this.checkNodeVersion();
    this.checkNpmVersion();
    this.checkEnvironmentVariables();
    this.checkDependenciesInstalled();
    this.checkBuildStatus();

    return this.diagnosticReport;
  }

  generateReport() {
    const report = this.runFullDiagnostic();
    console.log('===== XxxCams.org System Diagnostic Report =====');
    console.log(JSON.stringify(report, null, 2));

    if (report.criticalIssues.length > 0) {
      console.error('\n🚨 Critical Issues Detected:');
      report.criticalIssues.forEach(issue => console.error(`- ${issue}`));
      process.exit(1);
    }
  }
}

const diagnostic = new SystemDiagnostic();
diagnostic.generateReport();
