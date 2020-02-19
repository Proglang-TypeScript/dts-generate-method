import { Difference } from "./difference/Difference";
import { ConstructorParameterTypeDifference } from "./difference/ConstructorParameterTypeDifference";

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

		differences = differences.concat(this.compareConstructorParameters(exportedClassActual, exportedClassExpected));

		return differences;
	}

	private getModuleTemplate(parsedDeclarationFile: any) {
		return "module-class";
	}

	private getNameExportedClass(parsedDeclarationFile: any): string {
		return parsedDeclarationFile.exportAssignments.shift() || "";
	}

	private getClassByName(parsedDeclarationFile: any, name: string): { [key: string]: any } {
		let classes: [{ [key: string]: any }] = parsedDeclarationFile.classes;
		let classesWithName = classes.filter((c => {
			return (c.name === name);
		}));

		if (classesWithName.length === 0) {
			throw "No class with name '" + name + "'";
		}

		return classesWithName.shift() || {};
	}

	private compareConstructorParameters(classActual: { [key: string]: any }, classExpected: { [key: string]: any }) : Difference[] {
		let parametersActual = this.extractParametersFromConstructor(classActual);
		let parametersExpected = this.extractParametersFromConstructor(classExpected);

		let differences : Difference[] = [];
		parametersActual.forEach(parameterActual => {
			parametersExpected.forEach(parameterExpected => {
				if (parameterActual.name === parameterExpected.name) {
					if (JSON.stringify(parameterActual.type) !== JSON.stringify(parameterExpected.type)) {
						differences = differences.concat(new ConstructorParameterTypeDifference(
							0,
							parameterActual.name,
							parameterExpected.type,
							parameterActual.type
						));
					}
				}
			});
		});

		return differences;
	}

	private extractParametersFromConstructor(parsedClass: { [key: string]: any }): { [key: string]: any }[] {
		if (parsedClass.constructors.length === 0) {
			return [];
		}

		return parsedClass.constructors[0].parameters;
	}
}