import Difference from "../difference/Difference";
import { Comparison } from "./comparison";
import { DeclaredNamespace } from "../parser/model/DeclaredNamespace";
import { DeclaredFunction } from "../parser/model/DeclaredFunction";
import FunctionMissingDifference from "../difference/FunctionMissingDifference";
import FunctionExtraDifference from "../difference/FunctionExtraDifference";
import { FunctionParametersComparison } from "./functionParametersComparison";

export class FunctionsComparison implements Comparison {
	private functionsExpected: DeclaredFunction[];
	private functionsActual: DeclaredFunction[];
	private parsedExpectedFile: DeclaredNamespace;
	private parsedActualFile: DeclaredNamespace;

	constructor(
		functionsExpected: DeclaredFunction[],
		functionsActual: DeclaredFunction[],
		parsedExpectedFile: DeclaredNamespace,
		parsedActualFile: DeclaredNamespace
	) {
		this.functionsExpected = functionsExpected;
		this.functionsActual = functionsActual;
		this.parsedExpectedFile = parsedExpectedFile;
		this.parsedActualFile = parsedActualFile;
	}

	compare() : Difference[] {
		let differences : Difference[] = [];

		const actualFunctionsSet = new Set<string>(this.functionsActual.map(f => f.name));
		const expectedFunctionsSet = new Set<string>(this.functionsExpected.map(f => f.name));

		this.functionsExpected.forEach(functionExpected => {
			if (!actualFunctionsSet.has(functionExpected.name)) {
				differences.push(new FunctionMissingDifference(functionExpected));
			}
		});

		this.functionsActual.forEach(functionActual => {
			if (!expectedFunctionsSet.has(functionActual.name)) {
				differences.push(new FunctionExtraDifference(functionActual));
			}
		});

		differences = differences.concat(
			this.compareParameters()
		);

		return differences;
	}

	private compareParameters(): Difference[] {
		let differences : Difference[] = [];

		this.functionsExpected.forEach(functionExpected => {
			this.functionsActual.forEach(functionActual => {
				if (functionExpected.name === functionActual.name) {
					differences = differences.concat(
						new FunctionParametersComparison(
							functionExpected,
							functionActual,
							this.parsedExpectedFile,
							this.parsedActualFile
						).compare()
					)
				}
			});
		});

		return differences;
	}
}