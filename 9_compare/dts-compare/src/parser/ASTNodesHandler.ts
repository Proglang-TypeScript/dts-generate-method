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

interface SimplifiedFunctionDeclaration {
	name?: ts.Identifier | ts.StringLiteral | ts.NumericLiteral | ts.PropertyName | undefined;
	type?: ts.TypeNode | undefined;
	parameters: ts.NodeArray<ts.ParameterDeclaration>;
	modifiers?: ts.NodeArray<ts.Modifier> | undefined
}

interface SimplifiedInterfaceDeclaration {
	name?: ts.Identifier;
	members: ts.NodeArray<ts.TypeElement>
}

interface SimplifiedPropertyDeclaration {
	name?: ts.PropertyName | ts.BindingName;
	type?: ts.TypeNode | undefined;
	questionToken?: ts.Token<ts.SyntaxKind.QuestionToken> | undefined;
}

export class ASTNodesHandler {
	private mapSymbolInterfaces: Map<string, DeclaredInterface> = new Map();

	private tsChecker: ts.TypeChecker;

	constructor(tsChecker: ts.TypeChecker) {
		this.tsChecker = tsChecker;
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
		let functionReturnType = node.type ? node.type.getText() : "";

		let declaredFunction = new DeclaredFunction(
			functionName,
			functionReturnType
		);

		node.parameters.forEach(p => {
			const parameterNode = p as ts.ParameterDeclaration;
			declaredFunction.addParameter(this.getDeclaredProperty(parameterNode));
		});

		if (node.modifiers) {
			node.modifiers.forEach(m => {
				declaredFunction.addModifier(m.getText());
			});
		}

		return declaredFunction;
	}

	private getDeclaredInterface(node: SimplifiedInterfaceDeclaration) : DeclaredInterface {
		let declaredInterface = new DeclaredInterface(node.name ? node.name.getText() : "");

		node.members.forEach(m => {
			switch (m.kind) {
				case ts.SyntaxKind.PropertySignature:
					const p = m as ts.PropertySignature;
					declaredInterface.addProperty(this.getDeclaredProperty(p));

					break;

				case ts.SyntaxKind.MethodSignature:
					declaredInterface.addMethod(this.getDeclaredFunction(m as ts.MethodSignature));
					break;

				case ts.SyntaxKind.CallSignature:
					declaredInterface.addCallSignature(this.getDeclaredFunction(m as ts.CallSignatureDeclaration));

				default:
					break;
			}
		});

		const symbol = this.tsChecker.getSymbolAtLocation(node.name as ts.Node);
		if (symbol !== undefined) {
			symbol.declarations.forEach(d => {
				if (d.kind === ts.SyntaxKind.InterfaceDeclaration) {
					this.mapSymbolInterfaces.set(symbol.escapedName.toString(), declaredInterface);
				}
			});
		}

		return declaredInterface;
	}

	private getDeclaredClass(classDeclaration: ts.ClassDeclaration) : DeclaredClass {
		let declaredClass = new DeclaredClass(classDeclaration.name ? classDeclaration.name.getText() : "");

		classDeclaration.members.forEach(m => {
			switch (m.kind) {
				case ts.SyntaxKind.Constructor:
					let constructor = this.getDeclaredFunction(m as ts.ConstructorDeclaration);
					constructor.name = "constructor";

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

		return declaredClass;
	}

	private getDeclaredProperty(p: SimplifiedPropertyDeclaration): DeclaredProperty {
		let parameterName = (p.name ? p.name.getText() : "").trim().replace(/'|"/g, '');

		return new DeclaredProperty(
			parameterName,
			this.getDeclaredPropertyType(p.type),
			(p.questionToken !== undefined)
		);
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

					return new DeclaredPropertyArrayType(
						this.getDeclaredPropertyType(arrayTypeNode.elementType)
					);
					break;

				case ts.SyntaxKind.TypeReference:
					const typeReferenceNode = type as ts.TypeReferenceNode;

					const tsSymbol = this.tsChecker.getSymbolAtLocation(typeReferenceNode.typeName);
					if (tsSymbol !== undefined) {
						let interfaceForSymbol = this.mapSymbolInterfaces.get(tsSymbol.escapedName.toString());
						if (interfaceForSymbol === undefined) {
							let interfaceDeclaration = tsSymbol.declarations.filter(d => {
								return (d.kind === ts.SyntaxKind.InterfaceDeclaration);
							})[0] as ts.InterfaceDeclaration;

							if (interfaceDeclaration) {
								const declaredInterface = this.getDeclaredInterface(interfaceDeclaration as SimplifiedInterfaceDeclaration);
								return new DeclaredPropertyTypeInterface(declaredInterface);
							}
						} else {
							return new DeclaredPropertyTypeInterface(interfaceForSymbol);
						}
					}

					break;
			}
		}

		let parameterType = type ? type.getText() : "";
		return new DeclaredPropertyTypePrimitiveKeyword(parameterType)
	}
}