import * as fs from 'fs';
import commandLineArgs from 'command-line-args';

(function run() {
	const optionDefinitions = [
		{ name: 'generated-file', alias: 'g', type: String, defaultValue: '' },
		{ name: 'definitely-typed-file', alias: 'd', type: String, defaultValue: '' }
	];

	let options = commandLineArgs(optionDefinitions);

	let parsedGeneratedFile = JSON.parse(fs.readFileSync(options['generated-file']).toString());
	let parsedDefinitelyTypedFile = JSON.parse(fs.readFileSync(options['definitely-typed-file']).toString());

	let result = {
		name: Number((extractFunctionName(parsedGeneratedFile) !== extractFunctionName(parsedDefinitelyTypedFile))),
		nameLowerCase: Number((extractFunctionName(parsedGeneratedFile).toLowerCase() !== extractFunctionName(parsedDefinitelyTypedFile).toLowerCase())),
		diffNumberOfFunctions: Math.abs(parsedGeneratedFile.functions.length - parsedDefinitelyTypedFile.functions.length),
		diffTotalNumberOfParameters: Math.abs(extractNumberOfParameters(parsedGeneratedFile) - extractNumberOfParameters(parsedDefinitelyTypedFile)),
		diffNonOptionalNumberOfParameters: Math.abs(extractNonOptionalNumberOfParameters(parsedGeneratedFile) - extractNonOptionalNumberOfParameters(parsedDefinitelyTypedFile)),
		diffFieldsInInterfaces: getDiffOfFieldsInInterfaces(parsedGeneratedFile, parsedDefinitelyTypedFile),
		diffNumberOfInterfaces: getDiffNumberOfInterfaces(parsedGeneratedFile, parsedDefinitelyTypedFile),
		errorsInGenerated: Number((parsedGeneratedFile.errors === true)),
	};

	console.log(Object.values(result).join(","));
})();

function extractFunctionName(parsedDTSFile: any): string {
	return parsedDTSFile.functions[0].name;
}

function extractNumberOfParameters(parsedDTSFile: any): number {
	return parsedDTSFile.functions[0].parameters.length;
}

function extractNonOptionalNumberOfParameters(parsedDTSFile: any): number {
	return parsedDTSFile.functions[0].parameters.filter((p: any) => p.optional === true).length;
}

function getDiffNumberOfInterfaces(parsedGeneratedFile: any, parsedDefinitelyTypedFile: any) : number {
	let numberOfInterfacesGenerated = Object.keys(extractAllInterfaces(parsedGeneratedFile)).length;
	let numberOfInterfacesDefinitely = Object.keys(extractAllInterfaces(parsedDefinitelyTypedFile)).length;

	return Math.abs(numberOfInterfacesGenerated - numberOfInterfacesDefinitely);
}

function getDiffOfFieldsInInterfaces(parsedGeneratedFile: any, parsedDefinitelyTypedFile: any): number {
	let interfacesGeneratedFile = extractAllInterfaces(parsedGeneratedFile);
	let interfacesDefinitelyTyped = extractAllInterfaces(parsedDefinitelyTypedFile);

	let propertiesToCheckGenerated = extractPropertiesFromInterfaces(
		parsedGeneratedFile,
		interfacesGeneratedFile
	);

	let propertiesToCheckDefinitely = extractPropertiesFromInterfaces(
		parsedDefinitelyTypedFile,
		interfacesDefinitelyTyped
	);

	let diff = 0;

	Object.keys(propertiesToCheckGenerated).forEach(p => {
		diff += Number(propertiesToCheckDefinitely[p] === undefined)
	});

	Object.keys(propertiesToCheckDefinitely).forEach(p => {
		diff += Number(propertiesToCheckGenerated[p] === undefined)
	});

	return diff;
}

function extractPropertiesFromInterfaces(parsedDTSFile: any, interfaces: any): Record<string, boolean> {
	let propertiesFromInterfaces: { [name: string]: boolean } = {};
	extractPrimitiveKeywordsFromParameterTypes(parsedDTSFile).forEach((i: any) => {
		let interfaceObj = interfaces[i];

		if (interfaceObj !== undefined) {
			interfaceObj.properties.forEach((p: any) => {
				propertiesFromInterfaces[interfaceObj.name + "." + p.name] = true;
			});
		}
	});

	return propertiesFromInterfaces;
}

function extractAllInterfaces(parsedDTSFile: any): any {
	let allInterfaces: any = {};

	parsedDTSFile.interfaces.forEach((i: any) => {
		allInterfaces[i.name] = i;
	})

	for (const namespaceName in parsedDTSFile.namespaces) {
		if (parsedDTSFile.namespaces.hasOwnProperty(namespaceName)) {
			const namespace = parsedDTSFile.namespaces[namespaceName];

			namespace.interfaces.forEach((i: any) => {
				allInterfaces[i.name] = i;
			});
		}
	}

	return allInterfaces;
}

function extractPrimitiveKeywordsFromParameterTypes(parsedDTSFile: any): string[] {
	let primitiveKeywords: string[] = [];

	parsedDTSFile.functions.forEach((f: any) => {
		f.parameters.forEach((p: any) => {
			switch (p.type.kind) {
				case "primitive_keyword":
					primitiveKeywords.push(p.type.value.split(".").reverse().shift());
					break;
			
				case "union_type":
					p.type.value.forEach((v: any) => {
						if (v.kind === "primitive_keyword") {
							primitiveKeywords.push(v.value.split(".").reverse().shift());
						}
					});
					break;
			}
		});
	});

	return primitiveKeywords;
}