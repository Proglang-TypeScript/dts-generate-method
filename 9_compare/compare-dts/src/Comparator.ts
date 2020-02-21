import { Difference } from "./difference/Difference";
import { ClassDeclaration } from "./parsed-model/class";
import { MethodDeclaration } from "./parsed-model/method";
import { parse } from "querystring";
import { MethodParametersComparison } from "./comparison/methodParametersComparison";

export class Comparator {
	compare(parsedExpectedFile: any, parsedActualFile: any) : Difference[] {
		let moduleTemplateExpectedFile = this.getModuleTemplate(parsedExpectedFile);
		let moduleTemplateActualFile = this.getModuleTemplate(parsedActualFile);
	
		let exportedClassExpected = this.getClassByName(
			parsedExpectedFile,
			this.getNameExportedClass(parsedExpectedFile)
		);

		let exportedClassActual = this.getClassByName(
			parsedActualFile,
			this.getNameExportedClass(parsedActualFile)
		);

		let differences: Difference[] = [];

		differences = differences.concat(
			this.compareConstructorParameters(exportedClassExpected, exportedClassActual),
			this.compareMethodsParameters(exportedClassExpected, exportedClassActual)
		);

		return differences;
	}

	private getModuleTemplate(parsedDeclarationFile: any) {
		return "module-class";
	}

	private getNameExportedClass(parsedDeclarationFile: any): string {
		if (parsedDeclarationFile.exportAssignments.length === 0) {
			return "";
		}

		return parsedDeclarationFile.exportAssignments[0];
	}

	private getClassByName(parsedDeclarationFile: any, name: string): ClassDeclaration {
		let classes: [ClassDeclaration] = parsedDeclarationFile.classes;
		let classesWithName = classes.filter((c => {
			return (c.name === name);
		}));

		if (classesWithName.length === 0) {
			throw "No class with name '" + name + "'";
		}

		return classesWithName[0];
	}

	private compareConstructorParameters(classExpected: ClassDeclaration, classActual: ClassDeclaration) : Difference[] {
		return new MethodParametersComparison(
			this.getConstructorFromClass(classExpected),
			this.getConstructorFromClass(classActual)
		).compare();
	}

	private compareMethodsParameters(classExpected: ClassDeclaration, classActual: ClassDeclaration) : Difference[] {
		let differences : Difference[] = [];

		classExpected.methods.forEach(methodExpected => {
			classActual.methods.forEach(methodActual => {
				if (methodExpected.name === methodActual.name) {
					differences = differences.concat(
						new MethodParametersComparison(
							methodExpected,
							methodActual
						).compare()
					)
				}
			});
		});

		return differences;
	}

	private getConstructorFromClass(parsedClass: ClassDeclaration) : MethodDeclaration {
		if (parsedClass.constructors.length === 0) {
			return {
				name: "",
				parameters: [],
				returnType: ""
			};
		}

		return parsedClass.constructors[0];
	}
}