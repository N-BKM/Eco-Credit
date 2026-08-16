import type { ClassificationResult } from '../types';
import { classifyWithYoloModel } from './yoloClassifier';

export async function classifyWasteImage(imageBase64: string, imageName: string): Promise<ClassificationResult> {
  return classifyWithYoloModel(imageBase64, imageName);
}
