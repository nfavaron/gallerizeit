import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Promise } from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { GallerySiteModel } from './site.model';
import * as firebase from 'firebase/app';
import { GallerySiteFirebaseInterface } from './site.firebase.interface';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GallerySiteService {

  listByPopularity$: Observable<GallerySiteModel[]>;
  listByPopularity: Subject<GallerySiteModel[]>;

  listByUpdate$: Observable<GallerySiteModel[]>;
  listByUpdate: Subject<GallerySiteModel[]>;

  /**
   *
   * @param db
   */
  constructor(private db: AngularFireDatabase) {

    this.listByPopularity = new Subject<GallerySiteModel[]>();
    this.listByPopularity$ = this.listByPopularity.asObservable();

    this.listByUpdate = new Subject<GallerySiteModel[]>();
    this.listByUpdate$ = this.listByUpdate.asObservable();
  }

  /**
   * Lists @limit sites ordered by popularity score
   *
   * @param limit
   */
  listSiteByPopularity(limit: number): Observable<GallerySiteModel[]> {

    // Get records from DB
    this
      .db
      .list('/site', {
        query: {
          orderByChild: 'likeCount',
          limitToLast: limit
        }
      })
      .map(sites => sites.map(this.getGallerySiteModel).reverse())
      .subscribe(sites => {

        this.listByPopularity.next(sites);

      })
      ;

    return this.listByPopularity$;
  }

  /**
   * Lists @limit sites ordered by update date
   *
   * @param limit
   */
  listSiteByUpdate(limit: number): Observable<GallerySiteModel[]> {

    // Get records from DB
    this
      .db
      .list('/site', {
        query: {
          orderByChild: 'updateDate',
          limitToLast: limit
        }
      })
      .map(sites => sites.map(this.getGallerySiteModel).reverse())
      .subscribe(sites => {

        this.listByUpdate.next(sites);

      })
    ;

    return this.listByUpdate$;
  }

  /**
   * Loads site identified by @siteId from database
   *
   * @param siteId
   */
  getSite(siteId: string): Observable<GallerySiteModel> {

    return this
      .db
      .object('/site/' + siteId)
      .map(this.getGallerySiteModel)
      ;
  }

  /**
   * Add @site to database
   *
   * @param site
   */
  addSite(site: GallerySiteModel): Promise<void> {

    site.createDate = <string>firebase.database['ServerValue'].TIMESTAMP;
    site.updateDate = <string>firebase.database['ServerValue'].TIMESTAMP;

    return this.storeSite(site);
  }

  /**
   * Updates @site in database
   *
   * @param site
   * @param updated
   */
  updateSite(site: GallerySiteModel, updated?: boolean): Promise<void> {

    if (updated === true) {

      site.updateDate = <string>firebase.database['ServerValue'].TIMESTAMP;
    }

    return this.storeSite(site);
  }

  /**
   * Deletes site identified by @siteId from database
   *
   * @param siteId
   */
  deleteSite(siteId: string) {

    this
      .db
      .object('/site/' + siteId)
      .remove()
    ;
  }

  /**
   * Stores @site in database
   *
   * @param site
   */
  private storeSite(site: GallerySiteModel): Promise<void> {

    return this
      .db
      .object('/site/' + site.getId())
      .update(this.getGallerySiteObject(site))
      ;
  }

  /**
   * Converts site object to GallerySiteModel
   *
   * @param data
   */
  private getGallerySiteModel(data: GallerySiteFirebaseInterface): GallerySiteModel {

    if (data.$exists() === false) {

      throw new Error('Site does not exist');
    }

    let site = new GallerySiteModel(data.url);

    site.loadCount = data.loadCount;
    site.likeCount = data.likeCount;
    site.createDate = data.createDate;
    site.updateDate = data.updateDate;
    site.coverUrl = data.coverUrl;
    site.title = data.title;

    return site;
  }

  /**
   * Converts GallerySiteModel to site object
   *
   * @param site
   */
  private getGallerySiteObject(site: GallerySiteModel): GallerySiteFirebaseInterface {

    return {
      url: site.url,
      loadCount: site.loadCount,
      likeCount: site.likeCount,
      createDate: site.createDate,
      updateDate: site.updateDate,
      coverUrl: site.coverUrl,
      title: site.title,
    };
  }
}
