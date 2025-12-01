import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

interface VersionData {
  version: string;
  build: number;
  lastUpdated: string;
}

export const getLatestRelease = async (req: Request, res: Response) => {
  try {
    // Read version from version.json
    const versionPath = path.join(__dirname, '..', '..', 'version.json');
    
    let versionData: VersionData;
    
    try {
      const versionFile = fs.readFileSync(versionPath, 'utf8');
      versionData = JSON.parse(versionFile);
    } catch (error) {
      // Fallback if version.json doesn't exist
      versionData = {
        version: '1.0.0',
        build: 1,
        lastUpdated: new Date().toISOString()
      };
    }

    return res.json({
      tag: `v${versionData.version}`,
      name: `v${versionData.version} (Build ${versionData.build})`,
      build: versionData.build,
      version: versionData.version,
      lastUpdated: versionData.lastUpdated,
      source: 'version.json'
    });
  } catch (error: any) {
    // Ultimate fallback
    return res.json({ 
      tag: 'v1.0.0', 
      name: 'v1.0.0 (Build 1)',
      build: 1,
      version: '1.0.0',
      source: 'fallback'
    });
  }
};
