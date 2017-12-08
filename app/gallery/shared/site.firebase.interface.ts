export interface GallerySiteFirebaseInterface {
  $key?: string;
  $exists?: () => boolean;
  $value?: string|number|boolean;
  url: string;
  loadCount: number;
  likeCount: number;
  createDate: string;
  updateDate: string;
  coverUrl: string;
  title: string;
}
