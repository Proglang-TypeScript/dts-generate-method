import ts from 'typescript';
import { DeclaredNamespace } from './model/DeclaredNamespace';
import { ASTNodesHandler } from './ASTNodesHandler';
import { AddFunction } from './AddFunction';
import { AddInterface } from './AddInterface';

import fs from 'fs';
import { AddClass } from './AddClass';

export default class DeclarationFileParser {
  private astNodesHandler: ASTNodesHandler;
  private program: ts.Program;
  private checker: ts.TypeChecker;
  private sourceFile: ts.SourceFile;
  tags: Set<string>;

  constructor(fileName: string) {
    this.program = ts.createProgram([fileName], {});

    this.checker = this.program.getTypeChecker();

    this.sourceFile = this.program.getSourceFiles().filter((s) => {
      return s.fileName === fileName;
    })[0];

    this.tags = new Set<string>();

    this.astNodesHandler = new ASTNodesHandler(this.checker, this.sourceFile, this.tags);
  }

  parse(): DeclaredNamespace {
    let declarationMap = new DeclaredNamespace('__GLOBAL__');

    this.addSyntaxErrors(this.sourceFile.fileName, declarationMap);

    ts.forEachChild(this.sourceFile, this.visit(declarationMap));

    this.astNodesHandler.fixCircularReferences();

    return declarationMap;
  }

  private visit(declarationMap: DeclaredNamespace) {
    let dis = this;

    return function (node: any) {
      switch (node.kind) {
        case ts.SyntaxKind.ExportAssignment:
          const exportAssignmentNode = node as ts.ExportAssignment;

          declarationMap.addExportAssignment(exportAssignmentNode.expression.getText());
          break;

        case ts.SyntaxKind.ModuleDeclaration:
          let declaredNamespace = dis.astNodesHandler.addNamespace(
            node as ts.ModuleDeclaration,
            declarationMap,
          );

          ts.forEachChild(node, dis.visit(declaredNamespace));
          break;

        case ts.SyntaxKind.FunctionDeclaration:
          dis.astNodesHandler.addFunctionDeclaration(
            node as ts.FunctionDeclaration,
            declarationMap as AddFunction,
          );

          break;

        case ts.SyntaxKind.InterfaceDeclaration:
          dis.astNodesHandler.addInterfaceDeclaration(
            node as ts.InterfaceDeclaration,
            declarationMap as AddInterface,
          );

          break;

        case ts.SyntaxKind.ClassDeclaration:
          dis.astNodesHandler.addClassDeclaration(
            node as ts.ClassDeclaration,
            declarationMap as AddClass,
          );

          break;

        default:
          ts.forEachChild(node, dis.visit(declarationMap));
      }
    };
  }

  private addSyntaxErrors(fileName: string, declarationMap: DeclaredNamespace) {
    const servicesHost: ts.LanguageServiceHost = {
      getScriptFileNames: () => [fileName],
      getScriptVersion: (fileName: string) => '1',
      getScriptSnapshot: (fileName: string) => {
        if (!fs.existsSync(fileName)) {
          return undefined;
        }

        return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
      },
      getCurrentDirectory: () => process.cwd(),
      getCompilationSettings: () => {
        return { module: ts.ModuleKind.CommonJS };
      },
      getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
      fileExists: ts.sys.fileExists,
      readFile: ts.sys.readFile,
      readDirectory: ts.sys.readDirectory,
    };

    const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

    let diagnostics = services
      .getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(fileName))
      .concat(services.getSemanticDiagnostics(fileName));

    diagnostics.forEach((diagnostic) => {
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);

        declarationMap.errorMessages.push(
          `Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`,
        );
      } else {
        declarationMap.errorMessages.push(`Error: ${message}`);
      }
    });

    declarationMap.errors = diagnostics.length !== 0;
  }
}
