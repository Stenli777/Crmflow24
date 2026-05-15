export type StoredFile = {
  storageKey: string;
  publicUrl: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
};

export type UploadFileInput = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
};

export interface StorageProvider {
  uploadFile(input: UploadFileInput): Promise<StoredFile>;
  deleteFile(storageKey: string): Promise<void>;
  getPublicUrl(storageKey: string): string;
}
