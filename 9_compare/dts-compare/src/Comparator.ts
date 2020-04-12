import Difference from "./difference/Difference";
import { DeclaredClass } from "./parser/model/DeclaredClass";
import { DeclaredFunction } from "./parser/model/DeclaredFunction";
import { MethodParametersComparison } from "./comparison/methodParametersComparison";
import { DeclaredNamespace } from "./parser/model/DeclaredNamespace";
import TemplateDifference from "./difference/TemplateDifference";

export default class Comparator {
	compare(parsedExpectedFile: DeclaredNamespace, parsedActualFile: DeclaredNamespace) : Difference[] {
		let moduleTemplateExpectedFile = this.getModuleTemplate(parsedExpectedFile);
		let moduleTemplateActualFile = this.getModuleTemplate(parsedActualFile);
	
		let differences: Difference[] = [];

		if (moduleTemplateExpectedFile !== moduleTemplateActualFile) {
			differences = differences.concat(new TemplateDifference(moduleTemplateExpectedFile, moduleTemplateActualFile));
		} else {
			differences = differences.concat(this.compareTemplate(
				parsedExpectedFile,
				parsedActualFile,
				moduleTemplateExpectedFile
			));
		}

		return differences;
	}

	private compareTemplate(parsedExpectedFile: DeclaredNamespace, parsedActualFile: DeclaredNamespace, template: string): Difference[] {
		const compareFunctions: { [k: string] : (a: DeclaredNamespace, b: DeclaredNamespace) => Difference[] } = {
			'module-class': this.compareTemplateModuleClass.bind(this)
		};

		if (template in compareFunctions) {
			return compareFunctions[template](parsedExpectedFile, parsedActualFile);
		} else {
			return [];
		}
	}

	private compareTemplateModuleClass(parsedExpectedFile: DeclaredNamespace, parsedActualFile: DeclaredNamespace): Difference[] {
		let exportedClassExpected = this.getClassByName(
			parsedExpectedFile,
			this.getFirstExportAssignment(parsedExpectedFile)
		);

		let exportedClassActual = this.getClassByName(
			parsedActualFile,
			this.getFirstExportAssignment(parsedActualFile)
		);

		let differences: Difference[] = [];
		return differences.concat(
			this.compareConstructorParameters(exportedClassExpected, exportedClassActual, parsedExpectedFile, parsedActualFile),
			this.compareMethodsParameters(exportedClassExpected, exportedClassActual, parsedExpectedFile, parsedActualFile)
		);
	}

	private getModuleTemplate(parsedDeclarationFile: DeclaredNamespace) {
		if (parsedDeclarationFile.exportAssignments.length > 1) {
			return "module";
		}

		try {
			const c = this.getClassByName(
				parsedDeclarationFile,
				this.getFirstExportAssignment(parsedDeclarationFile)
			);

			if (c) {
				return "module-class";
			}
		} catch (error) {}

		return "module-function";
	}

	private getFirstExportAssignment(parsedDeclarationFile: DeclaredNamespace): string {
		if (parsedDeclarationFile.exportAssignments.length === 0) {
			return "";
		}

		return parsedDeclarationFile.exportAssignments[0];
	}

	private getClassByName(parsedDeclarationFile: DeclaredNamespace, name: string): DeclaredClass {
		let classes = parsedDeclarationFile.classes;
		let classesWithName = classes.filter((c => {
			return (c.name === name);
		}));

		if (classesWithName.length === 0) {
			throw "No class with name '" + name + "'";
		}

		return classesWithName[0];
	}

	private compareConstructorParameters(
		classExpected: DeclaredClass,
		classActual: DeclaredClass,
		parsedExpectedFile: DeclaredNamespace,
		parsedActualFile: DeclaredNamespace
	) : Difference[] {
		return new MethodParametersComparison(
			this.getConstructorFromClass(classExpected),
			this.getConstructorFromClass(classActual),
			parsedExpectedFile,
			parsedActualFile
		).compare();
	}

	private compareMethodsParameters(
		classExpected: DeclaredClass,
		classActual: DeclaredClass,
		parsedExpectedFile: DeclaredNamespace,
		parsedActualFile: DeclaredNamespace
	) : Difference[] {
		let differences : Difference[] = [];

		classExpected.methods.forEach(methodExpected => {
			classActual.methods.forEach(methodActual => {
				if (methodExpected.name === methodActual.name) {
					differences = differences.concat(
						new MethodParametersComparison(
							methodExpected,
							methodActual,
							parsedExpectedFile,
							parsedActualFile
						).compare()
					)
				}
			});
		});

		return differences;
	}

	private getConstructorFromClass(parsedClass: DeclaredClass) : DeclaredFunction {
		if (parsedClass.constructors.length === 0) {
			return new DeclaredFunction("", "");
		}

		return parsedClass.constructors[0];
	}
}