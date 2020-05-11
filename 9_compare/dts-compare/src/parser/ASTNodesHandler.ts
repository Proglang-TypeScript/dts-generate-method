import * as ts from 'typescript';
import { DeclaredNamespace } from './model/DeclaredNamespace';
import { AddFunction } from './AddFunction';
import { DeclaredFunction } from './model/DeclaredFunction';
import { DeclaredInterface } from './model/DeclaredInterface';
import { AddInterface } from './AddInterface'

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


interface SimplifiedFunctionDeclaration {
	name?: ts.Identifier | ts.StringLiteral | ts.NumericLiteral | ts.PropertyName | undefined;
	type?: ts.TypeNode | undefined;
	parameters: ts.NodeArray<ts.ParameterDeclaration>;
	modifiers?: ts.NodeArray<ts.Modifier> | undefined;
	typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>;
}

interface SimplifiedInterfaceDeclaration {
	name?: ts.Identifier;
	members: ts.NodeArray<ts.TypeElement>
	typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>;
}

interface SimplifiedPropertyDeclaration {
	name?: ts.PropertyName | ts.BindingName;
	type?: ts.TypeNode | undefined;
	questionToken?: ts.Token<ts.SyntaxKind.QuestionToken> | undefined;
	modifiers?: ts.ModifiersArray | undefined
}

export class ASTNodesHandler {
	private mapSymbolInterfaces: WeakMap<ts.Symbol, DeclaredInterface> = new Map();
	private mapGenericTypes: WeakMap<ts.Symbol, DeclaredPropertyTypeGenericKeyword> = new Map();
	private tsChecker: ts.TypeChecker;
	private sourceFile: ts.SourceFile;
	private tags: Set<string>;

	constructor(tsChecker: ts.TypeChecker, sourceFile: ts.SourceFile, tags: Set<string>) {
		this.tsChecker = tsChecker;
		this.sourceFile = sourceFile;
		this.tags = tags;
	}

	addNamespace(node: ts.ModuleDeclaration, declarationMap: DeclaredNamespace): DeclaredNamespace {
		let namespaceName: string = node.name.text;

		let declaredNamespace = new DeclaredNamespace(namespaceName);
		declarationMap.addNamespace(declaredNamespace);

		return declaredNamespace;
	}

	addFunctionDeclaration(node: SimplifiedFunctionDeclaration, parentDeclarationObject: AddFunction): DeclaredFunction {
		let declaredFunction = this.getDeclaredFunction(node);
		parentDeclarationObject.addFunction(declaredFunction);

		return declaredFunction;
	}

	addInterfaceDeclaration(node: SimplifiedInterfaceDeclaration, parentDeclarationObject: AddInterface) {
		const declaredInterface = this.getDeclaredInterface(node);
		parentDeclarationObject.addInterface(declaredInterface);

		return declaredInterface;
	}

	addClassDeclaration(node: ts.ClassDeclaration, parentDeclarationObject: AddClass) {
		let declaredClass = this.getDeclaredClass(node);

		parentDeclarationObject.addClass(declaredClass);
	}

	private getDeclaredFunction(node: SimplifiedFunctionDeclaration): DeclaredFunction {
		let functionName = node.name ? node.name.getText() : "";

		let declaredFunction = new DeclaredFunction(
			functionName,
			this.getDeclaredPropertyType(node.type)
		);

		node.parameters.forEach(p => {
			declaredFunction.addParameter(this.getDeclaredProperty(p));
		});

		if (node.typeParameters) {
			node.typeParameters.forEach(typeParameter => {
				declaredFunction.typeParameters.push(this.getPropertyTypeGeneric(typeParameter));
			});
		}

		if (node.modifiers) {
			node.modifiers.forEach(m => {
				declaredFunction.addModifier(m.getText());
			});
		}

		return declaredFunction;
	}

	private getPropertyTypeGeneric(node: ts.TypeParameterDeclaration) : DeclaredPropertyTypeGenericKeyword {
		const symbol = this.tsChecker.getSymbolAtLocation(node.name as ts.Node);
		const type = new DeclaredPropertyTypeGenericKeyword(
			node.name.getText(),
			node.constraint ? this.getDeclaredPropertyType(node.constraint) : undefined,
			node.default ? this.getDeclaredPropertyType(node.default) : undefined
		);

		if (symbol === undefined) {
			return type;
		}

		if (!this.mapGenericTypes.has(symbol)) {
			symbol.declarations.forEach(d => {
				if (d.kind === ts.SyntaxKind.TypeParameter) {
					this.mapGenericTypes.set(symbol, type);
				}
			});
		}

		return this.mapGenericTypes.get(symbol) || type;
	}

	private getDeclaredInterface(node: SimplifiedInterfaceDeclaration) : DeclaredInterface {
		const symbol = this.tsChecker.getSymbolAtLocation(node.name as ts.Node);

		if (symbol !== undefined) {
			const interfaceForSymbol = this.mapSymbolInterfaces.get(symbol);
			if (interfaceForSymbol !== undefined) {
				return interfaceForSymbol;
			}
		}

		const declaredInterface = new DeclaredInterface(node.name ? node.name.getText() : "");

		if (symbol !== undefined) {
			symbol.declarations.forEach(d => {
				if (d.kind === ts.SyntaxKind.InterfaceDeclaration) {
					this.mapSymbolInterfaces.set(symbol, declaredInterface);
				}
			});
		}

		node.members.forEach(m => {
			switch (m.kind) {
				case ts.SyntaxKind.PropertySignature:
					const p = m as ts.PropertySignature;
					declaredInterface.addProperty(this.getDeclaredProperty(p));

					break;

				case ts.SyntaxKind.MethodSignature:
					let a = m as ts.MethodSignature;

					a.typeParameters
					declaredInterface.addMethod(this.getDeclaredFunction(m as ts.MethodSignature));
					break;

				case ts.SyntaxKind.CallSignature:
					declaredInterface.addCallSignature(this.getDeclaredFunction(m as ts.CallSignatureDeclaration));

				case ts.SyntaxKind.IndexSignature:
					this.tags.add(TAGS.INDEX_SIGNATURE);
					declaredInterface.addIndexSignature(this.getDeclaredIndexSignature(m as ts.IndexSignatureDeclaration));

				default:
					break;
			}
		});

		if (node.typeParameters) {
			this.tags.add(TAGS.GENERICS_INTERFACE);
			node.typeParameters.forEach(typeParameter => {
				declaredInterface.typeParameters.push(this.getPropertyTypeGeneric(typeParameter));
			});
		}

		return declaredInterface;
	}

	private getDeclaredIndexSignature(node: ts.IndexSignatureDeclaration) : DeclaredIndexSignature {
		const parameter = this.getDeclaredProperty(node.parameters[0]);
		const type = this.getDeclaredPropertyType(node.type);

		return new DeclaredIndexSignature(parameter, type);
	}

	private getDeclaredClass(classDeclaration: ts.ClassDeclaration) : DeclaredClass {
		let declaredClass = new DeclaredClass(classDeclaration.name ? classDeclaration.name.getText() : "");

		classDeclaration.members.forEach(m => {
			switch (m.kind) {
				case ts.SyntaxKind.Constructor:
					let constructor = this.getDeclaredFunction(m as ts.ConstructorDeclaration);
					constructor.name = "constructor";
					constructor.isConstructor = true;

					declaredClass.addConstructor(constructor);
					break;

				case ts.SyntaxKind.MethodDeclaration:
					declaredClass.addMethod(
						this.getDeclaredFunction(m as ts.MethodDeclaration)
					);
					break;

				case ts.SyntaxKind.PropertyDeclaration:
					declaredClass.addProperty(
						this.getDeclaredProperty(m as ts.PropertyDeclaration)
					);
					break;

				default:
					break;
			}
		});

		if (classDeclaration.typeParameters) {
			this.tags.add(TAGS.GENERICS_CLASS);
			classDeclaration.typeParameters.forEach(typeParameter => {
				declaredClass.typeParameters.push(this.getPropertyTypeGeneric(typeParameter));
			});
		}

		return declaredClass;
	}

	private getDeclaredProperty(p: SimplifiedPropertyDeclaration): DeclaredProperty {
		let parameterName = (p.name ? p.name.getText() : "").trim().replace(/'|"/g, '');

		const isOptional = (p.questionToken !== undefined);

		if (isOptional === true) {
			this.tags.add(TAGS.OPTIONAL);
		}

		const property = new DeclaredProperty(
			parameterName,
			this.getDeclaredPropertyType(p.type),
			isOptional
		);

		p.modifiers?.forEach(m => {
			switch (m.kind) {
				case ts.SyntaxKind.PrivateKeyword:
					this.tags.add(TAGS.PRIVATE);
					property.addModifier(DATA_MODIFIERS.PRIVATE);
			}
		});

		return property;
	}

	private getDeclaredPropertyType(type: ts.TypeNode | undefined) : DeclaredPropertyType {
		if (type) {
			switch (type.kind) {
				case ts.SyntaxKind.ParenthesizedType:
					const parenthesizedTypeNode = type as ts.ParenthesizedTypeNode;
					return this.getDeclaredPropertyType(parenthesizedTypeNode.type);
					break;

				case ts.SyntaxKind.FunctionType:
					const functionType = type as ts.FunctionTypeNode;

					this.tags.add(TAGS.FUNCTION);
					return new DeclaredPropertyTypeFunctionType(this.getDeclaredFunction(functionType));
					break;

				case ts.SyntaxKind.TypeLiteral:
					const typeLiteralNode = type as ts.TypeLiteralNode;

					return new DeclaredPropertyTypeInterface(
							this.getDeclaredInterface(typeLiteralNode as SimplifiedInterfaceDeclaration)
					);
					break;

				case ts.SyntaxKind.LiteralType:
					const literalTypeNode = type as ts.LiteralTypeNode;

					this.tags.add(TAGS.LITERALS);
					return new DeclaredPropertyTypeLiterals(literalTypeNode.getText());

				case ts.SyntaxKind.UnionType:
					const unionTypeNode = type as ts.UnionTypeNode;

					let unionDeclaredProperties: DeclaredPropertyType[] = [];
					unionTypeNode.types.forEach(t => {
						unionDeclaredProperties.push(this.getDeclaredPropertyType(t));
					});

					return new DeclaredPropertyTypeUnionType(unionDeclaredProperties);
					break;

				case ts.SyntaxKind.ArrayType:
					const arrayTypeNode = type as ts.ArrayTypeNode;

					return this.getDeclaredPropertyArrayType(arrayTypeNode.elementType);
					break;

				case ts.SyntaxKind.TypeReference:
					const typeReferenceNode = type as ts.TypeReferenceNode;
					const tsSymbol = this.tsChecker.getSymbolAtLocation(typeReferenceNode.typeName);

					if (tsSymbol !== undefined) {
						if (tsSymbol.escapedName.toString() === "Array" && typeReferenceNode.typeArguments?.length === 1) {
							return this.getDeclaredPropertyArrayType(typeReferenceNode.typeArguments[0]);
						}

						const typeAliasDeclaration = this.getTypeAliasDeclarationForSymbol(tsSymbol);
						if (typeAliasDeclaration !== null) {
							this.tags.add(TAGS.ALIAS);
							return this.getDeclaredPropertyType(typeAliasDeclaration.type);
						}

						const interfaceForSymbol = this.getInterfaceForSymbol(tsSymbol);
						if (interfaceForSymbol !== null) {
							return new DeclaredPropertyTypeInterface(interfaceForSymbol);
						}

						const typeParameter = this.getTypeParameterForSymbol(tsSymbol);
						if (typeParameter !== null) {
							this.tags.add(TAGS.GENERICS_FUNCTION);
							return this.getPropertyTypeGeneric(typeParameter);
						}
					}

					return new DeclaredPropertyTypeReferenceType(typeReferenceNode.getText());

					break;

				case ts.SyntaxKind.TupleType:
					const tupleTypeNode = type as ts.TupleTypeNode;

					let tupleDeclaredProperties: DeclaredPropertyType[] = [];
					tupleTypeNode.elementTypes.forEach(t => {
						tupleDeclaredProperties.push(this.getDeclaredPropertyType(t));
					});

					this.tags.add(TAGS.TUPLE);
					return new DeclaredPropertyTypeTupleType(tupleDeclaredProperties);
					break;

				case ts.SyntaxKind.AnyKeyword:
					this.tags.add(TAGS.ANY);

					return new DeclaredPropertyTypeAnyKeyword();

				case ts.SyntaxKind.UndefinedKeyword:
					this.tags.add(TAGS.UNDEFINED);

					return new DeclaredPropertyTypeUndefinedKeyword();
			}
		}

		let parameterType = type ? type.getText() : "";

		return new DeclaredPropertyTypePrimitiveKeyword(parameterType)
	}

	private getInterfaceForSymbol(tsSymbol: ts.Symbol) : DeclaredInterface | null {
		const interfaceDeclarations = tsSymbol.declarations.filter(d => {
			return (
				(d.kind === ts.SyntaxKind.InterfaceDeclaration) &&
				(d.getSourceFile().fileName === this.sourceFile.fileName)
			);
		}) as ts.InterfaceDeclaration[];

		if (interfaceDeclarations.length === 0) {
			return null;
		}

		return this.getDeclaredInterface(interfaceDeclarations[0] as SimplifiedInterfaceDeclaration);
	}

	private getTypeAliasDeclarationForSymbol(tsSymbol: ts.Symbol) : ts.TypeAliasDeclaration | null {
		const typeAliasDeclarations = tsSymbol.declarations.filter(d => {
			return (
				(d.kind === ts.SyntaxKind.TypeAliasDeclaration) &&
				(d.getSourceFile().fileName === this.sourceFile.fileName)
			);
		}) as ts.TypeAliasDeclaration[];

		if (typeAliasDeclarations.length === 0) {
			return null;
		}

		return typeAliasDeclarations[0];
	}

	private getTypeParameterForSymbol(tsSymbol: ts.Symbol): ts.TypeParameterDeclaration | null {
		const typeParameters = tsSymbol.declarations.filter(d => {
			return (
				(d.kind === ts.SyntaxKind.TypeParameter) &&
				(d.getSourceFile().fileName === this.sourceFile.fileName)
			);
		}) as ts.TypeParameterDeclaration[];

		if (typeParameters.length === 0) {
			return null;
		}

		return typeParameters[0];
	}

	private getDeclaredPropertyArrayType(node: ts.TypeNode): DeclaredPropertyArrayType {
		this.tags.add(TAGS.ARRAY);
		return new DeclaredPropertyArrayType(
			this.getDeclaredPropertyType(node)
		);
	}
}