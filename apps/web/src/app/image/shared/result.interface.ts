import { ImageModel } from './image.model';
import { ErrorModel } from './error.model';

export interface ResultInterface {
  image?: ImageModel,
  error?: ErrorModel
}
