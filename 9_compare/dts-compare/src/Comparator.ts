import Difference from './difference/Difference';
import { DeclaredClass } from './parser/model/DeclaredClass';
import { DeclaredFunction } from './parser/model/DeclaredFunction';
import { DeclaredNamespace } from './parser/model/DeclaredNamespace';
import TemplateDifference from './difference/TemplateDifference';
import ExportAssignmentDifference from './difference/ExportAssignmentDifference';
import { FunctionsComparison } from './comparison/functionsComparison';

export default class Comparator {
  compare(
    parsedExpectedFile: DeclaredNamespace,
    parsedActualFile: DeclaredNamespace,
  ): ResultComparison {
    const moduleTemplateExpectedFile = this.getModuleTemplate(parsedExpectedFile);
    const moduleTemplateActualFile = this.getModuleTemplate(parsedActualFile);

    let differences: Difference[] = [];

    if (moduleTemplateExpectedFile !== moduleTemplateActualFile) {
      differences = differences.concat(
        new TemplateDifference(moduleTemplateExpectedFile, moduleTemplateActualFile),
      );
    } else {
      differences = differences.concat(
        this.compareTemplate(parsedExpectedFile, parsedActualFile, moduleTemplateExpectedFile),
      );
    }

    return {
      template: moduleTemplateExpectedFile,
      differences,
    };
  }

  private compareTemplate(
    parsedExpectedFile: DeclaredNamespace,
    parsedActualFile: DeclaredNamespace,
    template: string,
  ): Difference[] {
    const compareFunctions: {
      [k: string]: (a: DeclaredNamespace, b: DeclaredNamespace) => Difference[];
    } = {
      'module-class': this.compareTemplateModuleClass.bind(this),
      'module-function': this.compareTemplateModuleFunction.bind(this),
      module: this.compareTemplateModule.bind(this),
    };

    if (template in compareFunctions) {
      return compareFunctions[template](parsedExpectedFile, parsedActualFile);
    } else {
      return [];
    }
  }

  private compareTemplateModule(
    parsedExpectedFile: DeclaredNamespace,
    parsedActualFile: DeclaredNamespace,
  ): Difference[] {
    const exportedFunctionsExpected = parsedExpectedFile.functions;
    const exportedFunctionsActual = parsedActualFile.functions;

    return new FunctionsComparison(
      exportedFunctionsExpected,
      exportedFunctionsActual,
      parsedExpectedFile,
      parsedActualFile,
    ).compare();
  }

  private compareTemplateModuleFunction(
    parsedExpectedFile: DeclaredNamespace,
    parsedActualFile: DeclaredNamespace,
  ): Difference[] {
    const exportAssignmentExpected = this.getFirstExportAssignment(parsedExpectedFile);
    const exportedFunctionsExpected = this.getFunctionsByName(
      parsedExpectedFile,
      exportAssignmentExpected,
    );

    const exportAssignmentActual = this.getFirstExportAssignment(parsedActualFile);
    const exportedFunctionsActual = this.getFunctionsByName(
      parsedActualFile,
      exportAssignmentActual,
    );

    if (exportedFunctionsExpected.length > 0) {
      exportedFunctionsActual.forEach((f) => {
        f.name = exportedFunctionsExpected[0]?.name;
      });
    }

    let differences: Difference[] = [];
    if (exportAssignmentExpected !== exportAssignmentActual) {
      differences = differences.concat(
        new ExportAssignmentDifference(exportAssignmentExpected, exportAssignmentActual),
      );
    }

    differences = differences.concat(
      new FunctionsComparison(
        exportedFunctionsExpected,
        exportedFunctionsActual,
        parsedExpectedFile,
        parsedActualFile,
      ).compare(),
    );

    return differences;
  }

  private compareTemplateModuleClass(
    parsedExpectedFile: DeclaredNamespace,
    parsedActualFile: DeclaredNamespace,
  ): Difference[] {
    const exportedClassExpected = this.getClassByName(
      parsedExpectedFile,
      this.getFirstExportAssignment(parsedExpectedFile),
    );

    const exportedClassActual = this.getClassByName(
      parsedActualFile,
      this.getFirstExportAssignment(parsedActualFile),
    );

    const differences: Difference[] = [];
    return differences.concat(
      this.compareClassConstructorParameters(
        exportedClassExpected,
        exportedClassActual,
        parsedExpectedFile,
        parsedActualFile,
      ),
      this.compareClassMethods(
        exportedClassExpected,
        exportedClassActual,
        parsedExpectedFile,
        parsedActualFile,
      ),
    );
  }

  private getModuleTemplate(parsedDeclarationFile: DeclaredNamespace) {
    try {
      const c = this.getClassByName(
        parsedDeclarationFile,
        this.getFirstExportAssignment(parsedDeclarationFile),
      );

      if (c) {
        return 'module-class';
      }
    } catch (error) {}

    if (
      this.getFunctionsByName(
        parsedDeclarationFile,
        this.getFirstExportAssignment(parsedDeclarationFile),
      ).length > 0
    ) {
      return 'module-function';
    }

    return 'module';
  }

  private getFirstExportAssignment(parsedDeclarationFile: DeclaredNamespace): string {
    if (parsedDeclarationFile.exportAssignments.length === 0) {
      return '';
    }

    return parsedDeclarationFile.exportAssignments[0];
  }

  private getFunctionsByName(
    parsedDeclarationFile: DeclaredNamespace,
    name: string,
  ): DeclaredFunction[] {
    return parsedDeclarationFile.functions.filter((f) => f.name === name);
  }

  private getClassByName(parsedDeclarationFile: DeclaredNamespace, name: string): DeclaredClass {
    const classes = parsedDeclarationFile.classes;
    const classesWithName = classes.filter((c) => {
      return c.name === name;
    });

    if (classesWithName.length === 0) {
      throw "No class with name '" + name + "'";
    }

    return classesWithName[0];
  }

  private compareClassConstructorParameters(
    classExpected: DeclaredClass,
    classActual: DeclaredClass,
    parsedExpectedFile: DeclaredNamespace,
    parsedActualFile: DeclaredNamespace,
  ): Difference[] {
    return new FunctionsComparison(
      classExpected.constructors,
      classActual.constructors,
      parsedExpectedFile,
      parsedActualFile,
    ).compare();
  }

  private compareClassMethods(
    classExpected: DeclaredClass,
    classActual: DeclaredClass,
    parsedExpectedFile: DeclaredNamespace,
    parsedActualFile: DeclaredNamespace,
  ): Difference[] {
    return new FunctionsComparison(
      classExpected.methods,
      classActual.methods,
      parsedExpectedFile,
      parsedActualFile,
    ).compare();
  }
}

export interface ResultComparison {
  template: string;
  differences: Difference[];
}
