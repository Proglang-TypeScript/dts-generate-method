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

		const actualFunctionsSet = new Set<string>(this.functionsActual.map(this.getFunctionIdentifier));
		const expectedFunctionsSet = new Set<string>(this.functionsExpected.map(this.getFunctionIdentifier));

		this.functionsExpected.forEach(functionExpected => {
			if (!actualFunctionsSet.has(this.getFunctionIdentifier(functionExpected))) {
				differences.push(new FunctionMissingDifference(functionExpected));
			}
		});

		this.functionsActual.forEach(functionActual => {
			if (!expectedFunctionsSet.has(this.getFunctionIdentifier(functionActual))) {
				differences.push(new FunctionExtraDifference(functionActual));
			}
		});

		differences = differences.concat(
			this.compareAllParameters()
		);

		return differences;
	}

	private compareAllParameters(): Difference[] {
		let differences : Difference[] = [];

		const functionsWithNoDifferences = new WeakSet<DeclaredFunction>();
		const functionsPerDifferences = new WeakMap<
			Difference, {
				functionExpected: DeclaredFunction,
				functionActual: DeclaredFunction
			}
		>();

		this.functionsExpected.forEach(functionExpected => {
			this.functionsActual.forEach(functionActual => {
				if (this.getFunctionIdentifier(functionExpected) === this.getFunctionIdentifier(functionActual)) {
					const functionDifferences = new FunctionParametersComparison(
						functionExpected,
						functionActual,
						this.parsedExpectedFile,
						this.parsedActualFile
					).compare();

					if (functionDifferences.length === 0) {
						functionsWithNoDifferences
							.add(functionExpected)
							.add(functionActual);
					}

					functionDifferences.forEach(d => {
						functionsPerDifferences.set(d, {functionExpected, functionActual});
					});

					differences = differences.concat(functionDifferences);
				}
			});
		});

		return differences.filter(d => {
			const functionsPerDifference = functionsPerDifferences.get(d);

			if (functionsPerDifference === undefined) {
				return true;
			}

			return !functionsWithNoDifferences.has(functionsPerDifference.functionExpected) &&
				!functionsWithNoDifferences.has(functionsPerDifference.functionActual);
		});
	}

	private getFunctionIdentifier(f: DeclaredFunction) {
		return `${f.name}:${f.returnType}`;
	}
}