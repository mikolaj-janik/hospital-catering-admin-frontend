import { Meal } from "./meal";

export class OrderItem {
    constructor(
        public id: number,
        public meal: Meal,
        public date: Date
    ){}
}
