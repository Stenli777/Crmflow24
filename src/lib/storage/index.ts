import { LocalStorageProvider } from "./localStorageProvider";
import type { StorageProvider } from "./storageProvider";

let provider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!provider) {
    provider = new LocalStorageProvider();
  }
  return provider;
}

export type { StorageProvider, StoredFile, UploadFileInput } from "./storageProvider";
