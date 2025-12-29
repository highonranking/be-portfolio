// Backend script to trigger blog export for admin actions
import { exec } from 'child_process';
import path from 'path';

export function exportBlogsToJson(): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    // Path to the migration script in the frontend app
    const migrateScript = path.resolve(__dirname, '../../../frontend/scripts/migrateBlogsToJson.ts');
    // Use ts-node to run the migration script
    exec(`npx ts-node ${migrateScript}`, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, message: stderr || error.message });
      } else {
        resolve({ success: true, message: stdout });
      }
    });
  });
}
