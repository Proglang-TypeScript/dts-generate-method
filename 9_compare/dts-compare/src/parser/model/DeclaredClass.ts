import { DeclaredFunction } from './DeclaredFunction';
import { DeclaredProperty } from './DeclaredProperty';
import { DeclaredPropertyTypeGenericKeyword } from './declared-property-types/DeclaredPropertyTypeGenericKeyword';

export class DeclaredClass {
  name: string;
  properties: DeclaredProperty[];
  methods: DeclaredFunction[];
  constructors: DeclaredFunction[];
  typeParameters: DeclaredPropertyTypeGenericKeyword[];

  constructor(name: string) {
    this.name = name;
    this.properties = [];
    this.methods = [];
    this.constructors = [];
    this.typeParameters = [];
  }

  addProperty(p: DeclaredProperty) {
    this.properties.push(p);
  }

  addMethod(m: DeclaredFunction) {
    this.methods.push(m);
  }

  addConstructor(c: DeclaredFunction) {
    this.constructors.push(c);
  }
}
