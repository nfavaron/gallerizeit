import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Promise } from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { SiteModel } from './site.model';
import { SiteFirebaseInterface } from './site-firebase.interface';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SiteService {

  listByPopularity$: Observable<SiteModel[]>;
  listByPopularity: Subject<SiteModel[]>;

  listByUpdate$: Observable<SiteModel[]>;
  listByUpdate: Subject<SiteModel[]>;

  /**
   *
   * @param db
   */
  constructor(private db: AngularFireDatabase) {

    this.listByPopularity = new Subject<SiteModel[]>();
    this.listByPopularity$ = this.listByPopularity.asObservable();

    this.listByUpdate = new Subject<SiteModel[]>();
    this.listByUpdate$ = this.listByUpdate.asObservable();
  }

  /**
   * Lists @limit sites ordered by popularity score
   *
   * @param limit
   */
  listSiteByPopularity(limit: number): Observable<SiteModel[]> {

    // Get records from DB
    this
      .db
      .list('/site', {
        query: {
          orderByChild: 'likeCount',
          limitToLast: limit
        }
      })
      .map(sites => sites.map(this.getSiteModel).reverse())
      .subscribe(
        sites => this.listByPopularity.next(sites),
        e => this.listByPopularity.next([])
      )
    ;

    return this.listByPopularity$;
  }

  /**
   * Lists @limit sites ordered by update date
   *
   * @param limit
   */
  listSiteByUpdate(limit: number): Observable<SiteModel[]> {

    // Get records from DB
    this
      .db
      .list('/site', {
        query: {
          orderByChild: 'updateDate',
          limitToLast: limit
        }
      })
      .map(sites => sites.map(this.getSiteModel).reverse())
      .subscribe(
        sites => this.listByUpdate.next(sites),
        e => this.listByUpdate.next([])
      )
    ;

    return this.listByUpdate$;
  }

  /**
   * Loads site identified by @siteId from database
   *
   * @param siteId
   */
  getSite(siteId: string): Observable<SiteModel> {

    return this
      .db
      .object('/site/' + siteId)
      .map(this.getSiteModel)
      ;
  }

  /**
   * Add @site to database
   *
   * @param site
   */
  addSite(site: SiteModel): Promise<void> {

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
  updateSite(site: SiteModel, updated?: boolean): Promise<void> {

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
  private storeSite(site: SiteModel): Promise<void> {

    return this
      .db
      .object('/site/' + site.getId())
      .update(this.getSiteFirebase(site))
      ;
  }

  /**
   * Converts site object to SiteModel
   *
   * @param data
   */
  private getSiteModel(data: SiteFirebaseInterface): SiteModel {

    if (data.$exists() === false) {

      throw new Error('Site does not exist');
    }

    const site = new SiteModel(data.url);

    site.loadCount = data.loadCount;
    site.likeCount = data.likeCount;
    site.createDate = data.createDate;
    site.updateDate = data.updateDate;
    site.coverUrl = data.coverUrl;
    site.title = data.title;

    return site;
  }

  /**
   * Converts SiteModel to site a firebase object
   *
   * @param site
   */
  private getSiteFirebase(site: SiteModel): SiteFirebaseInterface {

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
