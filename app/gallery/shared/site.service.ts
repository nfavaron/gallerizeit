import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Promise } from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { GallerySiteModel } from './site.model';
import * as firebase from 'firebase/app';

@Injectable()
export class GallerySiteService {

  /**
   *
   * @param db
   */
  constructor(private db: AngularFireDatabase) {

  }

  /**
   * List @count sites ordered by popularity
   *
   * @param count
   */
  listSiteByMostPopular(count: number): Observable<GallerySiteModel[]> {

    return this
      .db
      .list('/site', {
        query: {
          orderByChild: 'loadCount',
          limitToLast: count
        }
      })
      .map(sites => sites.map(this.getGallerySiteModel).reverse())
      ;
  }

  /**
   * List @count sites ordered by popularity
   *
   * @param count
   */
  listSiteByMostRecent(count: number): Observable<GallerySiteModel[]> {

    return this
      .db
      .list('/site', {
        query: {
          orderByChild: 'createDate',
          limitToLast: count
        }
      })
      .map(sites => sites.map(this.getGallerySiteModel).reverse())
      ;
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

    return this.storeSite(site);
  }

  /**
   * Updates @site in database
   *
   * @param site
   */
  updateSite(site: GallerySiteModel): Promise<void> {

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
      .update(this.getSiteObject(site))
      ;
  }

  /**
   * Converts site object to GallerySiteModel
   *
   * @param data
   */
  private getGallerySiteModel(data: any): GallerySiteModel {

    if (data.$exists() === false) {

      throw new Error('Site does not exist');
    }

    let site = new GallerySiteModel(data.$key);

    site.url = data.url;
    site.loadCount = data.loadCount;
    site.createDate = data.createDate;
    site.coverUrl = data.coverUrl;

    return site;
  }

  /**
   * Converts GallerySiteModel to site object
   *
   * @param site
   */
  private getSiteObject(site: GallerySiteModel): {[key: string]: string|number} {

    return {
      url: site.url,
      loadCount: site.loadCount,
      createDate: site.createDate,
      coverUrl: site.coverUrl
    };
  }
}
