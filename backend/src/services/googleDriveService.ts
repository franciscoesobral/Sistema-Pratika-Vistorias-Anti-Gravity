import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

export class GoogleDriveService {
  private auth: OAuth2Client;
  private drive;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = 'https://developers.google.com/oauthplayground';
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      console.warn('Google Drive credentials not found in .env');
    }

    this.auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    this.auth.setCredentials({ refresh_token: refreshToken });

    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  async listFiles(folderId: string) {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, createdTime)',
        orderBy: 'createdTime desc',
      });
      return response.data.files || [];
    } catch (error) {
      console.error('Error listing files from Drive:', error);
      throw error;
    }
  }

  async downloadFile(fileId: string, destPath: string): Promise<string> {
    try {
      const dest = fs.createWriteStream(destPath);
      const response = await this.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      return new Promise((resolve, reject) => {
        response.data
          .on('end', () => resolve(destPath))
          .on('error', (err) => reject(err))
          .pipe(dest);
      });
    } catch (error) {
      console.error(`Error downloading file ${fileId}:`, error);
      throw error;
    }
  }

  async moveFile(fileId: string, folderId: string) {
    // Implementation to move processed files to a "Processed" folder if needed
    // This requires getting the current parents first, then removing them and adding the new one
    try {
      const file = await this.drive.files.get({
        fileId,
        fields: 'parents',
      });
      
      const previousParents = file.data.parents?.join(',') || '';
      
      await this.drive.files.update({
        fileId,
        addParents: folderId,
        removeParents: previousParents,
        fields: 'id, parents',
      });
    } catch (error) {
       console.error(`Error moving file ${fileId}:`, error);
    }
  }
}

export const googleDriveService = new GoogleDriveService();
