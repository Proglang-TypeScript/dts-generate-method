
import ts from 'typescript';

export class Histogram extends Map<String, number>{
    inc(key: string) {

        let oldVal = this.get(key)
        if (typeof (oldVal) == "number") {
            this.set(key, oldVal + 1)
        }

        else { this.set(key, 1); }


    }

}