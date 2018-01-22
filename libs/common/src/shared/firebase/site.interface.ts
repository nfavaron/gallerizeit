export interface FirebaseSiteInterface {
  $key?: string;
  $exists?: () => boolean;
  $value?: string|number|boolean;
  url: string;
  loadCount: number;
  likeCount: number;
  createDate: number;
  updateDate: number;
  coverUrl: string;
  title: string;
}
