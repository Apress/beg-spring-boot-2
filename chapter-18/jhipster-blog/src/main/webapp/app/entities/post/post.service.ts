import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { DateUtils } from 'ng-jhipster';

import { Post } from './post.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class PostService {

    private resourceUrl = 'api/posts';

    constructor(private http: Http, private dateUtils: DateUtils) { }

    create(post: Post): Observable<Post> {
        const copy = this.convert(post);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(post: Post): Observable<Post> {
        const copy = this.convert(post);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<Post> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.createdOn = this.dateUtils
            .convertLocalDateFromServer(entity.createdOn);
    }

    private convert(post: Post): Post {
        const copy: Post = Object.assign({}, post);
        copy.createdOn = this.dateUtils
            .convertLocalDateToServer(post.createdOn);
        return copy;
    }
}
