import { Comment } from '../comment';
export class Post {
    constructor(
        public id?: number,
        public title?: string,
        public content?: string,
        public createdOn?: any,
        public comments?: Comment,
    ) {
    }
}
