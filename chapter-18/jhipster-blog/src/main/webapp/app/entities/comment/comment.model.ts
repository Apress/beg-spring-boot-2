import { Post } from '../post';
export class Comment {
    constructor(
        public id?: number,
        public name?: string,
        public email?: string,
        public content?: string,
        public createdOn?: any,
        public post?: Post,
    ) {
    }
}
