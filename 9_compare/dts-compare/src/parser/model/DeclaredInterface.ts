import { DeclaredFunction } from './DeclaredFunction';
import { DeclaredProperty } from './DeclaredProperty';
import { DeclaredClass } from './DeclaredClass';
import { DeclaredIndexSignature } from './DeclaredIndexSignature';
import { DeclaredPropertyTypeGenericKeyword } from './declared-property-types/DeclaredPropertyTypeGenericKeyword';

export class DeclaredInterface {
  name: string;
  properties: DeclaredProperty[];
  methods: DeclaredFunction[];
  classes: DeclaredClass[];
  callSignatures: DeclaredFunction[];
  indexSignatures: DeclaredIndexSignature[];
  typeParameters: DeclaredPropertyTypeGenericKeyword[];

  constructor(name: string) {
    this.name = name;
    this.properties = [];
    this.methods = [];
    this.classes = [];
    this.callSignatures = [];
    this.indexSignatures = [];
    this.typeParameters = [];
  }

  addProperty(p: DeclaredProperty) {
    this.properties.push(p);
  }

  addMethod(m: DeclaredFunction) {
    this.methods.push(m);
  }

  addCallSignature(c: DeclaredFunction) {
    this.callSignatures.push(c);
  }

  addClass(c: DeclaredClass) {
    this.classes.push(c);
  }

  addIndexSignature(i: DeclaredIndexSignature) {
    this.indexSignatures.push(i);
  }
}
