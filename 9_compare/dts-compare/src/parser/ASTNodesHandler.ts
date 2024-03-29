import * as ts from 'typescript';
import { DeclaredNamespace } from './model/DeclaredNamespace';
import { AddFunction } from './AddFunction';
import { DeclaredFunction } from './model/DeclaredFunction';
import { DeclaredInterface } from './model/DeclaredInterface';
import { AddInterface } from './AddInterface';

import DeclaredPropertyType from './model/declared-property-types/DeclaredPropertyType';
import { DeclaredProperty } from './model/DeclaredProperty';
import { DeclaredPropertyTypePrimitiveKeyword } from './model/declared-property-types/DeclaredPropertyTypePrimitiveKeyword';
import { DeclaredPropertyTypeFunctionType } from './model/declared-property-types/DeclaredPropertyTypeFunctionType';
import { DeclaredPropertyTypeInterface } from './model/declared-property-types/DeclaredPropertyTypeInterface';
import { DeclaredPropertyTypeUnionType } from './model/declared-property-types/DeclaredPropertyTypeUnionType';
import { DeclaredPropertyTypeLiterals } from './model/declared-property-types/DeclaredPropertyTypeLiterals';
import { DeclaredPropertyArrayType } from './model/declared-property-types/DeclaredPropertyArrayType';
import { AddClass } from './AddClass';
import { DeclaredClass } from './model/DeclaredClass';
import { DeclaredPropertyTypeReferenceType } from './model/declared-property-types/DeclaredPropertyTypeReferenceType';
import TAGS from './tags/tags';
import { DeclaredPropertyTypeAnyKeyword } from './model/declared-property-types/DeclaredPropertyTypeAnyKeyword';
import { DeclaredPropertyTypeTupleType } from './model/declared-property-types/DeclaredPropertyTypeTupleType';
import { DeclaredIndexSignature } from './model/DeclaredIndexSignature';
import { DeclaredPropertyTypeGenericKeyword } from './model/declared-property-types/DeclaredPropertyTypeGenericKeyword';
import { DeclaredPropertyTypeUndefinedKeyword } from './model/declared-property-types/DeclaredPropertyTypeUndefinedKeyword';
import DATA_MODIFIERS from './model/data-modifiers';
import { DeclaredPropertyTypeIntersectionType } from './model/declared-property-types/DeclaredPropertyTypeIntersectionType';
import { DeclaredPropertyTypeObjectKeyword } from './model/declared-property-types/DeclaredPropertyTypeObjectKeyword';
import { DeclaredPropertyTypeVoidKeyword } from './model/declared-property-types/DeclaredPropertyTypeVoidKeyword';
import { Histogram } from './Histogram';

interface SimplifiedFunctionDeclaration {
  name?: ts.Identifier | ts.StringLiteral | ts.NumericLiteral | ts.PropertyName | undefined;
  type?: ts.TypeNode | undefined;
  parameters: ts.NodeArray<ts.ParameterDeclaration>;
  modifiers?: ts.NodeArray<ts.Modifier> | undefined;
  typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>;
}

interface SimplifiedInterfaceDeclaration {
  name?: ts.Identifier;
  members: ts.NodeArray<ts.TypeElement>;
  typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>;
}

interface SimplifiedPropertyDeclaration {
  name?: ts.PropertyName | ts.BindingName;
  type?: ts.TypeNode | undefined;
  questionToken?: ts.Token<ts.SyntaxKind.QuestionToken> | undefined;
  modifiers?: ts.ModifiersArray | undefined;
  dotDotDotToken?: ts.DotDotDotToken | undefined;
}

export class ASTNodesHandler {
  private mapSymbolInterfaces: WeakMap<ts.Symbol, DeclaredInterface> = new WeakMap();
  private mapGenericTypes: WeakMap<ts.Symbol, DeclaredPropertyTypeGenericKeyword> = new WeakMap();
  private mapSymbolTypeAliases: WeakMap<ts.Symbol, DeclaredPropertyType> = new WeakMap();
  // eslint-disable-next-line @typescript-eslint/ban-types
  private mapCircularReferences: WeakMap<object, DeclaredPropertyType> = new WeakMap();
  private declaredFunctions: DeclaredFunction[] = [];

  private tsChecker: ts.TypeChecker;
  private sourceFile: ts.SourceFile;
  private tags: Histogram;

  constructor(tsChecker: ts.TypeChecker, sourceFile: ts.SourceFile, tags: Histogram) {
    this.tsChecker = tsChecker;
    this.sourceFile = sourceFile;
    this.tags = tags;
  }

  addNamespace(node: ts.ModuleDeclaration, declarationMap: DeclaredNamespace): DeclaredNamespace {
    const namespaceName: string = node.name.text;

    const declaredNamespace = new DeclaredNamespace(namespaceName);
    declarationMap.addNamespace(declaredNamespace);

    return declaredNamespace;
  }

  addFunctionDeclaration(
    node: SimplifiedFunctionDeclaration,
    parentDeclarationObject: AddFunction,
  ): DeclaredFunction {
    const declaredFunction = this.getDeclaredFunction(node);
    parentDeclarationObject.addFunction(declaredFunction);

    return declaredFunction;
  }

  addInterfaceDeclaration(
    node: SimplifiedInterfaceDeclaration,
    parentDeclarationObject: AddInterface,
  ) {
    const declaredInterface = this.getDeclaredInterface(node);
    parentDeclarationObject.addInterface(declaredInterface);

    return declaredInterface;
  }

  addClassDeclaration(node: ts.ClassDeclaration, parentDeclarationObject: AddClass) {
    const declaredClass = this.getDeclaredClass(node);

    parentDeclarationObject.addClass(declaredClass);
  }

  public fixCircularReferences() {
    this.declaredFunctions.forEach((declaredFunction) => {
      if (this.mapCircularReferences.has(declaredFunction.returnType)) {
        declaredFunction.returnType = this.mapCircularReferences.get(
          declaredFunction.returnType,
        ) as DeclaredPropertyType;
      }
    });
  }

  private getDeclaredFunction(node: SimplifiedFunctionDeclaration): DeclaredFunction {
    const functionName = node.name ? node.name.getText() : '';

    const declaredFunction = new DeclaredFunction(
      functionName,
      this.getDeclaredPropertyType(node.type),
    );

    this.declaredFunctions.push(declaredFunction);

    node.parameters.forEach((p) => {
      declaredFunction.addParameter(this.getDeclaredProperty(p));
    });

    if (node.typeParameters) {
      node.typeParameters.forEach((typeParameter) => {
        declaredFunction.addTypeParameter(this.getPropertyTypeGeneric(typeParameter));
      });
    }

    if (node.modifiers) {
      node.modifiers.forEach((m) => {
        declaredFunction.addModifier(m.getText());
      });
    }

    return declaredFunction;
  }

  private getPropertyTypeGeneric(
    node: ts.TypeParameterDeclaration,
  ): DeclaredPropertyTypeGenericKeyword {
    const symbol = this.tsChecker.getSymbolAtLocation(node.name as ts.Node);
    const type = new DeclaredPropertyTypeGenericKeyword(
      node.name.getText(),
      node.constraint ? this.getDeclaredPropertyType(node.constraint) : undefined,
      node.default ? this.getDeclaredPropertyType(node.default) : undefined,
    );

    if (symbol === undefined) {
      return type;
    }

    // if (!this.mapGenericTypes.has(symbol)) {
    //   symbol.declarations.forEach((d) => {
    //     if (d.kind === ts.SyntaxKind.TypeParameter) {
    //       this.mapGenericTypes.set(symbol, type);
    //     }
    //   });
    // }

    if (
      !this.mapGenericTypes.has(symbol) &&
      symbol.declarations.some((d) => d.kind === ts.SyntaxKind.TypeParameter)
    ) {
      this.mapGenericTypes.set(symbol, type);
    }

    return this.mapGenericTypes.get(symbol) || type;
  }

  private getDeclaredInterface(node: SimplifiedInterfaceDeclaration): DeclaredInterface {
    const symbol = this.tsChecker.getSymbolAtLocation(node.name as ts.Node);

    if (symbol !== undefined) {
      const interfaceForSymbol = this.mapSymbolInterfaces.get(symbol);
      if (interfaceForSymbol !== undefined) {
        return interfaceForSymbol;
      }
    }

    const declaredInterface = new DeclaredInterface(node.name ? node.name.getText() : '');

    //symbol.declarations.some((d) => d.kind === ts.SyntaxKind.TypeParameter)
    if (
      symbol !== undefined &&
      symbol.declarations.some((d) => d.kind === ts.SyntaxKind.InterfaceDeclaration)
    ) {
      this.mapSymbolInterfaces.set(symbol, declaredInterface);
    }
    // if (symbol !== undefined) {
    //   symbol.declarations.forEach((d) => {
    //     if (d.kind === ts.SyntaxKind.InterfaceDeclaration) {
    //       this.mapSymbolInterfaces.set(symbol, declaredInterface);
    //     }
    //   });
    // }

    node.members.forEach((m) => {
      switch (m.kind) {
        case ts.SyntaxKind.PropertySignature:
          const p = m as ts.PropertySignature;
          declaredInterface.addProperty(this.getDeclaredProperty(p));

          break;

        case ts.SyntaxKind.MethodSignature:
          const a = m as ts.MethodSignature;

          a.typeParameters;
          declaredInterface.addMethod(this.getDeclaredFunction(m as ts.MethodSignature));
          break;

        case ts.SyntaxKind.CallSignature:
          this.tags.inc(TAGS.CALL_SIGNATURE);
          declaredInterface.addCallSignature(
            this.getDeclaredFunction(m as ts.CallSignatureDeclaration),
          );
          break;

        case ts.SyntaxKind.IndexSignature:
          this.tags.inc(TAGS.INDEX_SIGNATURE);
          declaredInterface.addIndexSignature(
            this.getDeclaredIndexSignature(m as ts.IndexSignatureDeclaration),
          );
          break;

        default:
          break;
      }
    });

    if (node.typeParameters) {
      this.tags.inc(TAGS.GENERICS_INTERFACE);
      node.typeParameters.forEach((typeParameter) => {
        declaredInterface.addTypeParameter(this.getPropertyTypeGeneric(typeParameter));
      });
    }

    return declaredInterface;
  }

  private getDeclaredIndexSignature(node: ts.IndexSignatureDeclaration): DeclaredIndexSignature {
    const parameter = this.getDeclaredProperty(node.parameters[0]);
    const type = this.getDeclaredPropertyType(node.type);

    return new DeclaredIndexSignature(parameter, type);
  }

  private getDeclaredClass(classDeclaration: ts.ClassDeclaration): DeclaredClass {
    const declaredClass = new DeclaredClass(
      classDeclaration.name ? classDeclaration.name.getText() : '',
    );

    classDeclaration.members.forEach((m) => {
      switch (m.kind) {
        case ts.SyntaxKind.Constructor:
          const constructor = this.getDeclaredFunction(m as ts.ConstructorDeclaration);
          constructor.name = 'constructor';
          constructor.isConstructor = true;

          declaredClass.addConstructor(constructor);
          break;

        case ts.SyntaxKind.MethodDeclaration:
          declaredClass.addMethod(this.getDeclaredFunction(m as ts.MethodDeclaration));
          break;

        case ts.SyntaxKind.PropertyDeclaration:
          declaredClass.addProperty(this.getDeclaredProperty(m as ts.PropertyDeclaration));
          break;

        default:
          break;
      }
    });

    if (classDeclaration.typeParameters) {
      this.tags.inc(TAGS.GENERICS_CLASS);
      classDeclaration.typeParameters.forEach((typeParameter) => {
        declaredClass.typeParameters.push(this.getPropertyTypeGeneric(typeParameter));
      });
    }

    return declaredClass;
  }

  private getDeclaredProperty(p: SimplifiedPropertyDeclaration): DeclaredProperty {
    const parameterName = (p.name ? p.name.getText() : '').trim().replace(/'|"/g, '');

    const isOptional = p.questionToken !== undefined;

    if (isOptional === true) {
      this.tags.inc(TAGS.OPTIONAL);
      if (p.type?.kind == ts.SyntaxKind.OptionalType) {
        this.tags.inc(TAGS.OPTIONAL_OPTIONAL_ANTI_PATTERN);
      }
    }

    const property = new DeclaredProperty(
      parameterName,
      this.getDeclaredPropertyType(p.type),
      isOptional,
    );

    this.addModifiersToProperty(property, p);

    if (p.dotDotDotToken !== undefined) {
      this.tags.inc(TAGS.DOT_DOT_DOT_TOKEN);
      property.setDotDotDotToken(true);
    }

    return property;
  }

  private addModifiersToProperty(property: DeclaredProperty, p: SimplifiedPropertyDeclaration) {
    p.modifiers?.forEach((m) => {
      switch (m.kind) {
        case ts.SyntaxKind.PrivateKeyword:
          this.tags.inc(TAGS.PRIVATE);
          property.addModifier(DATA_MODIFIERS.PRIVATE);
          break;

        case ts.SyntaxKind.ProtectedKeyword:
          this.tags.inc(TAGS.PROTECTED);
          property.addModifier(DATA_MODIFIERS.PROTECTED);
          break;

        case ts.SyntaxKind.StaticKeyword:
          this.tags.inc(TAGS.STATIC);
          property.addModifier(DATA_MODIFIERS.STATIC);
          break;

        case ts.SyntaxKind.ReadonlyKeyword:
          this.tags.inc(TAGS.READONLY);
          property.addModifier(DATA_MODIFIERS.READONLY);
          break;

        case ts.SyntaxKind.PublicKeyword:
          this.tags.inc(TAGS.PUBLIC);
          property.addModifier(DATA_MODIFIERS.PUBLIC);
          break;
      }
    });
  }

  private getDeclaredPropertyType(type: ts.TypeNode | undefined): DeclaredPropertyType {
    if (type) {
      switch (type.kind) {
        case ts.SyntaxKind.ParenthesizedType:
          const parenthesizedTypeNode = type as ts.ParenthesizedTypeNode;
          return this.getDeclaredPropertyType(parenthesizedTypeNode.type);
          break;

        case ts.SyntaxKind.OptionalType:
          this.tags.inc(TAGS.OPTIONAL_TYPE);
          const optTypeNode = type as ts.OptionalTypeNode;
          return this.getDeclaredPropertyType(optTypeNode.type);
          break;

        case ts.SyntaxKind.FunctionType:
          const functionType = type as ts.FunctionTypeNode;

          this.tags.inc(TAGS.FUNCTION);
          return new DeclaredPropertyTypeFunctionType(this.getDeclaredFunction(functionType));
          break;

        case ts.SyntaxKind.TypeLiteral:
          const typeLiteralNode = type as ts.TypeLiteralNode;

          return new DeclaredPropertyTypeInterface(
            this.getDeclaredInterface(typeLiteralNode as SimplifiedInterfaceDeclaration),
          );
          break;

        case ts.SyntaxKind.LiteralType:
          const literalTypeNode = type as ts.LiteralTypeNode;

          this.tags.inc(TAGS.LITERALS);
          return new DeclaredPropertyTypeLiterals(literalTypeNode.getText());

        case ts.SyntaxKind.UnionType:
          const unionTypeNode = type as ts.UnionTypeNode;

          const unionDeclaredProperties: DeclaredPropertyType[] = [];
          unionTypeNode.types.forEach((t) => {
            unionDeclaredProperties.push(this.getDeclaredPropertyType(t));
          });

          this.tags.inc(TAGS.UNION);
          return new DeclaredPropertyTypeUnionType(unionDeclaredProperties);
          break;

        case ts.SyntaxKind.IntersectionType:
          const intersectionTypeNode = type as ts.IntersectionTypeNode;

          const intersectionDeclaredProperties: DeclaredPropertyType[] = [];
          intersectionTypeNode.types.forEach((t) => {
            intersectionDeclaredProperties.push(this.getDeclaredPropertyType(t));
          });

          this.tags.inc(TAGS.INTERSECTION);
          return new DeclaredPropertyTypeIntersectionType(intersectionDeclaredProperties);
          break;

        case ts.SyntaxKind.ArrayType:
          const arrayTypeNode = type as ts.ArrayTypeNode;

          return this.getDeclaredPropertyArrayType(arrayTypeNode.elementType);
          break;

        case ts.SyntaxKind.TypeReference:
          const typeReferenceNode = type as ts.TypeReferenceNode;

          const tsSymbol = this.tsChecker.getSymbolAtLocation(typeReferenceNode.typeName);

          if (tsSymbol !== undefined) {
            if (
              tsSymbol.escapedName.toString() === 'Array' &&
              typeReferenceNode.typeArguments?.length === 1
            ) {
              return this.getDeclaredPropertyArrayType(typeReferenceNode.typeArguments[0]);
            }

            if (
              tsSymbol.escapedName.toString() === 'ReadonlyArray' &&
              typeReferenceNode.typeArguments?.length === 1
            ) {
              this.tags.inc(TAGS.READONLY_ARRAY);
              return this.getDeclaredPropertyArrayType(typeReferenceNode.typeArguments[0]);
            }

            if (tsSymbol.escapedName.toString() === 'Function') {
              this.tags.inc(TAGS.TYPE_REFERENCE_FUNCTION);
              this.tags.inc(TAGS.FUNCTION);
              return new DeclaredPropertyTypeReferenceType(tsSymbol.escapedName.toString());
            }

            const typeAliasDeclaredPropertyType =
              this.getTypeAliasDeclaredPropertyTypeForSymbol(tsSymbol);
            if (typeAliasDeclaredPropertyType !== null) {
              this.tags.inc(TAGS.ALIAS);
              return typeAliasDeclaredPropertyType;
            }

            const interfaceForSymbol = this.getInterfaceForSymbol(tsSymbol);
            if (interfaceForSymbol !== null) {
              return new DeclaredPropertyTypeInterface(interfaceForSymbol);
            }

            const typeParameter = this.getTypeParameterForSymbol(tsSymbol);
            if (typeParameter !== null) {
              this.tags.inc(TAGS.GENERICS_FUNCTION);
              return this.getPropertyTypeGeneric(typeParameter);
            }
          }

          return new DeclaredPropertyTypeReferenceType(typeReferenceNode.getText());

          break;

        case ts.SyntaxKind.TupleType:
          const tupleTypeNode = type as ts.TupleTypeNode;

          const tupleDeclaredProperties: DeclaredPropertyType[] = [];
          tupleTypeNode.elementTypes.forEach((t) => {
            tupleDeclaredProperties.push(this.getDeclaredPropertyType(t));
          });

          this.tags.inc(TAGS.TUPLE);
          return new DeclaredPropertyTypeTupleType(tupleDeclaredProperties);
          break;

        case ts.SyntaxKind.AnyKeyword:
          this.tags.inc(TAGS.ANY);

          return new DeclaredPropertyTypeAnyKeyword();

        case ts.SyntaxKind.UndefinedKeyword:
          this.tags.inc(TAGS.UNDEFINED);

          return new DeclaredPropertyTypeUndefinedKeyword();

        case ts.SyntaxKind.ObjectKeyword:
          this.tags.inc(TAGS.OBJECT);

          return new DeclaredPropertyTypeObjectKeyword();

        case ts.SyntaxKind.VoidKeyword:
          this.tags.inc(TAGS.VOID);

          return new DeclaredPropertyTypeVoidKeyword();

        case ts.SyntaxKind.StringKeyword:
          this.tags.inc(TAGS.STRING);

          return new DeclaredPropertyTypePrimitiveKeyword('string');

        case ts.SyntaxKind.NumberKeyword:
          this.tags.inc(TAGS.NUMBER);

          return new DeclaredPropertyTypePrimitiveKeyword('number');

        case ts.SyntaxKind.BooleanKeyword:
          this.tags.inc(TAGS.BOOLEAN);

          return new DeclaredPropertyTypePrimitiveKeyword('boolean');
      }
    }

    const parameterType = type ? type.getText() : '';

    return new DeclaredPropertyTypePrimitiveKeyword(parameterType);
  }

  private getInterfaceForSymbol(tsSymbol: ts.Symbol): DeclaredInterface | null {
    const interfaceDeclarations = tsSymbol.getDeclarations()?.filter((d) => {
      d.kind === ts.SyntaxKind.InterfaceDeclaration &&
        d.getSourceFile().fileName === this.sourceFile.fileName;
    });

    if (interfaceDeclarations === undefined || interfaceDeclarations.length === 0) {
      return null;
    }

    return this.getDeclaredInterface(
      interfaceDeclarations[0] as ts.InterfaceDeclaration as SimplifiedInterfaceDeclaration,
    );
  }

  private getTypeAliasDeclaredPropertyTypeForSymbol(
    tsSymbol: ts.Symbol,
  ): DeclaredPropertyType | null {
    const typeAliasDeclarationForSymbol = this.mapSymbolTypeAliases.get(tsSymbol);
    if (typeAliasDeclarationForSymbol !== undefined) {
      return typeAliasDeclarationForSymbol;
    }

    const typeAliasDeclarations = tsSymbol.getDeclarations()?.filter((d) => {
      return (
        d.kind === ts.SyntaxKind.TypeAliasDeclaration &&
        d.getSourceFile().fileName === this.sourceFile.fileName
      );
    });

    if (typeAliasDeclarations === undefined || typeAliasDeclarations.length === 0) {
      return null;
    }

    const typeAliasDeclaration = typeAliasDeclarations[0] as ts.TypeAliasDeclaration;

    const dummyTypeSafeguardForCircularReferences = {};
    this.mapSymbolTypeAliases.set(
      tsSymbol,
      dummyTypeSafeguardForCircularReferences as DeclaredPropertyType,
    );
    const declaredPropertyType = this.getDeclaredPropertyType(typeAliasDeclaration.type);

    this.mapSymbolTypeAliases.set(tsSymbol, declaredPropertyType);
    this.mapCircularReferences.set(dummyTypeSafeguardForCircularReferences, declaredPropertyType);

    return declaredPropertyType;
  }

  private getTypeParameterForSymbol(tsSymbol: ts.Symbol): ts.TypeParameterDeclaration | null {
    const typeParameters = tsSymbol.getDeclarations()?.filter((d) => {
      return (
        d.kind === ts.SyntaxKind.TypeParameter &&
        d.getSourceFile().fileName === this.sourceFile.fileName
      );
    });

    if (typeParameters === undefined || typeParameters.length === 0) {
      return null;
    }

    return typeParameters[0] as ts.TypeParameterDeclaration;
  }

  private getDeclaredPropertyArrayType(node: ts.TypeNode): DeclaredPropertyArrayType {
    this.tags.inc(TAGS.ARRAY);
    return new DeclaredPropertyArrayType(this.getDeclaredPropertyType(node));
  }
}
