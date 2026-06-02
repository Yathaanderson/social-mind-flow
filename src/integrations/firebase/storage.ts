import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './client';

export async function uploadImage(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `post-images/${userId}/${fileName}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file);

  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}

export async function uploadBlob(userId: string, blob: Blob, fileName: string): Promise<string> {
  const filePath = `post-images/${userId}/${fileName}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, blob);

  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}
